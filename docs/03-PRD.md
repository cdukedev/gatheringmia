# GatheringMIA Product Requirements Document

| | |
|---|---|
| **Version** | 2.0 (supersedes the 2022 bootcamp build entirely) |
| **Date** | August 23, 2026 |
| **Owner** | Corey Duke |
| **Status** | Draft for execution |
| **Inputs** | `00-REVIVAL-AUDIT.md`, `01-DIVERGENCE.md`, `02-MARKET-RESEARCH.md` |
| **Companion** | `04-RN-ARCHITECTURE.md` (technical design) |

---

## 1. The one-paragraph version

GatheringMIA is a **native driver-layer companion app for Older Americans Act
home-delivered-meal providers in Miami-Dade County.** It does not replace the provider's
system of record, and it never claims to. It does four things the incumbents do badly or
not at all: it sequences a route using real road-network drive times instead of
straight-line guesses, it works with no signal inside a concrete stairwell, it captures a
structured **doorstep access graph** that makes a substitute driver as fast as the veteran
whose route they inherited, and it emits clean eCIRTS-shaped units of service so nobody
retypes anything. The wedge is not routing, which is commodity. The wedge is **the
substitute-driver problem**: every provider has one person who is the only one who can run
her route, and when she is out, the route degrades. The business is a
sub-$10,000-per-year per-organisation license priced deliberately inside the federal
micro-purchase threshold, sold to the fifteen home-delivered-meal providers the Alliance
for Aging already funds in PSA 11.

---

## 2. Why this document exists, and what changed

The 2022 build was a two-week bootcamp capstone that grew into a real product idea and then
went dark. Every deployed surface now NXDOMAINs. The revival audit found the code is a
**design artifact, not a foundation**: three distance functions with two of them wrong by
roughly 100x, a `finalDestination` in open water 100 miles south of Miami, a QR scanner
that is a static PNG, and recipient PII flowing through URL path parameters.

More importantly, the git history shows **four separate abandoned re-platforming attempts**
(TypeScript, Next.js, in-app directions, and a React Native branch that is byte-identical to
`main` and was never touched). The project did not stall on product. It stalled on runtime
choice, four times.

**This PRD is written to invert that failure mode.** Its central structural decision is
that **the first three phases ship no consumer-facing app at all.** The compliance shell,
the partner relationship, and the data right come first, because the market research is
unambiguous that those, not the code, are the binding constraint.

### 2.1 The three findings that most changed the plan

**Finding 1: the product already exists, twice, at $250/month.** Food Rescue Hero sells a
"Home Delivery" module with copy naming this exact user. Careit sells "Food Delivery Pro"
at $250/month per hub with route management, a driver board, and ops reporting, and SEO
targets "meals on wheels software." Feature parity is not a strategy.

**Finding 2: the buyer was misidentified.** This is not a food rescue app competing with
Food Rescue Hero. It is a **home-delivered-meals driver app** competing with ServTracker
(3.17 stars on iOS, 3.8 on Android). The buyer is an OAA Title III-C2 provider. The
convenient part: in Miami-Dade, Feeding South Florida is simultaneously a Feeding America
food bank **and** a contracted O3C2 home-delivered-meals provider, so the original
food-bank premise and the Meals on Wheels buyer thesis are the same customer.

**Finding 3: the binding constraint is not technical.** The ADHD divergence critic put it
precisely:

> "Nearly every idea presupposes a screened driver roster and access to a protected client
> list, and not one of them creates either. **The binding constraint is who lets you near
> the door**, which is granted by one named person at one agency, not by a business model."

### 2.2 The uncomfortable finding we are designing around

The same critic flagged something that changes how this product must be *sold*, not just
built:

> "The clipboard is fiction **by choice**, not by technical limitation. The provider, the
> Area Agency on Aging, and the health plan all have a revealed preference for not
> measuring first-attempt failure, minutes above 41F, or missed wellness contacts, because
> the first honest number is discoverable evidence against the buyer. This product's core
> feature is a liability the customer must volunteer to accept."

**Design consequence, and it is a hard requirement:** GatheringMIA never surfaces a
provider's failure data to their funder. The agency owns its data, exports on its own
authority, and controls every outbound share. The pitch is *"here is how you prove you did
well,"* never *"here is how badly you are doing."* See FR-9.4 and NFR-3.

---

## 3. Problem statement

### 3.1 The demand side (verified)

| | |
|---|---|
| Miami-Dade residents 60+ | **629,531** (23% of the county) |
| Miami-Dade elders at or near poverty | ~157,000 |
| **Miami-Dade elders with limited English** | **227,975 (35%)**. One of every two limited-English elders in Florida lives here |
| Miami-Dade food insecurity | **15.1%**, up from 13.7% in 2022, worse than FL (14.4%) and US (14.5%) |
| Florida senior food insecurity | 10.7% vs US 9.2%. **Florida ranks 43rd of 50** |
| Implied food-insecure Miami-Dade seniors | ~50,000 to 67,000 |
| County Meals on Wheels coverage | 270,000 meals/year, which at 7 meals/week is **~740 people continuously** |

The gap is roughly two orders of magnitude.

### 3.2 The supply side (verified)

Meals on Wheels America 2025 Provider Benchmarking Report, 628 providers:

| Provider challenge | % naming it |
|---|---|
| Funding to pay for meals | 71% |
| Food prices | 67% |
| **Recruiting and retaining enough volunteers** | **53%** |
| Gas prices | 42% |

33% have a waitlist, ~36,000 seniors nationally, **average wait 115 days**. And the IRS
charitable mileage rate has been **frozen at 14 cents since 1997** against a 72.5 cent
business rate, so a volunteer driver absorbs roughly 58 cents per mile of real cost.

Miami-Dade County printed the constraint in its own adopted budget: *"In FY 2023-24, a lack
of transportation for potential clients affected enrollment and ultimately impacted the
overall number of participants."* The county is trying to grow delivered meals **54% year
over year (175,000 to 270,000) on a static 4-position staff.**

### 3.3 The problem we are actually solving

Not "volunteers cannot find addresses." Navigation is solved. The problems are:

1. **Route sequences are manual or wrong.** ServTracker's route optimization is a
   *separately licensed upsell*, so every provider that did not buy it runs a manually
   sequenced route today.
2. **The knowledge lives in one person's head.** Every provider has a driver who is the
   only one who can run her route efficiently. When she is out, first-attempt success drops
   and the route runs long.
3. **The record is reconstructed after the fact.** Delivery confirmations get retyped into
   eCIRTS from paper route sheets, which is both a labour cost and an audit weakness.
