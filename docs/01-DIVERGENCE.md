# GatheringMIA Divergence: What Should This Actually Be?

**Method:** ADHD loop. Six cognitive frames generated in strict isolation (no branch saw
another), 7 ideas each, evaluation forbidden during generation. A separate critic pass
then scored every idea 0 to 10 on novelty, viability, and fit, flagged traps, and
clustered by underlying angle. Top 3 non-trap ideas by weighted score
(0.35 novelty + 0.40 viability + 0.25 fit) were deepened.

**Pool:** 42 ideas. 25 flagged as traps. 6 clusters.

**Frames used:** logistics, markets, regulator, inversion, ant colony, remove the
load-bearing assumption.

---

## 1. Brief

**Problem as posed:** revive a dead 2022 volunteer meal-delivery routing app, rebuild it
in React Native, ship it to production.

**Problem as reframed by the divergence:** "port React to React Native" is mechanical
and is not the problem. The real question is what makes an organisation adopt this and
keep using it, who pays, and what is defensible about it beyond a list of addresses and
a map. Every frame independently converged on the same answer to that question, which is
itself the most important finding in this document.

**Banned during generation** (these are the obvious first three answers, and generating
them wastes the run): add auth and a backend then find a pilot; swap the greedy router
for a real VRP solver; build a generic Uber-for-nonprofits marketplace; add gamification;
sell SaaS seats at $X per admin per month.

---

## 2. The convergence warning

The critic was asked to name any assumption the whole pool shared. It found three, and
they are more useful than most of the ideas:

> **1. Everyone assumed the scarce thing is proof, and that a funded institution is
> standing by to buy proof the moment it exists.** But the clipboard is fiction *by
> choice, not by technical limitation*. The provider, the Area Agency on Aging, and the
> health plan all have a revealed preference for **not** measuring first-attempt failure
> rate, minutes above 41F, or missed wellness contacts, because the first honest number
> is discoverable evidence against the buyer. This product's core feature is a liability
> the customer must volunteer to accept.
>
> **2. Nearly every idea presupposes a screened driver roster and access to a protected
> client list, and not one of them creates either.** The binding constraint is who lets
> you near the door. That is granted by one named person at one agency, not by a business
> model.
>
> **3. The pool almost unanimously picks an institutional buyer with procurement**, which
> is the slowest possible counterparty for a solo builder with zero delivery volume and
> no operating history.

Take these seriously. Point 1 means the pitch can never be "here is how badly you are
doing." It has to be "here is how you prove you did well," with the failure data owned by
the agency and never surfaced to their funder without their hand on the switch. Point 2
means the first 90 days are a relationship problem and a background-check problem, not an
engineering problem. Point 3 means every plan below has to produce revenue or a truth
signal before any procurement cycle completes.

---

## 3. The wide set

Six clusters, by underlying angle rather than surface keyword. Score chips are
`[N novelty, V viability, F fit]`. Traps are marked and explained in section 5.

### Cluster A: evidence-is-the-product plays
*The deliverable is an audit-grade record of what happened at a specific door. The route
is merely the machine that produces the record.*

