# GatheringMIA Revival Documents

Produced August 22 to 23, 2026. Read in order.

| # | Document | What it answers |
|---|---|---|
| **00** | [Revival Audit](00-REVIVAL-AUDIT.md) | What is actually in this repository, what still runs (nothing), what is salvageable, and every defect worth knowing about |
| **01** | [Divergence](01-DIVERGENCE.md) | What should this product become? 42 ideas from 6 isolated cognitive frames, scored, clustered, with 25 traps named and the top 3 deepened |
| **02** | [Market Research](02-MARKET-RESEARCH.md) | Who buys, who competes, what it costs, what the law requires, and what the research failed to establish |
| **03** | [PRD](03-PRD.md) | What we are building, for whom, in what order, and what would prove us wrong |
| **04** | [React Native Architecture](04-RN-ARCHITECTURE.md) | How to build it on the 2026 platform, and the specific 2022 defects the design prevents structurally |

---

## What has been built since

The planning above produced a Wayfinder map, and that map is now **complete: 13 of 13
tickets closed**.

**[Map: Real Route Demo](https://github.com/cdukedev/gatheringmia/issues/22)** (issue #22),
with all thirteen tickets as native GitHub sub-issues and native issue dependencies, so the
blocking graph renders in GitHub's own UI. Each closed ticket carries its full resolution as
a comment.

| Path | What it is |
|---|---|
| `app/` | Running Expo SDK 57 app (RN 0.86.2, React 19.2.3, New Architecture). `npm run verify` = typecheck + PII guard + 12 tests, exit 0 |
| `services/seed/` | 24 synthetic recipients at 24 **real** Little Havana addresses, plus the door-fact taxonomy v0 |
| `services/routing/` | CVRP solver against real OSRM drive-time matrices, plus the field kit |
| `.scratch/real-route-demo/` | Pointer to the map. Not a tracker. |

**Two findings from that work changed this documentation set**, and both corrections are
marked in place rather than quietly edited:

- `04-RN-ARCHITECTURE.md` §3.1 guessed that `react-native-maps` could not cache tiles offline. **It can**, and that removes a Mapbox dependency.
- `04-RN-ARCHITECTURE.md` §3.3 listed the Mapbox React Native navigation bridges as viable pending verification. **All of them are dead**, none having published since RN 0.82 made the New Architecture mandatory.

And one finding is worse than the audit recorded: **the 2022 route optimiser never reordered
a single stop.** Its tie-break fires 0 times in 222 comparisons. See
`00-REVIVAL-AUDIT.md` §3.3 and [#31](https://github.com/cdukedev/gatheringmia/issues/31).

---

## The short version

**The project is dark.** All four deployed surfaces NXDOMAIN: both AWS API Gateway routes,
the Amplify app, and `gathering-mia.live`. No users, no data, no migration debt. This is a
greenfield rebuild that inherits a completed design and a validated problem.

**The code is a design artifact, not a foundation.** The distance math is wrong by roughly
100x, the route optimiser is greedy nearest-neighbour on straight-line distance, the final
destination is a point in open water 100 miles south of Miami, the QR scanner is a static
PNG, and recipient PII flows through URL path parameters. Do not port it.

**The buyer was misidentified.** This is not a food rescue app. It is a **home-delivered
meals driver app** for Older Americans Act providers, competing with ServTracker (3.17 stars
on iOS). Conveniently, Feeding South Florida is simultaneously a Feeding America food bank
**and** a contracted OAA Title III-C2 provider, so both framings point at the same customer.

**The product already exists, twice, at $250/month.** Food Rescue Hero and Careit both sell
it. Feature parity is not a strategy. The differentiator is the **doorstep access graph**:
per-address built-environment facts with confidence decay, which makes a substitute driver
as fast as the veteran whose route they inherited. Two isolated research frames reached this
independently, which is the strongest convergence signal available.

**The binding constraint is not technical.** It is who lets you near the door, and that is
granted by one named person at one agency. **The first three phases ship no consumer-facing
app at all.**

---

## The five calls to make before writing any code

Each is free, takes under an hour, and closes a question the research could not:

1. **Martha Hidalgo, Feeding South Florida** (mhidalgo@feedingsouthflorida.org, 954-518-1818 x1906). What does your eCIRTS entry workflow look like today, and does the O3C2 route run on paper?
2. **Alliance for Aging contracts staff** (305-670-6500). Current procurement calendar, and do subrecipient agreements prohibit a subcontracted driver from retaining de-identified operational data?
3. **Florida DOEA or AHCA, in writing.** Does giving a volunteer a client's name, address, and phone constitute "access to personal identification information" under Fla. Stat. 430.0402?
4. **Mapbox sales.** Will you sign a HIPAA BAA covering the Navigation SDK and Optimization API?
5. **Careit.** Sign up for the free nonprofit account and use Food Delivery Pro for a week. It is the closest thing to this product that exists and nobody has looked at it.

---

## Method note

The market research ran 9 parallel dimensions across roughly 645 web searches and fetches,
then an adversarial completeness critic audited the corpus for gaps, unverified claims, and
contradictions between dimensions. **§10 of `02-MARKET-RESEARCH.md` reproduces that
critique in full**, including where the research contradicts itself and where the numbers
are known to be wrong. Read it before quoting any figure, particularly the TAM.

The divergence used six isolated cognitive frames with evaluation forbidden during
generation, then scored and clustered under a separate critic pass. One frame was
accidentally dropped before scoring and was recovered from the run journal; those ideas are
marked in `01-DIVERGENCE.md`.