4. **The app stops working where the recipients are.** The single most telling incumbent
   review: *"the checks don't work all the time and it is frustrating when running up and
   down a building and trying to remember who you already delivered to."* That is a
   concrete high-rise offline failure in the incumbent, today.

---

## 4. Strategy

### 4.1 Positioning

> **GatheringMIA is the driver layer. It is never the system of record.**

The stack in Miami-Dade is fixed and non-negotiable:

```
  eCIRTS (Florida DOEA, state, MANDATORY)
      ^  "Services not reported in eCIRTS will not be reimbursed."
      |
  ServTracker / CERVIS / spreadsheets  (provider ops, billing, rosters)
      ^
      |  clean unit-of-service export + roster import
      |
  GatheringMIA  (driver execution, doorstep capture, proof of delivery)
```

Any pitch that ignores eCIRTS is dismissed in the first meeting. Any product that asks an
agency to abandon its system of record and double-enter data never gets past the program
director.

### 4.2 The wedge: the substitute-driver problem

The divergence ran six isolated cognitive frames. **Two of them, working from opposite
directions (inversion and ant-colony), independently converged on the same idea**, which is
the strongest signal the method produces: a **decaying, per-address doorstep access graph.**

The asset is unit-level access knowledge that only repeated physical presence produces:
gate code, which of three doors, callbox dial sequence, side ramp at the west entrance,
elevator B is freight only, the unit numbering skips 13, the mailbox bank blocks the ramp
on trash day. Google Maps structurally cannot have this. No data broker can scrape it. It
gets more valuable with every delivery.

**The sentence that gets a yes in one meeting is not about software:**

> "Every provider has a Maria who is the only person who can run her route. We will capture
> what Maria knows into a structured file **you own**, for free, and prove it by putting a
> stranger on her route."

### 4.3 The two-layer split that makes it legal

This is the design decision that makes the whole thing shippable:

| | **Door layer** | **Person layer** |
|---|---|---|
| Keyed to | Physical address + unit | Client ID |
| Contains | Facts about the **built environment** | Facts about the **person** |
| Examples | Gate code 4412, use the carport door, elevator B is freight only, three concrete steps and no ramp, callbox dial 3B | Client is deaf so ring twice and wait 90 seconds, caregiver present Mon/Wed, allow four minutes for the walker, refuses if the tote is left on the ground |
| PHI? | **No** | **Yes** |
| Tenancy | Pooled across agencies | Per-agency Postgres schema, row-level security |
| On contract exit | Retained | **Destroyed** |
| Licensable to third parties | **Yes** | Never |

Every fact carries a **type-specific half-life** plus event-driven invalidation, so the
graph decays honestly instead of rotting silently the way a one-time CSV import does:

| Fact type | Half-life |
|---|---|
| Gate code | 120 days |
| Dog in yard | 180 days |
| Caregiver schedule | 60 days |
| Callbox / buzzer state | 90 days |
| Structural (steps, ramp, elevator layout) | Effectively permanent |

**The door layer is the long-term business.** It is PHI-free and keyed to the property, so
one saturated building can be licensed to every courier walking the same halls: paratransit,
pharmacy couriers, home health aide agencies, grocery-benefit delivery. **Meals are the
acquisition channel and the cheapest possible sensor network. They are not the product.**

### 4.4 Sequencing: buy legitimacy before writing code

The four shortlisted plays from the divergence compose into a sequence rather than
competing:

| Play | Role |
|---|---|
| **Route Zero** | Entry. Buy legitimacy for ~$2,600 so a solo builder is a credentialed subcontractor, not an unvetted vendor. |
| **Dark Run** | First deployment mode. Instrument before optimising, so the adoption ask collapses to "let one driver carry a phone." |
| **Threshold** | The asset that accumulates while the above happens. |
| **Floor Captain** | The geometry that makes unit economics work, and the v2 expansion. |

The reason Route Zero comes first is a specific, verified, non-obvious fact: **a solo
operator cannot self-initiate a Florida Level 2 background screening.** A qualified agency
must enter you into the AHCA Clearinghouse. **FDLE VECHS Qualified Entity approval is the
one path** that lets your own entity request national fingerprint-based checks on itself
now and on every driver added later. It takes ten business days and it gates everything
downstream.

### 4.5 What we are explicitly not doing

| Not doing | Why |
|---|---|
| Volunteer scheduling, hour tracking, waivers | **Free** in POINT and Golden, both with polished mobile apps. Cannot be monetised. |
| Case management, OAA reporting, OAAPS filing | WellSky holds **>50% of US AAAs** and was valued north of $3B. Immovable infrastructure. |
| Being the system of record | See §4.1. |
| Food resource discovery / "find a pantry" | Vivery is **free** to all US food banks, 82 banks in 32 states. |
| Becoming an OAA meal provider | The Alliance RFP requires DOEA approval for for-profit contracts and forbids advance funding. Stay a subcontractor. |
| A generic multi-tenant nonprofit marketplace | Banned during divergence as an obvious non-answer. Mon Ami raised $8M, tried the volunteer layer, and left it for state contracts. |
| Betting on a health plan paying in 2026-2027 | Florida has **no HRSN waiver and zero food ILOS**. Federal guidance rescinded March 2025. MA meal benefits fell 65% to 57%. |
| Hardware (temperature probes, LTE buttons) | Flagged as a trap: you inherit a fleet with batteries, pairing failures, and loss, and Emerson plus the 2023 Food Donation Improvement Act already give the liability shield being sold. |
| An automated abuse-report submission | The mandatory-reporter duty under Fla. Stat. 415.1034 is **personal and non-delegable**. Surfacing it is required; performing it is a liability we will not accept. |

---

## 5. Users

### 5.1 Primary: the volunteer driver ("Maria")

Runs a fixed weekday route of 15 to 40 stops. Often 55+ herself. Frequently
Spanish-dominant. Uses a mid-range or older phone, sometimes with a cracked screen and
limited storage. Drives alone with the phone mounted or in a cupholder, hands full of boxes
at every stop.

**What she actually needs:** to know the order, to get to the door, to record what
happened, and to not have the app fight her. **What she does not need:** a dashboard.

Design constraints this imposes, drawn from documented incumbent failures:
- **Never require GPS to be on just to mark a meal delivered.** That is a literal ServTracker complaint.
- **Confirmation must complete in under one second and work with zero bars.** Another literal complaint.
- Large targets, one-handed operation, glanceable in sunlight.
- Spanish first, Haitian Creole second, and not as an afterthought.