| | Idea | Score |
|---|---|---|
| ★ | Become the delivery provider before the software vendor: stand up the FL entity, pass Level 2 screening under F.S. 435.04, carry CGL plus hired and non-owned auto, then personally drive one real route weekly for 12 consecutive weeks using only this app | `[N8 V7 F10]` |
| | **Dark run**: ship as a passive instrument riding along on one existing route for 6 weeks, changing nothing, reporting only 4 numbers back | `[N6 V8 F9]` |
| | Ship a **reimbursement-artifact generator**, not a routing app: signed geofenced timestamped unit records formatted for OAA Title III-C2 billing, written back into the agency's existing system of record | `[N8 V6 F9]` |
| | Delete "meals are the payload": the product is a signed timestamped **door-event attestation**, the meal box is just the reason someone knocks | `[N8 V6 F9]` |
| | Emit Florida DOEA **CIRTS-shaped unit-of-service records** at drop-off so a Title III-C2 meal becomes an importable service unit | `[N7 V6 F9]` |
| ⚠ | Onboard by importing the agency's DOEA/AAA monitoring findings and Corrective Action Plan, generating fields and reports from the findings | `[N9 V6 F9]` |
| ⚠ | Time-out-of-refrigeration ledger via $50 BLE probe, cumulative minutes above 41F per tote | `[N8 V5 F9]` |
| ⚠ | Build around the **failed** delivery: a no-answer escalation ladder with every rung timestamped | `[N7 V6 F8]` |
| ⚠ | Offline hash-chained attestation ledger signed by Secure Enclave key bound to screened identity | `[N7 V6 F7]` |
| ⚠ | Gate dispatch on live eligibility: AHCA Clearinghouse rap-back, VECHS date, DHSMV status, insurance expiry | `[N8 V4 F8]` |
| ⚠ | Certified in-kind match ledger exported as 2 CFR 200.306 cost-share | `[N5 V5 F8]` |
| ⚠ | Capture 21st Century Cures Act §12006 EVV elements, render as an 837P encounter | `[N8 V3 F6]` |
| ⚠ | BLE/NFC temperature logger per cooler for FDA Food Code 3-501.16 logs and Emerson Act files | `[N6 V4 F7]` |
| ⚠ | Statutory-contact framing ending in a one-tap F.S. 415.1034 abuse-hotline packet | `[N7 V4 F8]` |

### Cluster B: last-200-feet knowledge plays
*The defensible asset is unit-level access knowledge that only repeated physical presence
produces, and that no map vendor or data broker can scrape.*

| | Idea | Score |
|---|---|---|
| ★ | **Doorstep access graph**: per-address structured facts (gate code, which of three doors, dog in yard, client is deaf so ring twice and wait 90 seconds, unit number in the file is wrong, caregiver present Mon/Wed) with confidence decay and a forced "does this still hold?" at every arrival | `[N7 V8 F9]` |
| | Treat **per-door service time** as the scarce resource: learn a dwell distribution per recipient (median 6.5 min, p90 14) plus one-tap fact chips at confirmation | `[N7 V7 F8]` |
| ⚠ | Delete "the recipient is passive": a $10 LTE button or fridge NFC sticker so the household pulls or declines a delivery | `[N8 V4 F6]` |
| ⚠ | Delete "the nonprofit is the customer": sell verified door access as an API per successful contact | `[N8 V2 F4]` |

### Cluster C: change-the-geometry plays
*Rewrite the physical or temporal shape of the problem so the routing question shrinks or
disappears instead of being solved.*

| | Idea | Score |
|---|---|---|
| ★ | Delete "a driver with a car" and "a route": run **one 300-unit senior tower vertically**, floor by floor, with a paid resident captain and NFC tags on door frames | `[N9 V7 F9]` |
| ⚠ | Sealed numbered tote as the unit: one line-haul volunteer moves 60 totes to a freezer micro-hub at a partner church, neighbours claim 10-stop clusters within 1.5 miles | `[N6 V4 F7]` |
| ⚠ | Delete "delivery is scheduled in advance": a dormant power-dependent and heat-vulnerable registry firing only on FPL outage, NWS heat advisory, or boil-water triggers | `[N9 V3 F6]` |
| ⚠ | Delete "the food bank is the hub": make the dialysis clinic the hub, the renal-diet box rides home in the paratransit van the patient is already in | `[N10 V2 F5]` |
| ⚠ | Run the return leg loaded: same driver collects empty totes plus a pre-committed retail rescue stop on the way back | `[N7 V3 F5]` |

### Cluster D: remove-the-dispatcher plays
*Coordination emerges from decaying local state, evaporating claims, and named
relationships, rather than from a central plan or an optimiser.*

| | Idea | Score |
|---|---|---|
| | **Route ownership instead of shift dispatch**: a volunteer adopts a named block of 6 to 10 neighbours on a fixed weekday, with in-app substitution that requires handing off the access notes, and a return signal telling them what happened to the people on their block | `[N5 V8 F8]` |

