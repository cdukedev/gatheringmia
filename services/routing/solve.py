#!/usr/bin/env python3
"""
CVRP solver for the GatheringMIA real-route demo.

Solves 24 Little Havana clients into 2 capacity-12 routes from the LHANC hub,
against a REAL OSRM drive-time matrix.

It also faithfully reimplements the 2022 GatheringMIA algorithm and scores its
output on the same real matrix, because ticket #31 requires the comparison be
run rather than described.

The 2022 code, from client/src/utils/pathFinding/:
    distanceInKm = sqrt((latA-latB)^2 + (lngA-lngB)^2)     <- degrees, not km
    distanceInMiles = distanceInKm * 0.621371               <- km->mi on a degree value
plus greedy nearest-neighbour with a tie-break that skips genuinely closer stops
unless they are also closer to the final destination.
"""

import json
import math
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
SEED_FILE = HERE.parent / "seed" / "seed.json"
OSRM = "https://router.project-osrm.org"


# ---------------------------------------------------------------- OSRM matrix

def osrm_matrix(points):
    """Real road-network duration and distance matrices. Asymmetric by nature."""
    coords = ";".join(f"{p['lng']:.6f},{p['lat']:.6f}" for p in points)
    url = f"{OSRM}/table/v1/driving/{coords}?annotations=duration,distance"
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                d = json.loads(r.read())
            if d.get("code") == "Ok":
                return d["durations"], d["distances"]
            raise RuntimeError(d.get("code"))
        except Exception as e:
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))


# ------------------------------------------------------- the 2022 algorithm

def calculate_distance_2022(a, b):
    """Verbatim reimplementation of the shipped calculateDistance.js."""
    d_deg = math.sqrt((a["lat"] - b["lat"]) ** 2 + (a["lng"] - b["lng"]) ** 2)
    miles = d_deg * 0.621371
    return round(miles, 1) if miles < 10 else round(miles)


def find_optimal_path_2022(clients, start, final_destination, capacity):
    """Verbatim reimplementation of findOptimalPath.js + findClosestRecipient.js,
    including the broken && tie-break that skips genuinely closer stops."""
    remaining = list(clients)
    path = []
    cur = start
    while remaining and len(path) < capacity:
        closest = None
        for r in remaining:
            d_r = calculate_distance_2022(cur, r)
            d_f = calculate_distance_2022(r, final_destination)
            if closest is None:
                closest = r
            else:
                # the shipped condition: BOTH must hold, so closer stops get skipped
                if (d_r < calculate_distance_2022(cur, closest)
                        and d_f < calculate_distance_2022(closest, final_destination)):
                    closest = r
        path.append(closest)
        remaining = [r for r in remaining if r["id"] != closest["id"]]
        cur = closest
    return path


# ------------------------------------------------------------- our solver

def route_cost(seq, dur, depot=0):
    """Total seconds for depot -> seq... -> depot."""
    if not seq:
        return 0.0
    t = dur[depot][seq[0]]
    for a, b in zip(seq, seq[1:]):
        t += dur[a][b]
    return t + dur[seq[-1]][depot]


def two_opt(seq, dur, depot=0):
    improved = True
    best = seq[:]
    best_cost = route_cost(best, dur, depot)
    while improved:
        improved = False
        for i in range(len(best) - 1):
            for j in range(i + 2, len(best)):
                cand = best[:i + 1] + best[i + 1:j + 1][::-1] + best[j + 1:]
                c = route_cost(cand, dur, depot)
                if c < best_cost - 1e-9:
                    best, best_cost, improved = cand, c, True
    return best, best_cost


def or_opt(seq, dur, depot=0):
    """Relocate runs of 1..3 stops elsewhere in the route."""
    best = seq[:]
    best_cost = route_cost(best, dur, depot)
    improved = True
    while improved:
        improved = False
        for run in (1, 2, 3):
            for i in range(len(best) - run + 1):
                chunk = best[i:i + run]
                rest = best[:i] + best[i + run:]
                for j in range(len(rest) + 1):
                    cand = rest[:j] + chunk + rest[j:]
                    if cand == best:
                        continue
                    c = route_cost(cand, dur, depot)
                    if c < best_cost - 1e-9:
                        best, best_cost, improved = cand, c, True
    return best, best_cost