> **Research gap, stated honestly:** there is **not one data point from an actual volunteer
> driver** anywhere in nine research dimensions. Every claim about Maria in this section is
> reasoned by proxy from provider surveys and incumbent app reviews. **Phase 1 exists
> primarily to fix this**, and the persona above should be treated as a hypothesis under
> test, not a finding.

### 5.2 Secondary: the route coordinator ("Olga")

Program staff at the provider. Builds the week's routes, assigns drivers, handles the
call-out at 7am when a driver is sick, and reconciles delivery confirmations into eCIRTS.
Often the same person named as the **eCIRTS Contact** on the Alliance roster.

**She is the buyer's champion, the one whose week the product must visibly improve, and the
one who will kill it if it creates double entry.**

### 5.3 Tertiary: the program director

Signs the sub-$10,000 contract without an RFP. Cares about waitlist, monitoring visits, and
whether the volunteer roster is growing or shrinking. **Does not want a dashboard of their
own failures.** See §2.2.

### 5.4 Non-user: the recipient

Homebound, largely elderly, frequently limited-English, often without a smartphone. **The
recipient never uses this app in v1 or v2.** They are the subject of the data, not a user
of the system, which is exactly why the confidentiality and consent requirements in §9 are
load-bearing rather than decorative.

> **Second research gap:** zero recipient-side research exists. Nothing on whether
> app-mediated delivery is wanted, wellness-check preferences, or accessibility needs.

---

## 6. The staged plan

Every phase has an explicit **kill test**. If a phase fails its kill test, the plan changes
rather than the phase repeating.

### Phase 0: Buy legitimacy (weeks 1 to 4, ~$2,600, zero code)

**Do not open a code editor during this phase.**

| Item | Cost | Notes |
|---|---|---|
| Florida LLC (sunbiz.org) | $125 | Same day |
| **FDLE VECHS Qualified Entity application** | ~$75 | **10 business day review. Unblocks everything.** |
| Level 2 screening (Fla. Stat. 435.04) | ~$75 to $110 | Fingerprint, 5-year retention |
| CGL $1M/$2M + hired and non-owned auto | ~$1,200/yr | **Estimate. Never actually quoted in research. Get a real quote.** |
| ServSafe Food Handler | $15 | |
| D-U-N-S number | Free | **Up to 30 business days. Start day one.** Sidesteps Google Play's 12-tester/14-day gate. |
| BAA template, W-9, Route Rider Agreement | Legal review | |

**Deliverable:** a folder that lifts a solo builder out of the auto-exclude pile.

> **Kill test.** Within 30 days of VECHS approval, put the Route Rider Agreement in front of
> five named Miami-Dade providers and ask for **a signature, not a meeting.** The clause
> under test is one sentence:
>
> *"Contractor may capture, retain, and use structured operational data (door access facts,
> arrival and departure timestamps, attempt outcomes) and de-identified aggregate metrics;
> all PHI is held under the attached BAA and never leaves Contractor's encrypted device
> store."*
>
> **If zero of five sign that sentence intact within 30 days, the evidence-is-the-product
> thesis is dead** and the fallback is Phase 1 as a pure passive dark run, which needs a far
> weaker data right and no custody of the meal.
>
> **The labour is welcome everywhere. The data right is the whole business.**

**Also in Phase 0: make the five calls.** All free, all under an hour, each closing a
question the research could not:

1. **Martha Hidalgo, Feeding South Florida** (mhidalgo@feedingsouthflorida.org, x1906): what does your eCIRTS entry workflow look like today, and does the O3C2 route run on paper?
2. **Alliance for Aging contracts staff** (305-670-6500): current procurement calendar, and do subrecipient agreements prohibit a subcontracted driver from retaining de-identified operational data?
3. **Florida DOEA or AHCA, in writing:** does giving a volunteer a client's name, address, and phone constitute "access to personal identification information" under Fla. Stat. 430.0402?
4. **Mapbox sales:** will you sign a HIPAA BAA covering the Navigation SDK and Optimization API?
5. **Careit:** sign up for the free nonprofit account and use Food Delivery Pro for a week. It is the closest thing to this product that exists and nobody has looked at it.

### Phase 1: Ride along and census the annotations (weeks 3 to 6, zero code)

Volunteer as an **unpaid driver, explicitly not as a vendor, with no product mentioned**, at
three Miami-Dade providers. Carry a phone camera and one job: photograph every manifest
annotation, sticky note, laminated card, and dispatch text the regular driver relies on.
Transcribe each into a tally of candidate fact types.

**That tally is the entire schema design input.** It is also the first stage of the
Threshold kill test, and it closes the volunteer-research gap in §5.1.

> **Kill test (Substitution Test, stage one).** Measure two numbers:
> 1. What fraction of stops carry **any** access annotation?
> 2. What fraction of those annotations collapse into **fewer than 25 typed fact types**?
>
> **Gate to proceed: at least 35% of stops annotated and at least 70% typeable.**
>
> **If the free text does not collapse into a schema, there is no graph and you stop
> there.** The load-bearing assumption is that a veteran driver's speed is transferable as
> enumerable per-door facts. If what makes Maria fast is tacit sequencing, two years of
> relationships, and muscle memory, then the graph is a laminated card with a database
> behind it and the product does not exist.

### Phase 2: The dark run (weeks 7 to 18, first code)

Ship the app as a **passive instrument** riding along on one existing route. It changes
nothing about how the route is run. It requires zero process change, zero retraining, and
zero trust. **The adoption ask collapses to "let one driver carry a phone."**

The agency gets one page a week with **four numbers and nothing else**:

1. First-attempt success rate
2. Median door dwell time
3. Route completion time versus baseline
4. Count of address facts in the agency's own export that were **wrong at the door**

That fourth number is the one that sells, because it is a correction the agency wants
rather than a failure they must own.

> **Kill test (Substitution Test, stage two).** Harvest one veteran's 30-stop route into the
> graph for three weeks with a stopwatch baseline. Then hand that route to a driver who has
> **never run it**, with nothing but the app, against a control of the same novice on a
> comparable ungraphed route.
>
> **Kill condition: the graphed novice does not land within 15% of the veteran's route time
> and within 5 percentage points of the veteran's first-attempt success rate.**

### Phase 3: The paid driver layer (months 5 to 9)

Turn the instrument into the product. Full route sequencing, offline-first confirmation,
the access graph in active use, eCIRTS-shaped export, and the first paid contract.

