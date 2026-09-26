#!/usr/bin/env python3
"""
Field kit for ticket #35: ground-truth the route.

Emits everything needed to actually drive Route A and record what is wrong with it:
  - field-sheet.md   a printable/phone-readable stop-by-stop sheet with per-stop nav links
  - route.gpx        the ordered stop set, loadable into any GPS app
  - observations.csv an empty recording sheet with the exact columns to fill in

The drive itself is the one irreducibly human step on this map. Everything around it is
prepared here so that step costs an afternoon, not a project.
"""

import json
import csv
from pathlib import Path

HERE = Path(__file__).parent
SEED = json.load(open(HERE.parent / "seed" / "seed.json"))
SOLVED = json.load(open(HERE / "solved-route.json"))

CLIENTS = {c["id"]: c for c in SEED["clients"]}
FACTS: dict[str, list] = {}
for f in SEED["door_facts"]:
    FACTS.setdefault(f["address_key"], []).append(f)

HUB = SEED["hub"]


def _fact_load(route):
    """How much door-fact verification a route actually offers."""
    facts = stale = 0
    for sid in route["stop_ids"]:
        for f in FACTS.get(CLIENTS[sid]["address"].lower(), []):
            facts += 1
            stale += 1 if f["needs_reconfirm"] else 0
    return stale, facts


# Drive whichever route actually exercises the door-fact layer.
#
# The first version of this kit hard-coded Route A and produced a sheet with 3 facts and
# ZERO the app would ask about, because the CVRP assigns stops to routes by geography and
# knows nothing about where the hard cases landed. A field test that never triggers the
# feature under test is worse than no field test: it returns a clean result and teaches
# nothing. Pick by fact load, and print the runner-up so the choice is visible.
ROUTE = max(SOLVED["routes"], key=_fact_load)


def gmaps(from_lat, from_lng, to_lat, to_lng):
    return (f"https://www.google.com/maps/dir/?api=1"
            f"&origin={from_lat},{from_lng}&destination={to_lat},{to_lng}"
            f"&travelmode=driving")


def field_sheet() -> str:
    L = []
    L.append(f"# Field sheet: {ROUTE['name']}\n")
    L.append(f"**Hub:** {HUB['name']}, {HUB['address']}\n")
    L.append(f"**{len(ROUTE['stop_ids'])} stops | planned "
             f"{ROUTE['seconds']//60} min driving | {ROUTE['meters']/1000:.1f} km**\n")
    L.append("> Planned time is DRIVING ONLY. It excludes door dwell, which is the number\n"
             "> this drive exists to measure. Expect the real total to be much longer.\n")
    L.append("\n**Every person named below is fictional. Do not knock. Do not ring. "
             "Observe from the public right of way only.**\n")
    L.append("\n---\n")

    prev = (HUB["lat"], HUB["lng"])
    for i, sid in enumerate(ROUTE["stop_ids"], 1):
        c = CLIENTS[sid]
        key = c["address"].lower()
        L.append(f"\n## {i}. {c['address']}\n")
        L.append(f"`{sid}` | {c['display_name']} (fictional) | "
                 f"OSM building: `{c.get('osm_building')}`"
                 + (f", {c.get('osm_levels')} storeys" if c.get("osm_levels") else "") + "\n")
        L.append(f"\n[Navigate here]({gmaps(prev[0], prev[1], c['lat'], c['lng'])})\n")

        fs = FACTS.get(key, [])
        if fs:
            L.append("\n**Seeded door facts (these are GUESSES, verify each):**\n\n")
            for f in fs:
                mark = "ASK" if f["needs_reconfirm"] else "shown"
                L.append(f"- [{mark}] `{f['type']}` conf {f['confidence']:.2f} "
                         f"({f['observed_days_ago']}d) : {f['value']}\n")
        else:
            L.append("\n_No seeded facts. Record anything that would help a stranger find "
                     "this door._\n")

        L.append("\n| record | |\n|---|---|\n")
        L.append("| arrival time | |\n")
        L.append("| seconds curb to door | |\n")
        L.append("| parking: easy / hard / impossible | |\n")
        L.append("| door obvious from the street? | |\n")
        L.append("| seeded facts TRUE / FALSE / cannot tell | |\n")
        L.append("| facts MISSING that a stranger would need | |\n")
        L.append("| signal bars at the door | |\n")
        prev = (c["lat"], c["lng"])

    L.append(f"\n---\n\n## Return to hub\n\n"
             f"[Navigate back]({gmaps(prev[0], prev[1], HUB['lat'], HUB['lng'])})\n")
    L.append("\n## After the drive\n\n")
    L.append("| | planned | actual |\n|---|---|---|\n")
    L.append(f"| driving minutes | {ROUTE['seconds']//60} | |\n")
    L.append(f"| kilometres | {ROUTE['meters']/1000:.1f} | |\n")
    L.append("| total elapsed | n/a | |\n")
    L.append("| median seconds at door | unknown, this is the point | |\n")
    L.append("\n**Sequence errors:** stops where the solved order was obviously wrong to a "
             "human (U-turn across a divided road, far side of a one-way, entrance on a "
             "different street than the address).\n\n")
    L.append("**Dead-zone test:** find a garage, stairwell, or elevator. Confirm 3 stops "
             "with no signal, force-quit the app, relaunch, verify all 3 survived. Note "
             "WHERE, because a real dead zone is intermittent and slow, not the clean loss "
             "of airplane mode.\n")
    return "".join(L)


def gpx() -> str:
    pts = [(HUB["name"], HUB["lat"], HUB["lng"])]
    for i, sid in enumerate(ROUTE["stop_ids"], 1):
        c = CLIENTS[sid]
        pts.append((f"{i}. {sid}", c["lat"], c["lng"]))
    body = "\n".join(
        f'  <wpt lat="{lat}" lon="{lng}"><name>{name}</name></wpt>' for name, lat, lng in pts)
    trk = "\n".join(f'      <trkpt lat="{lat}" lon="{lng}"/>' for _, lat, lng in pts)
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<gpx version="1.1" creator="gatheringmia" '
            f'xmlns="http://www.topografix.com/GPX/1/1">\n{body}\n'
            f'  <trk><name>{ROUTE["name"]}</name><trkseg>\n{trk}\n'
            f'  </trkseg></trk>\n</gpx>\n')


def observations_csv(path: Path):
    cols = ["seq", "stop_id", "address", "osm_building", "arrival_time",
            "curb_to_door_seconds", "parking", "door_obvious", "seeded_facts_verdict",
            "missing_facts", "signal_bars", "sequence_error", "notes"]
    with open(path, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for i, sid in enumerate(ROUTE["stop_ids"], 1):
            c = CLIENTS[sid]
            w.writerow([i, sid, c["address"], c.get("osm_building")] + [""] * 9)


def main():
    (HERE / "field-sheet.md").write_text(field_sheet())
    (HERE / "route.gpx").write_text(gpx())
    observations_csv(HERE / "observations.csv")
    print(f"field-sheet.md    {len(ROUTE['stop_ids'])} stops, per-stop nav links")
    print(f"route.gpx         {len(ROUTE['stop_ids'])+1} waypoints")
    print(f"observations.csv  {len(ROUTE['stop_ids'])} rows, 13 columns")
    for r in SOLVED["routes"]:
        st, tot = _fact_load(r)
        mark = "  <- DRIVING THIS" if r is ROUTE else ""
        print(f"{r['name']}: {tot} facts, {st} the app will ask about, "
              f"{r['seconds']//60} min{mark}")


if __name__ == "__main__":
    main()
