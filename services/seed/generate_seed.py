#!/usr/bin/env python3
"""
Seed generator for the GatheringMIA real-route demo.

Produces 24 synthetic recipients at REAL Little Havana addresses, plus a seeded
door-fact graph with varied confidence ages so decay behaviour is visible in the
demo rather than theoretical.

HARD RULE, enforced by assertions at the bottom of this file:
  Every person in this dataset is fictional. Names are drawn from a fixed list and
  marked synthetic. Phone numbers are all in the 555-01xx block, which is reserved
  for fiction and cannot connect to a real subscriber. No real recipient PII enters
  this effort, ever.

Addresses are real because the route must be real. People are fake because the
route must be safe. That split is the entire reason this demo needs no compliance
shell (see the map's Out of scope section).
"""

import json
import math
import random
from pathlib import Path

HERE = Path(__file__).parent
SEED = 20260823  # fixed, so the demo is reproducible and a bad demo is diagnosable

# LHANC, verified via Nominatim, exact rooftop match
HUB = {
    "id": "hub-lhanc",
    "name": "Little Havana Activities and Nutrition Centers",
    "address": "700 SW 8th St, Miami, FL 33130",
    "lat": 25.7657835,
    "lng": -80.2059883,
}

CAPACITY = 12          # boxes per vehicle, so 24 clients forces 2 routes
N_CLIENTS = 24
MEALS_PER_BOX = 7      # frozen weekly model

# Fictional names. Chosen to reflect Little Havana's actual demographics (68% Hispanic
# across PSA 11) so the demo does not look like it was built for a different county,
# but every one of these is invented.
FIRST = [
    "Ana", "Ramon", "Caridad", "Ernesto", "Dulce", "Ovidio", "Marisol", "Eulalio",
    "Nieves", "Rigoberto", "Amparo", "Casimiro", "Yolanda", "Filiberto", "Esperanza",
    "Gervasio", "Milagros", "Anselmo", "Rosario", "Baldomero", "Consuelo", "Teofilo",
    "Yamile", "Nicasio",
]
LAST = [
    "Restrepo", "Quintana", "Valdespino", "Bencomo", "Arrastia", "Cifuentes",
    "Madrigal", "Portuondo", "Escalante", "Iznaga", "Bustamante", "Cardenal",
    "Ferrer", "Sotolongo", "Machado", "Peñalver", "Guerra", "Alfonso",
    "Betancourt", "Cruzata", "Delgado", "Herrera", "Jimenez", "Lastra",
]

# Door-fact taxonomy v0 (see ticket #28). Built-environment facts only: no PHI.
# half_life_days drives confidence decay; structural facts effectively never decay.
DOOR_FACT_TYPES = {
    "gate_code":            {"half_life_days": 120, "layer": "door"},
    "callbox_sequence":     {"half_life_days": 90,  "layer": "door"},
    "which_door":           {"half_life_days": 365, "layer": "door"},
    "entrance_not_obvious": {"half_life_days": 365, "layer": "door"},
    "unit_numbering":       {"half_life_days": 365, "layer": "door"},
    "steps_count":          {"half_life_days": 3650, "layer": "door"},
    "ramp_present":         {"half_life_days": 3650, "layer": "door"},
    "elevator_present":     {"half_life_days": 730, "layer": "door"},
    "elevator_freight_only": {"half_life_days": 730, "layer": "door"},
    "parking_constraint":   {"half_life_days": 180, "layer": "door"},
    "dog_on_property":      {"half_life_days": 180, "layer": "door"},
    "mailbox_blocks_access": {"half_life_days": 365, "layer": "door"},
}

# The five hard cases the route must exercise, per ticket #26. Each is attached to a
# specific stop index so the demo is deterministic.
# Ages are EXPLICIT, not random, so the number of stale facts is deterministic and the
# demo is legible. Roughly a third should land below the 0.60 reconfirm threshold: enough
# that the driver is asked something at several stops, few enough that it is not nagging.
# (type, value, observed_days_ago)
HARD_CASE_POOL = {
    # key = what the building must be for the fact to be plausible
    "multi": [("callbox_sequence", "Callbox: dial 214 then press CALL, not #", 140),   # STALE
              ("elevator_present", "Elevator on the north side of the lobby", 30)],
    "house": [("steps_count", "Four concrete steps, no rail", 260),
              ("dog_on_property", "Dog in the side yard, stays behind the fence", 210)],  # STALE
    "any_gate": [("gate_code", "Gate code 4412, keypad is on the left post", 200),        # STALE
                 ("which_door", "Use the pedestrian gate, not the vehicle gate", 12)],
    "any_unit": [("unit_numbering", "File says 3B. It is actually 3-B on the SECOND floor; building skips 13", 40)],
    "any_entrance": [("entrance_not_obvious", "Front door faces SW 9th St, not the numbered street", 95),
                     ("parking_constraint", "No stopping on the main road, use the side street", 150)],  # STALE
    "any_mail": [("mailbox_blocks_access", "Mailbox bank blocks the ramp on trash day (Tue)", 60)],
    "any_ramp": [("ramp_present", "Side ramp at the west entrance", 500)],
}