**Pricing: $0.18 per delivered meal, $500/month floor, $2,500/month cap per agency**, which
lands under $10,000/year for a mid-size provider and stays inside the federal micro-purchase
threshold so an operations director can sign without an RFP.

Against a Florida blended cost near $6.95 to $11.00 per home-delivered meal (the county's
own budget implies $6.95), that is roughly 2% of the unit.

> **Unsentimental caveat, carried forward from the divergence and not softened:** if Phase 2
> shows baseline first-attempt success **above 98%**, this price is indefensible on failed
> deliveries alone and you reprice entirely against the documentation and monitoring side.
> Decide this with the Phase 2 data, not now.

> **Kill test.** One provider signs a paid contract within 90 days of the Phase 2 report. If
> the four-number report does not convert a single agency to paying anything, the value is
> not where we think it is.

### Phase 4: Expand (months 10 to 18)

Three doors, in order of evidence:

1. **Horizontal.** Providers 2 through 5 on the Alliance roster. The fragmentation (15 separate HDM providers) means each is an independent sale.
2. **Vertical (Floor Captain).** One senior tower run floor by floor with NFC tags on door frames. Deletes the vehicle routing problem entirely and reaches door-layer saturation in weeks instead of years. The addressable market is **8 to 15 buildings**, which is a market you can walk in a week.
3. **The door layer resold.** PHI-free access facts licensed to other couriers in the same buildings. **This is the actual business; everything above is customer acquisition.**

**Not before Phase 4:** any payer conversation. Plan vendor credentialing, BAA, insurance,
and security review run 9 to 18 months, and no payer buys per-delivery attestation from a
vendor with zero delivered meals.

---

## 7. Functional requirements

Priority: **P0** ships in Phase 2 or 3. **P1** ships in Phase 3. **P2** is Phase 4.

### FR-1: Identity, roles, and screening

| ID | Requirement | Pri |
|---|---|---|
| FR-1.1 | Email or phone authentication with MFA available for all coordinator and admin accounts. No anonymous access to any recipient data, ever. | P0 |
| FR-1.2 | Four roles: **Driver**, **Coordinator**, **Provider Admin**, **Support**. A Driver can see only the stops on **today's** route, and only for the duration of that route. | P0 |
| FR-1.3 | **Volunteer hours meter.** The system meters volunteer hours per driver per calendar month and **hard-gates route assignment at the 20-hour line for unscreened drivers**, per the Fla. Stat. 430.0402 exemption. | P0 |
| FR-1.4 | **Screening pipeline as a multi-check state machine**, not a boolean. Independent pass/fail and independent expiry per check: Level 2 Clearinghouse, national sex offender registry, OIG/SAM exclusion, motor vehicle record, driver license, auto insurance. Peer Meals on Wheels policies run four checks plus an MVR, so this is the competitive baseline, not gold plating. | P0 |
| FR-1.5 | Driver eligibility is a **server-side computed state that can flip to ineligible mid-cycle** (FDLE retained-print arrest notification). The system must be able to **revoke an in-progress route assignment**. A client-cached "approved" boolean is not acceptable. | P0 |
| FR-1.6 | Insurance verification requires a **document upload with an expiry date and a stated bodily-injury minimum** (default 100/300/50), not a self-attested checkbox. Florida requires $0 BI liability, so "state minimum" is a meaningless standard here. | P0 |
| FR-1.7 | Automated re-screen prompts at the 5-year Level 2 expiry. | P1 |

> **Design note.** FR-1.3 is where the surge-dispatch dream from `FoodDonationIdea.docx`
> meets Florida law. A broadcast to "any driver in the zone regardless of home center" can
> only legally reach screened drivers, or drivers still under their monthly cap. **The meter
> is not admin chrome. It is the gate on the entire feature.**

### FR-2: Route construction

| ID | Requirement | Pri |
|---|---|---|
| FR-2.1 | Routes are solved as a genuine **Capacitated Vehicle Routing Problem with Time Windows (CVRPTW)** against a **road-network drive-time matrix**. Straight-line distance is prohibited anywhere in the codebase. | P0 |
| FR-2.2 | **Explicit hot versus frozen mode.** Frozen runs are capacity and cold-chain constrained (boxes per trunk); hot runs are time-window constrained. One magic capacity number fits neither. | P0 |
| FR-2.3 | Per-driver capacity is a **profile attribute** (vehicle size, physical limits, stated preference), not a hard-coded constant, with an inferred suggestion from completion history. | P0 |
| FR-2.4 | Multi-origin data model: **hub, spoke agency, satellite drop**. Feeding South Florida's warehouse is in Pembroke Park and its kitchen is in Palm Beach, so the relevant origin for a Miami-Dade route is often a partner site inside the county, not the food bank. A flat `foodbanks` list is wrong. | P0 |
| FR-2.5 | Coordinator can **manually reorder** any route and the app records that the sequence was overridden, plus optionally why. Coordinators know things the solver does not. | P0 |
| FR-2.6 | Route recomputation when a stop is skipped, deferred, or added mid-route, using cached matrix data when offline. | P1 |
| FR-2.7 | Service-code-aware stops. A stop is **not just an address**: it is a client plus a funding source (O3C2, LSP, CCE, ADI) plus a meal type plus a unit count. LHANC runs hot, frozen, and emergency across six funding codes simultaneously. | P1 |
| FR-2.8 | Per-recipient dietary and modality attributes (kosher, renal, texture-modified) as first-class route constraints. JCS runs a kosher HDM contract. | P1 |

### FR-3: The doorstep access graph

**This is the differentiating feature. Everything else is table stakes.**

| ID | Requirement | Pri |
|---|---|---|
| FR-3.1 | **Two strictly separated graphs.** The **door layer** is keyed to address+unit and contains only built-environment facts, no PHI, poolable across agencies. The **person layer** is keyed to client ID, is PHI, lives in a per-agency schema with row-level security, and is destroyed on contract exit. **They must never share a table.** | P0 |
| FR-3.2 | Facts are **typed**, drawn from the taxonomy produced by the Phase 1 annotation census, with an "other, free text" escape hatch that feeds taxonomy expansion. | P0 |
| FR-3.3 | Every fact carries a **type-specific half-life** and a confidence that decays over time (gate code 120d, dog 180d, caregiver schedule 60d, callbox 90d, structural effectively permanent). | P0 |
| FR-3.4 | **Forced reconfirmation at arrival.** The app surfaces at most **three** decayed facts as full-width yes/no taps. Target interaction time: **under 5 seconds median**. | P0 |
| FR-3.5 | Event-driven invalidation: a failed delivery, a reported move, or a contradicting observation immediately drops confidence regardless of age. | P0 |
| FR-3.6 | **Negative facts with automatic re-test.** "Moved", "in the hospital", "deceased", "refuses", "unsafe after 7pm" suppress a stop for a half-life and then **automatically resurface for re-verification**, so a stale flag does not become a permanent ghost stop. | P1 |
| FR-3.7 | **Hands-full voice capture** as an input fallback, on-device only, never sent to a cloud speech service. | P1 |
| FR-3.8 | **The "your file is wrong" stream.** Every access fact contradicting the agency's system of record (unit number wrong, phone disconnected, client moved, client is in a nursing home, client is deceased) becomes a **reconciliation queue** exported back to the agency. Agencies are monitored on client-record accuracy, so this arrives free as exhaust and is directly valuable. | P1 |