**The critic dropped this entire frame from scoring. Recovered from the run journal:**

| | Idea (ant colony frame, unscored) |
|---|---|
| ‡ | **Door-level access pheromone**: every completed drop deposits a decaying hint that any driver entering that building inherits, fading unless reconfirmed within 60 days. *(This is the same idea the inversion frame reached independently, from a completely different direction. Two isolated branches converging is the strongest signal in the run.)* |
| ‡ | **The meal box is the ant, not the driver**: an NTAG213 sticker applied at the Feeding South Florida or Farm Share dock carries a claim that evaporates, and an unclaimed box widens its own broadcast radius every 30 minutes until someone scans it. Agency moves from person to object, no dispatcher assigns anything, and the scan-to-scan chain is a real chain of custody. *(This is also the one feature that genuinely requires native NFC plus offline camera, replacing the repo's fake QR-scanner PNG.)* |
| ‡ | **Negative pheromone trails**: no-go marks (in the hospital, moved, deceased, refused, unsafe after 7pm) that suppress a stop for a half-life and then automatically re-test it, so a "moved" flag quietly resurfaces at day 60 instead of rotting into a permanent ghost stop. |
| ‡ | **Last-verified-human-contact is the pheromone and its decay is the billable event**: every recipient carries a freshness clock any driver from any center can reset, and the clock crossing threshold triggers the broadcast, not a schedule. |
| ‡ | **Peer-to-peer trail sync at the loading dock** over MultipeerConnectivity and Android Nearby Connections, server as eventually-consistent archive rather than source of truth. Two drivers idling in the same warehouse bay reconcile claims and access hints in 90 seconds. Flatly impossible in a browser, and it still works during the post-storm FPL outage and cell congestion window. |
| ‡ | **Abolish the route**: never show a list or a plan, only the single strongest-scent stop inside your current radius. Claiming locks it for 20 minutes, then the claim evaporates back to the colony. Capacity is inferred from completion history instead of `deliveryCapacity = 5`. |
| ‡ | **Tandem running for recruitment**: a new driver's first run must be physically shadowed (BLE proximity confirmed) with a veteran, and short-handed signals emit only into that driver's own phone contacts, never a public feed. Growth becomes a local rule executed by drivers rather than a supply side to acquire. |

### Cluster E: payer-side plays
*Stop selling to the organisation whose entire tech budget is one engineer-month, and
invoice the entity that already owes the beneficiary something per member per month.*

| | Idea | Score |
|---|---|---|
| | Make the **wellness observation** the second billable product: a required 20-second structured door-side capture routed as a typed alert to the client's care manager within minutes | `[N7 V5 F9]` |
| ⚠ | Sell the verified delivery event per delivered meal to MA SSBCI food benefits and FL Medicaid LTC plans | `[N6 V4 F8]` |
| ⚠ | Price per completed-and-verified delivery to the entity carrying the liability (SMMC LTC plans, D-SNP food benefits) | `[N6 V4 F8]` |
| ⚠ | Delete "the volunteer is an unpaid stranger": the deliverer is the neighbour already hired under FL SMMC Participant Direction, and the app is their EVV clock and payment rail | `[N8 V3 F5]` |

### Cluster F: price-the-capacity plays
*Treat unpaid volunteer time as inventory that can be booked forward, auctioned,
retained, or denominated in a private currency, so a market mechanism substitutes for
recruitment.*

**Every idea in this cluster was flagged as a trap.** That is a finding, not a gap. See
section 5.

| | Idea | Score |
|---|---|---|
| ⚠ | Hurricane standby capacity market: a June 1 to Nov 30 retainer for maintaining N screened credentialed drivers, plus activation price per drop | `[N9 V3 F6]` |
| ⚠ | Forward contracts on delivery slots sold to D-SNP plans, contracted in August for October fulfillment | `[N8 V3 F7]` |
| ⚠ | Descending-clock auction on perishable loads, reimbursement rising as time-to-spoil shrinks | `[N8 V2 F4]` |
| ⚠ | $0 reserve with auto-escalation on a clock: free volunteer, then mileage-reimbursed, then paid gig leg via Uber Direct or Roadie | `[N8 V3 F6]` |
| ⚠ | Corporate forward block booking: Ryder, Royal Caribbean, Baptist Health buy quarters of volunteer-days ahead, no-show blocks cash-settled | `[N7 V3 F5]` |
| ⚠ | Transferable delivery credits redeemable for a box sent to a person the driver names | `[N9 V2 F4]` |

---

## 4. Converge

Four ideas make the shortlist. One is marked ★ as the non-obvious-but-viable pick.

**1. Route Zero: be the screened subcontractor before you are the software vendor.**
`[N8 V7 F10]` On the list because it is the only idea in the pool that attacks the
binding constraint the critic identified: nobody lets you near the door. It converts a
solo builder from "unvetted vendor" to "credentialed subcontractor" for about $2,600 and
three weeks, which is the cheapest possible purchase of legitimacy. Highest fit score in
the entire pool.

**2. ★ Threshold: the two-layer doorstep access graph.** `[N7 V8 F9]` **This is the
pick.** On the list because two isolated frames reached it independently (the inversion
frame and the ant colony frame, from opposite directions), which is the strongest
convergence signal the method produces. It is also the only idea that names a *defensible
asset* rather than a workflow: unit-level access knowledge that exists nowhere else,
cannot be scraped, and gets more valuable with every delivery. Critically, it splits into
a PHI-free door layer (keyed to the property, poolable, licensable) and a PHI person
layer (per-agency, row-level security, destroyed on exit), which is what makes it legally
shippable at all.

**3. Floor Captain: run one senior tower vertically.** `[N9 V7 F9]` On the list because
it deletes the entire problem the old codebase failed to solve. No car, no route, no VRP,
no broken greedy solver. A 300-unit HUD Section 202 or Miami-Dade PHCD elderly tower
concentrates more homebound seniors behind one lobby than a full day of driving reaches,
and NFC-at-the-door-frame is provably better than GPS through twelve floors of poured
concrete. Highest novelty among viable ideas.

**4. Dark run: ship as a passive instrument first.** `[N6 V8 F9]` On the list as the
fallback with the lowest adoption barrier in the pool. It requires zero process change,
zero retraining, and zero trust: the ask collapses to "let one driver carry a phone."
Highest viability score of any idea. It is the plan B when the data-rights clause in
Route Zero gets refused.

**These four compose rather than compete.** Route Zero is the entry (buy legitimacy),
Dark run is the first deployment mode (instrument before you optimise), Threshold is the
asset that accumulates while you do it, and Floor Captain is the geometry that makes the
unit economics work. That is a sequence, and it is the sequence the PRD is built on.

---

## 5. Traps

25 of 42 ideas were flagged. The pattern is worth reading as a group, because five
distinct categories of failure recur:

**Contingent fees on federal award funds.** The in-kind match ledger ideas
(`markets-3`, `regulator-1`) price per certified match dollar. That is a contingent fee
against federal award funds, generally an **unallowable cost** under federal cost
principles, so the invoice cannot be paid out of the money it unlocks. Two independent
frames walked into the same regulatory wall.

**Duty of care you cannot staff.** The no-answer escalation ladder (`logistics-2`) and
the mandatory-reporter packet (`regulator-6`) both attach an ongoing obligation that a
solo operator cannot cover nights and weekends. The first time a rung is missed, the
timestamped log stops being your evidence and becomes the plaintiff's exhibit. Note that
this same mechanism appears as a *child idea* under Route Zero priced at $12 to $25 per
resolved no-answer, where it works, because there it is a discrete billable event rather
than a standing promise.

**Data feeds you cannot actually get.** Live eligibility gating (`regulator-5`) assumes
access to AHCA Clearinghouse rap-back and DHSMV license status. Clearinghouse rap-back is
scoped to the screening employer and DHSMV status is restricted. Only self-reported
expiry dates are obtainable, which is a different and much weaker product.

**Payer procurement sequencing.** Every direct-to-health-plan idea (`logistics-5`,
`inversion-3`, `markets-1`) names the right buyer and the wrong sequence. Plan vendor
credentialing, BAA, insurance, and security review run 9 to 18 months, and no payer buys
per-meal attestation from a vendor with zero delivered meals. The payer is the year-two
destination, not the year-one entry. The critic also flagged Papa (the Miami-founded
companion-care company) as a **cautionary precedent as much as a proof point**, since its
2022 safety reporting made plans warier of non-clinical workers in members' homes.

**Selling short volatility on unpaid labour.** The entire price-the-capacity cluster
sells a firm forward obligation against a stochastic volunteer supply, and volunteer
no-shows correlate with exactly the weeks demand spikes. The hurricane retainer
(`markets-4`) is the sharpest version: you are selling availability you cannot guarantee,
to the slowest procurement in the county, and your volunteers evacuate on precisely the
day the retainer is activated.

One trap deserves separate mention because it looks like the obvious next move: the
**temperature ledger** (`logistics-3`, `regulator-4`). It fails twice. You inherit a
fleet of $50 probes with batteries, pairing failures, and loss. And the Bill Emerson Good
Samaritan Act plus the Food Donation Improvement Act of 2023 already protect good-faith
donation without a temperature file, so you are selling a shield the customer already
holds. Note that it reappears as a *child idea* under Floor Captain and works there, for
one specific reason: indoors, under two hours, cumulative minutes above 41F becomes a
number you can **win** rather than merely report.

---

## 6. Focus: the three deepened branches

### 6.1 Floor Captain
*The tower is the route, and the product is the door that did not open.*
`[remove-assumption-2, N9 V7 F9]`

**How it works.** Pick exactly one building. Robert King High Towers is 315
elderly-only units at 1405 NW 7th Street, post-RAD project-based Section 8 operated by
Related Urban, with a HUD Service Coordinator on site and an Alliance for Aging Title III
congregate lunch already served in the community room. Epoxy an NTAG 424 DNA tag to each
door frame at 48 inches. Every tap emits a rolling AES-CMAC that cannot be cloned or
replayed, which is proof of presence at a named door at a named minute, something GPS
provably cannot deliver through twelve floors of poured concrete.

The daily work order is not a route. **It is the community room's no-show list**:
residents who signed in for congregate lunch every week and did not come down today. A
paid resident captain (a tenant, roughly 15 hours a week at $18/hr, Level 2 screened
under F.S. 435.04) pushes a cart of trays up the service elevator and works top down,
tapping each frame and logging one of nine outcome codes plus door dwell. A door that
does not open fires a timed ladder, every rung anchored to the same hash chain. At 2pm
the building gets one artifact: doors attempted, doors answered, known absences,
escalations still open. Nobody ever solves a vehicle routing problem again.

**Load-bearing risk.** The property manager refuses, because a daily record of which
doors did not open converts an unknown into a documented duty to act. Related Urban's
counsel reads "we have a timestamped log showing 8C went unanswered for three days" as
discoverable litigation exposure, not as a safety feature. Managers systematically avoid
creating records of known risk. Everything else is downstream of that one signature.

**Kill test.** Two weeks, under $300, zero code. Buy a 50-pack of NTAG stickers and read
them with a stock NFC app. Get one building to let you run 20 doors on a single floor
with a clipboard and a phone. Measure three things: first-attempt no-answer rate among
doors whose residents were expected home; whether the property manager or Service
Coordinator takes any documented action within 24 hours on the list you hand them; and
whether they sign a one-page 90-day access letter after seeing week one. **If no-answer
runs under 3 percent there is no signal worth buying. If the list gets filed with no
action twice running, the buyer does not exist.**

**First step.** Monday at 11:30am, walk into the community room during Title III
congregate lunch, find the site supervisor, and ask one question: *"Can I see today's
sign-in sheet, and what happens to the name of someone who came every Tuesday for a year
and did not come down today?"* Then build a table of every Miami-Dade tower over 200
units designated elderly that hosts an on-site congregate meal site, cross-referencing
the Miami-Dade PHCD developments list against the Alliance for Aging congregate site
directory. **That table is the entire addressable market and it is probably 8 to 15 rows,
which is the point: this is a market you can walk in a week.**

**Who pays.** Unit is one verified door-event. Three payers, staged. The Title III meal
provider at **$1.25 per verified door-event** (their fully loaded cost to put a driver at
one Miami-Dade door is $3 to $5; inside the tower the marginal cost is elevator seconds).
Then the D-SNP with concentrated membership in that building at **$18 PMPM** for verified
in-person contact plus a completed structured screen (in-home assessment vendors like
Signify Health and Matrix Medical bill $150 to $400 per completed visit and still cannot
get twenty touches a month; your assessor lives on the ninth floor). At 80 enrolled
members in one tower that is $1,440/month from a single plan against a captain costing
about $1,170/month. The property manager pays **zero, deliberately**, in access and
exclusivity, because what they get back is occupancy truth, which carries real dollars
for a project-based Section 8 property that must certify the assisted household is
actually in residence.

**Best child idea:** *sell the absence, drop the meal entirely.* No delivery, no totes,
no cart, no food safety liability. Bolt onto the Title III-C1 congregate sign-in that
already exists as a required unit record, and make the only work order the no-show list.
The pitch to the Service Coordinator is one sentence: **"you already generate this list
every day and you already throw it away."**

**Second child idea, and possibly the real business:** once every frame in the building
carries an authenticated tag, sell NFC-at-the-door attestation to every home health and
personal care agency serving that building. Florida Medicaid EVV under the 21st Century
Cures Act runs on Netsmart Mobile Caregiver+, whose GPS geofence check fails constantly
inside concrete high-rises, so those agencies are eating rejected claims and manual
overrides today. **Federally mandated demand, existing budget line, incumbent that is
measurably worse at the exact physical situation you already solved.**

### 6.2 Route Zero
*Be the screened subcontractor before you are the software vendor.*
`[inversion-7, N8 V7 F10]`

**How it works.** Stand up the compliance shell first, because it is cheap and it is the
only thing that lifts a solo builder out of the auto-exclude pile: a Florida LLC, **FDLE
VECHS Qualified Entity approval** (VECHS exists precisely to screen people providing care
to the elderly; ten business day review, $36 per submission), a Level 2 standard under
F.S. 435.04 run against that approval, $1M/$2M CGL with a hired-and-non-owned-auto
endorsement, ServSafe Food Handler, a signed BAA, a W-9, and a two-page Route Rider
Agreement.

Take that folder to Miami-Dade subrecipients already holding OAA Title III-C2
home-delivered-meal contracts under Alliance for Aging, the AAA for PSA 11. Ask for
exactly one thing: **one route, one zip code, one weekday, roughly 30 to 45 doors, free,
twelve consecutive weeks, driven personally using only this app.** The app ships as a
field instrument, not a platform. The only screen that matters is drop confirmation: it
replays the last-known door facts as tappable chips and forces a still-true /
no-longer-true / new-fact answer. The agency gets one page a week with four numbers and
nothing else. At week twelve the deliverable is not a demo, it is a corrected roster plus
roughly 480 signed arrival events. The commercial ask at week thirteen rides the unit the
agency already bills, **so it never becomes a procurement event.**

**Load-bearing risk.** That a provider will grant an outside screened individual a
written **data right**, not merely a volunteer badge. Everything else here is purchasable
in three weeks for under $2,600. The one thing money cannot buy is the sentence that lets
you capture and retain the door-access graph. If every provider says "onboard as our
volunteer, under our badge, and you may not run your own app or keep any client data,"
then twelve weeks of real driving produces a moving personal story and zero transferable
asset. **The labour is welcome everywhere. The data right is the whole business.**

**Kill test.** Build nothing. Within 30 days of VECHS approval, put the Route Rider
Agreement in front of five named providers and ask for a signature, not a meeting. The
clause under test is one sentence: *"Contractor may capture, retain, and use structured
operational data (door access facts, arrival and departure timestamps, attempt outcomes)
and de-identified aggregate metrics; all PHI is held under the attached BAA and never
leaves Contractor's encrypted device store."* **If zero of five sign that sentence intact
inside 30 days, the evidence-is-the-product thesis is dead** and you fall back to the dark
run, which needs a much weaker data right and no custody of the meal.

**First step.** Monday morning, file the Florida LLC and in the same sitting email the
FDLE VECHS Qualified Entity Application naming "the elderly" as the served population.
This is the unblocking move because **a solo operator cannot self-initiate a Level 2
Clearinghouse screening**: a qualified agency has to enter you. VECHS is the one path
that lets your own entity request national fingerprint-based checks on itself now and on
every driver you add later. **Do not open the React Native repo until a provider has
signed.**

**Who pays.** Nobody pays for the twelve weeks. You pay, roughly $2,600 all in, plus
twelve Saturdays. From week thirteen the payer is the Title III-C2 subrecipient agency
itself. The unit is the delivered meal, because that is the unit the agency already
budgets and gets monitored on, **which means the fee lands on an existing line instead of
creating a new budget category that would trigger procurement.** Price: $0.18 per
delivered meal, $500/month floor, $2,500/month cap per agency. Against a Florida blended
cost near $9 to $11 per home-delivered meal that is under two percent of the unit.
Unsentimental caveat carried from the analysis: **if the twelve weeks show baseline
first-attempt success above 98 percent, this price is indefensible on failed deliveries
alone and you reprice entirely against the documentation side.**

**Best child idea:** *sell the twelve weeks itself instead of the software.* Package the
shell plus the instrument as a fixed-fee route audit an agency buys ahead of its DOEA
monitoring visit, or that a funder buys on the agency's behalf. Roughly $18,000 for a
twelve-week single-route audit, software included free. **This produces revenue before
there is a software customer**, and converts the load-bearing risk from "will they sign a
data clause" into "will someone buy a diagnostic," which is a far more testable question.

### 6.3 Threshold ★
*A two-layer doorstep access graph, where the PHI-free door layer is the asset.*
`[inversion-2, N7 V8 F9]`

**How it works.** Threshold maintains **two strictly separated graphs.**

The **door layer** is keyed to a physical address and unit and holds only facts about the
built environment: gate code, which of three doors, callbox dial sequence, side ramp at
the west entrance, elevator B is freight only, the unit numbering skips 13, the mailbox
bank blocks the ramp on trash day. It contains **no PHI**, is pooled across every agency
and every courier, and is the actual asset.

The **person layer** is PHI: client is deaf so ring twice and wait 90 seconds, caregiver
present Monday and Wednesday, allow four minutes for the walker, refuses if the tote is
left on the ground. It lives under a BAA in a per-agency Postgres schema with row-level
security and is destroyed on contract exit.

Every fact carries a type-specific half-life (gate code 120 days, dog in yard 180,
caregiver schedule 60, three concrete steps and no ramp effectively never) plus
event-driven invalidation, **so the graph decays honestly instead of rotting silently the
way a one-time CSV import does.** At arrival the app wakes from a terminated state via a
40-metre region monitor or an NFC read, then asks at most three decayed facts as
full-width yes/no taps, median four seconds, with hands-full voice capture as fallback.

**The wedge that gets an agency to say yes in one meeting is not software. It is the
substitute-driver problem.** Every provider has a Maria who is the only person who can run
her route. Threshold offers to capture Maria's head into a structured file the agency
owns, for free, and prove it by putting a stranger on her route.

**Load-bearing risk.** That the veteran driver's speed is **transferable as enumerable
per-door facts**. If what makes Maria fast is tacit sequencing, two years of
relationships, and muscle memory rather than a finite set of typed facts, then the graph
is a laminated card with a database behind it and the metric never moves.

**Kill test.** The Substitution Test. Stage one, weeks 1 to 2, **zero code**: ride three
real routes as an unpaid volunteer and census the annotations. Photograph every manifest,
sticky note, laminated card, and driver WhatsApp thread. Measure what fraction of stops
carry any access annotation and what fraction of those collapse into fewer than 25 typed
fact types. **Gate: at least 35 percent of stops annotated and at least 70 percent
typeable. If the free text does not collapse into a schema, there is no graph and you stop
there.** Stage two, weeks 3 to 6: harvest one veteran's 30-stop route for three weeks with
a stopwatch baseline, then hand that route to a driver who has never run it with nothing
but the app, against a control of the same novice on a comparable ungraphed route. **Kill
condition: the graphed novice does not land within 15 percent of the veteran's route time
and within 5 points of their first-attempt success rate.**

**First step.** Monday, write no code. Submit the Level 2 livescan (it takes three to six
weeks and gates everything). Then call the volunteer coordinators at three named
Miami-Dade providers and ask to be scheduled as an unpaid driver, **explicitly not as a
vendor, with no product mentioned.** By Friday be on one real route with one job:
photograph every annotation the regular driver relies on and transcribe each into a tally
of candidate fact types. That tally is the entire schema design input and it is also
stage one of the kill test.

**Who pays.** Three payers, one asset. The agency pays **$0 cash** and pays instead in
exclusive territorial rights to the door layer plus route access; this is the entry, not
the business. The health-plan side pays for the verified door event at **$12 per active
door per month or $0.65 per verified door event.** That price defends itself on
**recovered capacity, not failure avoidance**: cutting median door dwell from 6.5 to 5.0
minutes across 30 stops returns 45 minutes of paid driver time per route per day and
frees room for about four more stops at a roughly $10.50 reimbursed Title III-C2 unit, so
roughly $60 to $80 of daily recovered value against $19.50 of daily cost. **The margin
line is the door layer resold** at $6 per active door per month to each non-meal courier
touching the same building: paratransit, pharmacy couriers, home health aide agencies,
grocery-benefit delivery. A 300-unit senior tower with five licensees is $9,000 per month
on doors whose data-collection cost was already paid by the meal route.

**Best child idea, and the one that names the actual business:** *sell the same door
layer five times.* Because the door layer is PHI-free and keyed to the property rather
than the person, one saturated building licenses simultaneously to every courier walking
the same halls. **The meal route is the cheapest possible sensor network for building a
courier-grade access map. Meals are the acquisition channel, not the product.**

**Second child idea:** ship the *"your file is wrong"* stream as a separate product.
Every access fact contradicting the agency's system of record (unit number wrong, phone
disconnected, client moved, client is in a nursing home, client is deceased) becomes a
reconciliation queue written back by SFTP or API. Agencies are paid per unit of service
and monitored on client-record accuracy, so record corrections are directly monetisable
and arrive **free, as exhaust.** It also creates the switching cost: leave Threshold and
the client file starts drifting again immediately.

---

## 7. Provocation

The pool contains one idea nobody scored because the critic dropped its entire frame, and
it may be the sharpest thing here:

> **The meal box is the ant, not the driver.** Put the tag on the box at the dock, not
> the person. Give the box a claim that evaporates. An unclaimed box widens its own
> broadcast radius every 30 minutes until someone scans it.

Every other idea in this document assumes coordination flows from an institution to a
person. This one gives agency to the physical object and lets coverage emerge. It also
happens to solve four separate problems at once: it replaces the fake QR-scanner PNG with
the one feature that genuinely requires native NFC and offline camera; it produces a real
scan-to-scan chain of custody; it makes the unit of account the physical box food banks
already count in pounds and cases; and it is the literal implementation of the surge
mechanism written in `FoodDonationIdea.docx` three years ago and never built.

**The question worth pushing into:** if the box carries its own claim and its own decay,
does the app still need a route at all, or does it just need to tell one person, right
now, about the one box nearest them that has been waiting longest?