def haversine_m(a_lat, a_lng, b_lat, b_lng):
    r = 6371000.0
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp = math.radians(b_lat - a_lat)
    dl = math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def spread_select(rows, n, hub, min_sep_m=180):
    """Pick n addresses that are geographically spread, so the route is a real route
    and not twelve doors on one block. Greedy farthest-point selection with a minimum
    separation, which also keeps stops from landing on the same building."""
    pool = [r for r in rows if haversine_m(hub["lat"], hub["lng"], r["lat"], r["lon"]) < 2600]
    pool = [r for r in pool if haversine_m(hub["lat"], hub["lng"], r["lat"], r["lon"]) > 250]
    random.shuffle(pool)

    # Ticket #26 requires the route exercise a mid-rise with a callbox. OSM tags only a
    # handful of 3+ storey residential buildings in Little Havana, and plain spread
    # selection misses them, so seed the selection with one deliberately. Without this the
    # callbox and elevator cases are silently never assigned, which is how a demo ends up
    # quietly not testing the thing it was built to test.
    def storeys(r):
        try:
            return int(str(r.get("levels") or 0).split(";")[0])
        except ValueError:
            return 0

    multi = [r for r in pool if r.get("building") == "apartments" or storeys(r) >= 3]
    chosen = [multi[0]] if multi else [pool[0]]
    for cand in pool:
        if cand is chosen[0]:
            continue
        if len(chosen) >= n:
            break
        if all(haversine_m(cand["lat"], cand["lon"], c["lat"], c["lon"]) >= min_sep_m
               for c in chosen):
            chosen.append(cand)
    return chosen


def street_abbrev(s):
    return (s.replace("Southwest ", "SW ").replace("Northwest ", "NW ")
             .replace("Southeast ", "SE ").replace("Northeast ", "NE ")
             .replace("West ", "W ").replace("Street", "St").replace("Avenue", "Ave")
             .replace("Road", "Rd").replace("Court", "Ct").replace("Terrace", "Ter")
             .replace("Place", "Pl"))


def main():
    random.seed(SEED)
    rows = json.load(open(HERE / "addresses-residential.json"))
    picked = spread_select(rows, N_CLIENTS, HUB)
    if len(picked) < N_CLIENTS:
        raise SystemExit(f"only found {len(picked)} suitably spread addresses, need {N_CLIENTS}")

    # Assign hard cases to buildings that can PLAUSIBLY have them, rather than by array
    # index. The first version assigned by index and put a residential callbox and an
    # elevator on a retail storefront at 2009 W Flagler, which is exactly the kind of
    # fabrication the field test exists to catch. Caught here from OSM building tags.
    def is_multi(a):
        lv = a.get("levels")
        try:
            n = int(str(lv).split(";")[0]) if lv else 0
        except ValueError:
            n = 0
        return a.get("building") == "apartments" or n >= 3

    def is_house(a):
        return a.get("building") in ("house", "detached", "bungalow")

    assigned = {}
    used = set()
    for want, cases in HARD_CASE_POOL.items():
        for idx, a in enumerate(picked):
            if idx in used:
                continue
            ok = (is_multi(a) if want == "multi" else
                  is_house(a) if want == "house" else True)
            if ok:
                assigned[idx] = cases
                used.add(idx)
                break

    clients, door_facts = [], []
    for i, a in enumerate(picked):
        addr = f"{a['housenumber']} {street_abbrev(a['street'])}, Miami, FL"
        clients.append({
            "id": f"cli-{i:03d}",                      # opaque. never a name in a URL.
            "synthetic": True,                          # never remove this flag
            "display_name": f"{FIRST[i]} {LAST[i]}",
            "phone": f"(305) 555-{100 + i:04d}"[:14],   # 555-01xx: reserved for fiction
            "address": addr,
            "lat": a["lat"],
            "lng": a["lon"],
            "boxes": 1,
            "meals_per_box": MEALS_PER_BOX,
            "mode": "frozen",
            "funding_code": "O3C2",
            "osm_building": a.get("building"),
            "osm_levels": a.get("levels"),
        })
        # seed door facts with varied ages so decay is visible, not theoretical
        for ftype, value, age in assigned.get(i, []):
            meta = DOOR_FACT_TYPES[ftype]
            conf = 0.5 ** (age / meta["half_life_days"])
            door_facts.append({
                "address_key": addr.lower(),   # keyed to the PROPERTY, never the person
                "type": ftype,
                "value": value,
                "layer": "door",               # PHI-free layer. person layer is separate.
                "observed_days_ago": age,
                "half_life_days": meta["half_life_days"],
                "confidence": round(conf, 4),
                "needs_reconfirm": conf < 0.60,
            })

    out = {
        "generated_by": "services/seed/generate_seed.py",
        "seed": SEED,
        "notice": "ALL PEOPLE IN THIS FILE ARE FICTIONAL. Addresses are real; "
                  "no real recipient data is present or permitted in this effort.",
        "hub": HUB,
        "capacity_boxes": CAPACITY,
        "clients": clients,
        "door_facts": door_facts,
    }

    # --- assertions: the safety rail, not decoration ---
    assert all(c["synthetic"] is True for c in out["clients"])
    assert all("555-" in c["phone"] for c in out["clients"]), "all phones must be fictional"
    assert len({c["id"] for c in out["clients"]}) == N_CLIENTS
    assert all(f["layer"] == "door" for f in out["door_facts"]), "no PHI in the door layer"
    assert math.ceil(N_CLIENTS / CAPACITY) == 2, "capacity must bind into exactly 2 routes"

    (HERE / "seed.json").write_text(json.dumps(out, indent=1))
    print(f"clients: {len(clients)}  door_facts: {len(door_facts)}  "
          f"capacity: {CAPACITY} -> {math.ceil(N_CLIENTS/CAPACITY)} routes")
    d = [round(haversine_m(HUB['lat'], HUB['lng'], c['lat'], c['lng'])) for c in clients]
    print(f"straight-line spread from hub: min {min(d)}m  max {max(d)}m  mean {sum(d)//len(d)}m")
    print(f"facts needing reconfirm at arrival: "
          f"{sum(1 for f in door_facts if f['needs_reconfirm'])}/{len(door_facts)}")


if __name__ == "__main__":
    main()