### FR-4: Delivery execution and proof

| ID | Requirement | Pri |
|---|---|---|
| FR-4.1 | **Confirmation must complete in under one second with zero connectivity**, writing to a local append-only log. This is a hard performance requirement, not a target, and it is derived directly from a documented incumbent failure. | P0 |
| FR-4.2 | **Marking a delivery must never require GPS to be enabled.** Location enriches the record when available; it does not gate it. Also a documented incumbent failure. | P0 |
| FR-4.3 | Structured outcome codes, not a binary: delivered to recipient, delivered to caregiver, left per instruction, no answer, refused, address not found, client moved, unsafe to approach, could not access building. | P0 |
| FR-4.4 | Door dwell time captured passively (arrival to confirmation), building a per-recipient dwell distribution. | P0 |
| FR-4.5 | Offline queue with **automatic background flush** on signal restoration, with visible queue depth so the driver can trust it. | P0 |
| FR-4.6 | **The one-tap wellness concern flow.** Surfaces the Florida Abuse Hotline (**1-800-96-ABUSE**), states plainly that **the volunteer personally must report**, records that the prompt was shown and what was selected, and routes an internal alert to the partner agency. **The app must never state or imply it reports on the volunteer's behalf.** | P0 |
| FR-4.7 | Structured wellness observation capture at the door (answered/did not answer, mail piled up, AC off, unsteady, out of medication) routed as a typed alert to the agency. 96% of programs already train drivers to do this on paper. | P1 |
| FR-4.8 | Chain of custody: pickup timestamp, driver identity, delivery timestamp per box, with a configurable time-in-transit threshold flag (commonly 2 hours for hot food) to support the Emerson Act's "all applicable food safety law" condition. | P1 |
| FR-4.9 | **Real barcode or QR scanning at pickup** using the device camera. The current implementation is a static PNG that scans nothing. | P1 |
| FR-4.10 | **NFC tap-to-confirm at the door frame** for high-rise routes where GPS is unusable through poured concrete. | P2 |

### FR-5: Navigation

| ID | Requirement | Pri |
|---|---|---|
| FR-5.1 | Turn-by-turn navigation to the next stop, **without the bait-and-switch in the current build** where the app deep-links out to Google Maps *and* simultaneously navigates internally. Exactly one navigation path is active at a time. | P0 |
| FR-5.2 | A **deep-link-out fallback** for drivers who insist on Waze or Apple Maps, with explicit, obvious handoff and a clean return path that preserves route context. | P0 |
| FR-5.3 | Voice guidance must be implemented with a **ref or functional state updater** so it does not reproduce the stale-closure bug that made the 2023 build announce only the first instruction. | P0 |
| FR-5.4 | Offline map tiles for the active route's bounding area. | P1 |

### FR-6: Coordinator tools

| ID | Requirement | Pri |
|---|---|---|
| FR-6.1 | Roster import by CSV and SFTP. **Assume no API access to CaseWorthy or eCIRTS** until proven otherwise. The CaseWorthy Form API has no public docs, no self-serve signup, and is gated behind a sales conversation. | P0 |
| FR-6.2 | Route build, driver assignment, and publish. | P0 |
| FR-6.3 | **The 7am call-out flow.** Reassign a route to a substitute driver in under 60 seconds, **with the access notes attached.** This is the substitute-driver problem, which is the wedge, so it gets a dedicated first-class flow rather than being a side effect of reassignment. | P0 |
| FR-6.4 | **eCIRTS-shaped unit-of-service export**: client ID, service code (for example O3C2), units delivered, date. Format to be finalised after the Phase 0 call with a named eCIRTS contact. | P0 |
| FR-6.5 | Weekly four-number report (§Phase 2), generated automatically. | P0 |
| FR-6.6 | The reconciliation queue from FR-3.8, reviewable and exportable. | P1 |
| FR-6.7 | Consume a **CERVIS shift** and emit a sequenced manifest, so no incumbent volunteer system has to be displaced at Feeding South Florida. | P2 |

### FR-7: Surge dispatch

The original vision from `FoodDonationIdea.docx`, built for the first time, and constrained
by what Florida law actually permits.

| ID | Requirement | Pri |
|---|---|---|
| FR-7.1 | Each recipient carries a **last-verified-contact freshness clock**. Crossing a configurable staleness threshold, not a schedule, is what raises a stop's priority. | P1 |
| FR-7.2 | When a location's count of stale recipients exceeds a threshold, **broadcast to eligible drivers in the zone regardless of home center**, with the strained location allocated the most help. | P1 |
| FR-7.3 | **The broadcast recipient set is filtered by FR-1.3 and FR-1.5 eligibility.** Legally, it can only reach screened drivers or drivers under their monthly cap. | P1 |
| FR-7.4 | **Claims expire.** A claimed stop is locked for a bounded window and then evaporates back to the pool. This prevents the classic failure where a stop is claimed and silently never served. | P1 |
| FR-7.5 | Geofenced broadcast targeting that actually works. A documented incumbent failure is notifying volunteers about pickups "many states away despite having set my location." | P1 |
| FR-7.6 | Disaster and surge mode: time-boxed, auto-expiring scoped access grants for credentialed outside responders after a named storm, with every access logged. Miami-Dade already operates a pre-wired emergency food coalition and MDIA ran an emergency management challenge in 2025. | P2 |

### FR-8: Driver retention

53% of providers name volunteer recruitment and retention as a top-three challenge, which
is the loudest stated pain in the sector.