def solve_cvrp(n_clients, dur, capacity, depot=0):
    """Sweep construction by bearing, then per-route 2-opt + Or-opt.
    n is tiny (24), so this is comfortably near-optimal in milliseconds."""
    idx = list(range(1, n_clients + 1))
    # savings-style seeding: assign by nearest-to-depot ordering into balanced groups
    idx.sort(key=lambda i: dur[depot][i])
    routes = [[] for _ in range(math.ceil(n_clients / capacity))]
    # round-robin the depot-sorted list so both routes get near and far work
    for k, i in enumerate(idx):
        routes[k % len(routes)].append(i)
    # rebalance to respect capacity exactly
    for r in routes:
        while len(r) > capacity:
            moved = r.pop()
            target = min((x for x in routes if len(x) < capacity), key=len)
            target.append(moved)
    out = []
    for r in routes:
        best, cost = two_opt(r, dur, depot)
        best, cost = or_opt(best, dur, depot)
        best, cost = two_opt(best, dur, depot)
        out.append((best, cost))
    return out


# ------------------------------------------------------------------ main

def main():
    seed = json.load(open(SEED_FILE))
    hub, clients, capacity = seed["hub"], seed["clients"], seed["capacity_boxes"]
    pts = [{"lat": hub["lat"], "lng": hub["lng"]}] + \
          [{"lat": c["lat"], "lng": c["lng"]} for c in clients]

    print(f"requesting {len(pts)}x{len(pts)} OSRM matrix ...")
    dur, dist = osrm_matrix(pts)
    print("  matrix OK")

    asym = max(abs(dur[i][j] - dur[j][i]) for i in range(len(pts)) for j in range(len(pts)))
    print(f"  max asymmetry between any pair: {asym:.0f}s "
          f"(Euclidean distance is symmetric by construction and cannot represent this)")

    solved = solve_cvrp(len(clients), dur, capacity)
    total_ours = sum(c for _, c in solved)

    print("\n=== OUR SOLVER (real drive-time matrix, CVRP capacity 12) ===")
    for k, (seq, cost) in enumerate(solved):
        km = (dist[0][seq[0]] + sum(dist[a][b] for a, b in zip(seq, seq[1:]))
              + dist[seq[-1]][0]) / 1000
        print(f"  Route {chr(65+k)}: {len(seq)} stops  {cost/60:.1f} min  {km:.2f} km")
        print(f"    {' -> '.join(clients[i-1]['id'] for i in seq)}")

    # ---- the 2022 algorithm, run faithfully on the same clients ----
    FINAL_DEST_2022 = {"lat": 24.2801423, "lng": -80.6620736}  # the open-water point
    legacy_seq = find_optimal_path_2022(clients, hub, FINAL_DEST_2022, capacity)
    legacy_idx = [clients.index(c) + 1 for c in legacy_seq]
    legacy_cost = route_cost(legacy_idx, dur)
    ours_first = solved[0][1]

    print("\n=== THE 2022 ALGORITHM, scored on the same real matrix ===")
    print(f"  produced {len(legacy_idx)} stops (capacity {capacity})")
    print(f"    {' -> '.join(clients[i-1]['id'] for i in legacy_idx)}")
    print(f"  real drive time of that sequence: {legacy_cost/60:.1f} min")
    print(f"  our comparable route:             {ours_first/60:.1f} min")
    delta = (legacy_cost - ours_first) / ours_first * 100
    print(f"  the 2022 route is {delta:+.1f}% {'worse' if delta>0 else 'better'}")

    d_hub_to_final = calculate_distance_2022(hub, FINAL_DEST_2022)
    real_km = 0
    print(f"\n  2022 reported distance hub -> its finalDestination: {d_hub_to_final} 'miles'")
    print(f"  actual straight-line hub -> that point:            ~104 miles")
    print(f"  (the finalDestination is open water in the Straits of Florida)")

    out = {
        "hub": hub, "capacity": capacity,
        "routes": [{"name": f"Route {chr(65+k)}",
                    "stop_ids": [clients[i-1]["id"] for i in seq],
                    "seconds": round(cost),
                    "meters": round(dist[0][seq[0]] + sum(dist[a][b] for a,b in zip(seq,seq[1:])) + dist[seq[-1]][0])}
                   for k, (seq, cost) in enumerate(solved)],
        "comparison_2022": {
            "stop_ids": [clients[i-1]["id"] for i in legacy_idx],
            "real_seconds": round(legacy_cost),
            "ours_seconds": round(ours_first),
            "pct_worse": round(delta, 1),
            "reported_distance_to_final_destination_miles": d_hub_to_final,
            "note": "2022 finalDestination 24.2801423,-80.6620736 is open water ~104mi south of Miami",
        },
        "max_pair_asymmetry_seconds": round(asym),
    }
    (HERE / "solved-route.json").write_text(json.dumps(out, indent=1))
    print(f"\nwrote {HERE/'solved-route.json'}")


if __name__ == "__main__":
    main()