| ID | Requirement | Pri |
|---|---|---|
| FR-8.1 | **Route ownership over shift dispatch.** A volunteer adopts a named block of 6 to 10 neighbours on a fixed weekday. Substitution requires handing off the access notes. | P1 |
| FR-8.2 | **The return signal.** Tell a driver what happened to the people on their block. This is the single cheapest retention mechanism available and no incumbent does it. | P1 |
| FR-8.3 | Mileage summary export for the driver's own charitable deduction records. The rate is frozen at 14 cents, but the paperwork is still theirs to file. | P2 |
| FR-8.4 | **Tandem onboarding.** A new driver's first run is shadowed with a veteran. First-run companionship is the strongest known predictor of whether a volunteer returns. | P2 |

### FR-9: Data governance, exposed as product surface

| ID | Requirement | Pri |
|---|---|---|
| FR-9.1 | Per-recipient **informed consent record** with version and timestamp, per 45 CFR 1321.75. This applies with no payer and no HIPAA, so it is a v1 requirement. | P0 |
| FR-9.2 | Full data export in an open format, on the agency's own authority, at any time, without contacting support. Buyers in this category have been burned by platforms going dark. | P0 |
| FR-9.3 | Documented, contractual data escrow and continuity commitment. | P1 |
| FR-9.4 | **The agency controls every outbound share.** No provider metric is ever transmitted to a funder, an AAA, or a payer without an explicit, per-recipient-of-the-data, per-report action by the agency. **This is a product requirement derived from §2.2 and it is not negotiable.** | P0 |
| FR-9.5 | Configurable retention policy per data class, with raw location breadcrumbs deleted after the delivery record is finalised, keeping only arrival events. | P0 |

---

## 8. Data model sketch

```
Organization ──< Site (hub | spoke | satellite)
     │
     ├──< User (Driver | Coordinator | ProviderAdmin | Support)
     │        └──< ScreeningCheck (type, status, completed_at, expires_at)
     │        └──< VolunteerHoursLedger (month, minutes)   ← FR-1.3 gate
     │
     ├──< Client [PHI TENANCY]
     │        ├── consent_record (version, granted_at)
     │        ├── service_authorizations (funding_code, meal_type, units/week)
     │        └──< PersonFact  [PHI]  (type, value, confidence, half_life, ...)
     │
     └──< Route (date, mode: hot|frozen, origin_site_id)
              └──< Stop (client_id, sequence, planned_window, override_flag)
                       └──< DeliveryEvent (outcome_code, dwell_ms, occurred_at,
                                           device_id, location?, queued_at, synced_at)

Address [NO PHI, POOLED, SEPARATE SCHEMA]
     └──< DoorFact (type, value, confidence, half_life,
                    last_confirmed_at, confirmed_by_count)
```

**Three rules that are not negotiable:**

1. `DoorFact` and `PersonFact` **never share a table and never share a schema.** The door
   layer is the licensable asset and it must be provably PHI-free.
2. `Stop` references `Client` **by opaque server-issued ID.** No name, address, or phone
   ever appears in a route parameter, a deep link, a log line, or a crash report. This is
   the direct fix for the most serious defect in the 2022 build.
3. `DeliveryEvent` is **append-only.** Because the app assigns the route, it creates a
   dispatch record that plaintiffs will subpoena, so the assignment and outcome log must be
   immutable and retained.

---

## 9. Non-functional requirements

### NFR-1: Offline is the default, not a degraded mode

| ID | Requirement |
|---|---|
| NFR-1.1 | Every driver action writes to a **local append-only log first** and syncs opportunistically. Network is an optimisation. |
| NFR-1.2 | A full route, including access facts, map tiles for the route bounding box, and the drive-time matrix, must be **prefetched at route start** and fully usable with zero connectivity for the route's duration. |
| NFR-1.3 | The app must survive a **12-story concrete stairwell with no signal** and a force-quit mid-route without losing a single confirmation. |
| NFR-1.4 | Sync conflicts resolve **last-write-wins on the device timestamp**, with server-side detection and a coordinator-visible flag on genuine conflicts. |

### NFR-2: Two data tenancies

| ID | Requirement |
|---|---|
| NFR-2.1 | **Non-PHI tenancy** (self-referred or food-bank-referred, consent-based) and **PHI tenancy** (payer or provider referred) are separated at the schema level with distinct credentials and network segmentation. |
| NFR-2.2 | The trigger for PHI classification is **the contractual relationship, not the content.** A single shared recipients table pulls the entire system into HIPAA scope permanently and irreversibly. |
| NFR-2.3 | Build to the **proposed** HIPAA Security Rule now, not the current one: MFA on all staff access, encryption at rest and in transit, machine-generated asset inventory from IaC, vulnerability scanning, incident response plan, network segmentation. The final rule is delayed to July 2027; every proposed control is already standard practice and cheap in a greenfield build. |
| NFR-2.4 | **No third-party SDK ever receives a recipient identifier or a precise stop coordinate.** Not analytics, not crash reporting, not session replay. |

### NFR-3: The mapping vendor is a compliance decision

**Google Maps Platform Terms of Service forbid transmitting, storing, or processing
HIPAA-regulated data, and Google will not sign a BAA covering Maps.** This is not a pricing
question.

| ID | Requirement |
|---|---|
| NFR-3.1 | The mapping and routing vendor must either (a) sign a BAA, or (b) provably never receive PHI, with the isolation enforced architecturally rather than by convention. |
| NFR-3.2 | **Default: self-hosted OSRM + VROOM for matrices and optimisation**, which sidesteps the BAA question entirely and also removes Google's 30-day coordinate-caching restriction that a permanent recipient-coordinate store would otherwise violate. |
| NFR-3.3 | If a hosted vendor is used, **geocode server-side and pass only anonymous coordinates**, never an identifier or a recipient-specific address string. |
| NFR-3.4 | **Open item:** whether Mapbox will sign a HIPAA BAA is unverified and is a Phase 0 call. The market research contradicts itself here: two dimensions recommend Mapbox on pure cost grounds without mentioning HIPAA at all. |

### NFR-4: Accessibility and language

| ID | Requirement |
|---|---|
| NFR-4.1 | **WCAG 2.1 Level AA** across every driver and coordinator flow. Binding via HHS Section 504 (**May 11, 2027**) and DOJ ADA Title II (**April 26, 2027**), both of which reach this product through its partners. |
| NFR-4.2 | Full VoiceOver and TalkBack support, 4.5:1 minimum contrast, dynamic type to OS maximum without clipping, accessible names on all map annotations, **44x44pt minimum touch targets**. |
| NFR-4.3 | **No colour-only status encoding.** The inherited SVG icon set and zone colours are a known risk. |
| NFR-4.4 | **Spanish at launch, not v2.** 227,975 Miami-Dade elders have limited English and LHANC is overwhelmingly Spanish-speaking. **Haitian Creole in the following release.** |
| NFR-4.5 | Assume a mid-range or older device, limited storage, and a driver operating one-handed in bright sunlight. |

### NFR-5: Security

| ID | Requirement |
|---|---|
| NFR-5.1 | **Zero PII in route parameters, deep links, log lines, or crash reports.** Opaque server-issued IDs only. |
| NFR-5.2 | Encryption at rest on device for the local database, using platform keystore. |
| NFR-5.3 | TLS 1.2+ with certificate pinning on mobile. |
| NFR-5.4 | **Breach runbook designed to Florida's 30-day clock** (Fla. Stat. 501.171), not HIPAA's 60, because on a mixed dataset the shorter clock governs. |
| NFR-5.5 | Immutable audit log of every access to recipient data, retained and exportable for monitoring agencies. |
| NFR-5.6 | Precise geolocation treated as sensitive data with explicit opt-in and a documented retention limit, per the 20 states with comprehensive privacy laws. |

### NFR-6: Operational continuity

| ID | Requirement |
|---|---|
| NFR-6.1 | **Pin an Expo SDK upgrade cadence as an operational requirement.** The support window is ~1 year, and a solo maintainer who lets this sit for two years is back in exactly the dormant state the 2022 build is in today. This is the single most important non-functional requirement in the document, because it is the one the project has already failed once. |
| NFR-6.2 | Crash and performance monitoring from the first production build, with **PII scrubbing verified**, not assumed. |
| NFR-6.3 | Automated end-to-end tests on the delivery-confirmation and offline-sync paths specifically. Those are the paths whose failure destroys trust irrecoverably. |

---

## 10. Success metrics

### Phase 2 (the dark run): are we measuring anything real?

| Metric | Purpose |
|---|---|
| First-attempt success rate | The baseline nobody in the sector currently has |
| Median door dwell | Input to the recovered-capacity argument |
| Route completion time vs. baseline | |
| **Count of agency address facts wrong at the door** | The number that sells |
| **% of stops with at least one captured door fact** | Is the graph accumulating? |

### Phase 3 (the product): does it work?

| Metric | Target |
|---|---|
| **Substitute driver route time vs. veteran** | **Within 15%** |
| **Substitute driver first-attempt success vs. veteran** | **Within 5 points** |
| Confirmation interaction time | **Under 1 second, p95** |
| Arrival fact reconfirmation time | **Under 5 seconds, median** |
| Confirmations lost to connectivity | **Zero** |
| Driver-reported app-caused route delays | Zero |
| Coordinator time spent on eCIRTS reconciliation | Reduced, measured against a Phase 2 baseline |
| **Time to reassign a route to a substitute** | **Under 60 seconds** |

### Business

| Metric | Target |
|---|---|
| Signed data-right agreements (Phase 0) | **≥1 of 5** (kill test) |
| Paying agencies by month 12 | 1 |
| Paying agencies by month 18 | 3 |
| ARR by month 18 | $20K to $40K |
| **Driver 90-day retention** | Measured from Phase 3; **no credible industry baseline exists, so we are establishing one** |

**Honest framing:** the national TAM for this category is $50M to $60M and 412 Food Rescue,
the closest analogue, books $403,791 in licensing revenue after eight years and 18
licensees. **This is a $60K to $450K ARR business from software licensing.** That is a real
business. It is not a venture business, and the plan should not pretend otherwise.

---

## 11. Risks

### 11.1 The three that can kill it

| Risk | Evidence | Mitigation |
|---|---|---|
| **No provider grants a data right** | Untested. The labour is welcome everywhere; the data right is the business. | Phase 0 kill test, 30 days, before any code. Fallback: pure passive dark run. |
| **Door knowledge is not enumerable** | Untested. If Maria's speed is tacit rather than typed facts, the graph is a laminated card with a database behind it. | Phase 1 annotation census, gated at 35% annotated and 70% typeable. |
| **eCIRTS has no import path** | **Unverified and load-bearing.** If it is screen-entry only, "eCIRTS-ready export" degrades to a CSV that staff retype. | Phase 0 call #1. One phone call. |

### 11.2 Structural

| Risk | Mitigation |
|---|---|
| **Free gig logistics.** DoorDash Project DASH is free, guaranteed, insured, 8M+ deliveries. Even 412 Food Rescue supplements volunteers with it. | Answer explicitly: cost at scale, the wellness check a Dasher cannot perform, and coverage where gig supply is thin. Do not pretend the objection is unfair. |
| **The buyer does not want the measurement** (§2.2). | FR-9.4. The agency owns and controls every outbound share. Lead with the corrections stream, not the failure rate. |
| **Incumbents ship a counter-feature.** Careit already SEO-targets "meals on wheels software"; consolidation is active (CaseWorthy rolling up aging services, Better Impact acquiring Galaxy Digital). | Build the thing consolidators cannot copy quickly: the accumulated door layer, which is data, not features. |
| **Alliance procurement may be closed until 2030.** 2024 RFP, contracts from Jan 2025, five annual renewals. | Sell to incumbent providers as a subcontractor, which was the plan anyway. Confirm in Phase 0 call #2. |
| **Volunteer premise is contested.** Three research dimensions rendered three different verdicts on whether volunteers are the asset or the liability, and none adjudicated. | Phase 1 and 2 produce the first real data. Hold the question open rather than assuming. |

### 11.3 Technical and legal

| Risk | Mitigation |
|---|---|
| Google Maps ToS forbids HIPAA data | NFR-3. Self-hosted default. |
| Mapbox RN navigation bridges have **unverified New Architecture support**, and RN 0.82+ is New-Architecture-only | Verify before committing. Fallback is Google's official Beta wrapper at ~10x per-stop cost. |
| Fla. Stat. 430.0402 reading is the researcher's plain-text interpretation, not an agency opinion | Phase 0 call #3, in writing. |
| Google Play background-location review is unbounded in duration | **Design for foreground-only.** iOS geofencing already restarts a terminated app on a region event. Removes the entire gate. |
| Apple review 2 to 5 days, weeks if a background-location question lands | Never put a store submission on a partner's launch date. |
| **Apple nonprofit fee waiver forbids IAP and selling digital goods** | Decide the entity structure before enrolling the developer account. Take SaaS revenue via web billing or off-store contract. |
| 501(c)(3) selling software to nonprofits risks exemption (*B.S.W. Group v. Commissioner*) | Two-entity split: nonprofit runs the pilot and holds grants and credits; for-profit owns and licenses the code. |
| Volunteer driver liability is the largest uninsured exposure, and **was never actually priced in research** | Get a real quote in Phase 0. |

### 11.4 Open questions, ranked

Updated 2026-09-26. Two closed by the demo effort
([map #22](https://github.com/cdukedev/gatheringmia/issues/22)); the rest stand.

1. **Does eCIRTS expose an API or import format?** Gates the entire Florida value
   proposition. **Still the single most load-bearing unanswered question in this document**,
   and it is one call to a named contact away.
2. **Will any provider sign the data-right clause?** Gates the business model.
3. **Is door knowledge enumerable?** Gates the differentiating feature. A **v0 taxonomy now
   exists** (12 typed door facts plus a free-text escape hatch, in
   `services/seed/door_fact_taxonomy.md`), but it is invented from research, not observed.
   The annotation census is still what answers this.
4. **Does 430.0402 reach an app-mediated data handoff?** Gates surge dispatch and driver
   onboarding cost.
5. **Will Mapbox sign a BAA?** No longer gates the architecture: self-hosted OSRM plus
   self-hosted raster tiles sidesteps it entirely. It becomes urgent the moment a real
   provider supplies a client roster.
6. ~~**Do the Mapbox RN navigation bridges support the New Architecture?**~~ **CLOSED: no.
   All dead.** None has published to npm since RN 0.82 made the New Architecture mandatory.
   No in-app turn-by-turn; deep-link out instead.
   ([#24](https://github.com/cdukedev/gatheringmia/issues/24))
7. **What is baseline first-attempt success?** If it is above 98%, the Phase 3 price is
   indefensible on failed deliveries alone and must be restructured around the documentation
   side.
8. **What do volunteer drivers actually carry, want, and quit over?** Zero data exists. The
   field kit for this is built (`services/routing/field-sheet.md`, `route.gpx`,
   `observations.csv`) and unused.
9. **Is "GatheringMIA" clear on trademark, and are the app store names available?** Never
   checked. `gathering-mia.live` is expired and reclaimable by anyone. Note the app now
   reserves the bundle id `dev.cduke.gatheringmia`, which is a claim on nothing legally.

### 11.5 A pattern worth naming

The demo effort produced three defects of a single kind, all caught from data rather than by
reasoning harder:

1. Four of 24 seeded stops were **commercial or retail** buildings on a home-delivery route,
   including a residential callbox assigned to a storefront.
2. The mid-rise case the route was required to exercise was **silently never assigned**,
   because only 5 multi-storey buildings are tagged in the whole area and selection missed
   all of them.
3. The field kit's first version picked a route with **zero facts the app would ask about**,
   so the field test would have returned clean and taught nothing.

Each is the same shape as the defect that most damns the 2022 build: **something that looks
like it is working and is not.** The 2022 route optimiser never reordered a single stop and
nobody noticed for three years.

**The mitigation is not more care. It is asserting the invariant in code.** Every one of the
three is now a generation-time assertion or a selection rule. Treat any claim in this
document that has not been executed as provisional.
---

## 12. Business model

| | |
|---|---|
| **Unit** | Delivered meal, because it is the unit the agency already budgets, bills, and is monitored on |
| **Price** | $0.18 per delivered meal, **$500/month floor, $2,500/month cap per agency** |
| **Why capped** | Keeps a mid-size provider **under $10,000/year**, inside the federal micro-purchase threshold (2 CFR 200.320), so no competitive quotes and no RFP |
| **Structure** | Per organisation, never per driver or per seat. A food bank with 40 volunteers will not pay per seat. |
| **Transparency** | **Publish the price.** ServTracker, Link2Feed, Zippy Meals, and Better Impact are all quote-only. Little Green Light and CharityTracker publish, and they are the healthy small-team analogues. |
| **Benchmark** | Careit $3,000/yr per hub; Food Rescue Hero $9,000 to $18,000/yr; ServTracker ~$4,848/yr plus $8,565 setup; Upper ~$120/mo; Routific $150/mo |

### 12.1 Entity structure

**Two entities.** A 501(c)(3) or fiscally sponsored project runs the Miami pilot, holds the
grants, claims the nonprofit credits, and publishes impact data. A for-profit LLC or PBC
owns the code and licenses it. This avoids the commerciality doctrine problem while
preserving the credits.

Nonprofit credits are material for a routing product: **Google Ad Grants up to $10,000/month
(~$120,000/year)**, **Google Maps Platform credits starting at $250/month**, AWS up to
$5,000, Azure $2,000/year. Fiscal sponsorship costs 10% of gross receipts (15% on government
funds) with a $50,000 annual fundraising minimum at one large sponsor.

### 12.2 Funding path

Not venture. The Miami civic and philanthropic stack is unusually deep: **Tech Equity Miami
($100M consortium)**, **Knight Foundation ($57M+ into the ecosystem since 2012)**, **Give
Miami Day ($43.8M in a single day in 2025)**, and **MDIA ($100,000 on an uncapped
post-money YC SAFE plus a brokered county pilot)**.

**MDIA is gated:** it requires a Delaware C corp, a functioning product, Miami-Dade presence,
**and an open challenge in a matching vertical.** Its verticals explicitly include aging and
assistive technology, and logistics and product delivery, but no such challenge is currently
open. File a challenge-topic proposal and time an application to the next Health or Mobility
round.

**Kroger Zero Hunger Zero Waste ($25,000 to $250,000, rolling, reviewed quarterly)** is the
lowest-friction real grant. **Florida Blue Foundation ($75K to $100K/year for four years)**
is the best-fit Florida funder and also a bridge to the payer side.

**The highest-leverage GTM move is bringing the money with the product**: a co-application
where GatheringMIA is a named line item in the provider's own grant. 77% of nonprofits name
available budget as the barrier; only 12% name board buy-in. **Board approval is a myth for
a sub-$10K tool. The budget line is the blocker.**

**Timing:** Feeding South Florida's fiscal year ends June, so budgets are set in spring.
**Pilot conversations must start by February or March to land in the following fiscal year.**

---

## 13. What "done" means for v1

A single Miami-Dade home-delivered-meals provider runs **one real route, every week, for
twelve consecutive weeks**, entirely on GatheringMIA, and:

- Not one delivery confirmation is lost, including inside buildings with no signal.
- A substitute driver who has never run that route completes it within 15% of the veteran's time.
- The coordinator stops retyping delivery confirmations.
- The agency receives a weekly report it did not have before, containing at least one correction to its own client file that it acts on.
- Nobody involved has to think about the app.

That is the whole of v1. Everything in Phase 4 is what happens after it is true.

