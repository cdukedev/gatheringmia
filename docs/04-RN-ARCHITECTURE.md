# GatheringMIA React Native Architecture

**Date:** August 23, 2026
**Companion to:** `03-PRD.md`
**Verification date for all versions and prices below:** August 22 to 23, 2026

---

## 1. The decision, stated first

**Rebuild on Expo SDK 57. Do not port the 2022 codebase.**

The 2022 build is create-react-app on React 18.2 with `react-router-dom` 6.10, Sass, and
`@react-google-maps/api`. React Native 0.82 (October 2025) was the first release running
entirely on the New Architecture, RN 0.84 removed legacy architecture components outright,
and Expo SDK 55+ dropped legacy support. **The old codebase shares literally zero runtime
with the target platform.** There is no port to perform.

What carries across is not code:

| Asset | How it transfers |
|---|---|
| 18 hand-made SVG icons | Directly, via `react-native-svg` |
| Figma splash, gallery, logo | Directly |
| Screen flow and information architecture | Directly, as design input |
| `communityGardens.json` (13 real Miami gardens) | Directly, as seed data |
| The haversine function in `DirectionsMap.js` lines 118 to 148 | Extract, then delete the two wrong distance implementations |
| The copy voice | Directly |

Everything else is deleted: five context providers, five prop-drilling wrappers, three
distance functions, the greedy router, the fake QR screen, the duplicated `LoadScript`, the
`window.innerWidth` layout branch, all Sass (React Native has no CSS), the Enzyme and
Cypress suites, and the 953-line committed `prepared-for-mysql.js` data dump.

---

## 2. Platform baseline (verified August 2026)

| Component | Version | Notes |
|---|---|---|
| React Native | **0.87.0** (2026-08-11) | Expo SDK 57 bundles 0.86 |
| **Expo SDK** | **57** (`expo@57.0.15`, 2026-08-20) | React 19.2 |
| Architecture | **New Architecture, mandatory** | Fabric, TurboModules, Bridgeless. Not optional as of RN 0.82+ |
| JS engine | **Hermes V1**, default since RN 0.84 | |
| Router | **Expo Router v7** | Maps almost 1:1 onto the existing `pages/` structure |
| Node | 22+ (RN 0.87 minimum) | |
| Android | AGP 9, Kotlin 2.0+, minSdk 24+ | |
| iOS | 16.0+ | |

**Screening test for every dependency:** if it has not shipped Fabric and TurboModule
support by now, it is unusable. Apply this ruthlessly. Every "should we enable the New
Architecture?" article from 2023 and 2024 is dead information.

> **NFR-6.1 restated because it is the requirement this project has already failed once:**
> the Expo SDK support window is approximately one year. Budget one meaningful upgrade
> annually plus cheap `npx expo install expo@latest --fix` bumps between. A solo maintainer
> who lets this sit for two years is back in exactly the dormant, unbuildable state the 2022
> build is in today.

---

## 3. Library selections, with the reasoning

### 3.1 Maps: `react-native-maps`

| Library | Version | Weekly downloads | Verdict |
|---|---|---|---|
| **react-native-maps** | 1.29.0 | **1,153,353** | **Selected** |
| @rnmapbox/maps | 10.3.5 | 212,830 | Fallback if offline vector tiles become hard |
| @maplibre/maplibre-react-native | 11.3.7 | 121,816 | Zero vendor cost, bring your own tiles |
| expo-maps | 57.0.2 (**alpha**) | 117,679 | **Rejected** |

`expo-maps` is officially "in alpha," documents that it "will frequently experience breaking
changes," gives Apple Maps on iOS and Google Maps on Android with **no cross-platform
provider choice**, and has no clustering and no documented offline maps. The core screen of
this app is a map with an ordered multi-stop route, custom markers, and a polyline. It
cannot be built on a library that will not promise API stability, and shipping two different
rendering behaviours by platform doubles the support surface.

**RESOLVED, and this document was wrong.** ([#25](https://github.com/cdukedev/gatheringmia/issues/25))

The guess above, that `react-native-maps` cannot cache tiles because Google Maps and Apple
Maps control their own caching, is right about the *basemap* and wrong about the *tile
overlay*. `<UrlTile>` ships a complete offline story, verified in
`dist/src/MapUrlTile.d.ts` on the installed **1.27.2** rather than taken from the docs:

| Prop | Behaviour |
|---|---|
| `tileCachePath` | Enables disk caching at `/{z}/{x}/{y}` |
| `offlineMode` | Never fetches; reads cache only, and downscales up to 4 zoom levels to fill gaps |
| `tileCacheMaxAge` | Serve-stale-while-refresh |
| `maximumNativeZ` / `maximumZ` | Caps what is fetched, synthesising higher zooms. The cache-size lever. |
| `shouldReplaceMapContent` | (iOS) hides the native basemap underneath |

Two real constraints. It needs **our own raster tile source**, which is convenient because we
already self-host the Florida OSM extract for OSRM, so it is a container rather than a
vendor. And there is **no cache eviction**, so we own that. A Little Havana route bbox at
z10 to z17 is roughly 350 tiles, about **5 MB**.

Fabric codegen specs are present (`codegenConfig.RNMapsSpecs`, including
`NativeComponentUrlTile.ts`), so New Architecture support is real. **Staying on
`react-native-maps`; @rnmapbox/maps and MapLibre remain sound fallbacks if raster proves
inadequate, and neither is needed.**

### 3.2 Routing and optimisation: self-hosted OSRM + VROOM

**This is a compliance decision before it is a cost decision.** See §5.

| Approach | Cost at 7,800 stops/month | Verdict |
|---|---|---|
| **Self-hosted OSRM + VROOM** | ~$64 to $100/mo for one r7i.large; realistically **$200 to $350/mo** with HA, monitoring, storage | **Selected** |
| Mapbox Optimization API | ~$0 (100,000 free requests/month) | Cheapest, but BAA status unverified |
| Google Route Optimization (Single Vehicle) | $28/mo | ToS forbids HIPAA data |
| Google, hand-rolled matrix | **~$790/mo** | **The trap. Never do this.** |
| HERE Tour Planning | ~EUR 204/mo | Bills per location processed |
| OptimoRoute at 60 drivers | ~$2,646/mo | Per-driver pricing is hostile to volunteers |

**Why self-hosting is genuinely viable here:** the Florida OSM extract is **624 MB**
(Geofabrik, 2026-08-22). OSRM needs roughly 5x the PBF size in RAM, so **~3 GB for Florida**
versus ~50 GB for the full USA. A nightly rebuild on one small instance is trivial, which
removes the usual operational objection.

**Why it is the right call beyond cost:** Google's terms permit caching Route Optimization
coordinates for only **30 consecutive days**, and this product stores coordinates for
homebound seniors permanently. Self-hosted OSM-based geocoding and routing removes that
restriction entirely, and it removes the BAA question entirely.

**The solver is not the hard part.** VROOM v1.12.0 on the Solomon VRPTW 100-customer
benchmark: **average 359ms, median 382ms, longest 716ms**, at a **median gap of +1.12%** to
best known. OR-Tools 9.14 hits 1.5% at 100 customers and 4.4% at 200 within one minute.
Greedy nearest-neighbour, which is what the 2022 build uses, typically lands **15% to 25%
worse than optimal.**

**The hard part is the travel-time matrix**, which is exactly what OSRM provides and what
the 2022 build replaced with Euclidean degrees.

All relevant projects are actively maintained: osrm-backend and valhalla both pushed
2026-08-22, or-tools 2026-08-20, graphhopper 2026-08-21, VROOM 2026-05-11.

### 3.3 Turn-by-turn navigation: resolved. No in-app navigation.

| Option | Cost per stop | Status |
|---|---|---|
| `@googlemaps/react-native-navigation-sdk` | **$0.025** | **Official Google, Beta (pre-1.0).** Requires RN 0.79+ New Architecture. **Incompatible with projects pulling other Google Maps SDK dependencies.** Not covered by GMP SLAs |
| Mapbox community bridges (`@pawan-pk`, `@homee`, `@routebuddies`) | ~$0.0026 | **ALL DEAD. Measured, see below.** |
| Deep link out to Google/Apple Maps | $0 | Free forever, but loses arrival detection, ETA telemetry, proof-of-delivery continuity, and live re-sequencing |

**RESOLVED.** ([#24](https://github.com/cdukedev/gatheringmia/issues/24)) Measured against
the npm registry and the GitHub API on 2026-08-23:

| Package | Latest | npm published | Repo pushed | Weekly dl | Open issues |
|---|---|---|---|---|---|
| `@pawan-pk/...` | 0.5.2 | **2024-10-08** | 2025-07-27 | **314** | 15 |
| `@homee/...` | 1.1.0 | **2021-07-21** | 2024-08-13 | **11** | **69** |
| `@routebuddies/...` | 2.0.1 | **2023-05-23** | 2023-02-17 | **3** | 0 |
| `@googlemaps/react-native-navigation-sdk` | 0.16.3 | **2026-06-12** | **2026-08-19** | **7,258** | 66 |

**React Native 0.82 (October 2025) made the New Architecture mandatory, and not one Mapbox
bridge has published since.** The most recent predates that by a full year. `@homee` still
declares a peer range of `>=0.60.0-rc.0 <1.0.x` and carries 69 open issues against 11 weekly
downloads. Three of four are abandoned; the fourth is one maintainer with 314 downloads.

**Decision: the demo ships no in-app turn-by-turn.** Deep-link out with clean handoff. It is
free, correct, and not the claim the demo makes. If in-app navigation is ever needed, use
Google's official Beta wrapper at $0.025 per destination and accept the cost, because a
first-party Beta is a better maintenance bet for a solo maintainer than an unmaintained
third-party native module.

**Do not read this as "avoid Mapbox."** `@rnmapbox/maps` (rendering) is healthy: 10.3.5,
pushed 2026-07-22, peer `react-native >=0.79`, 212,172 weekly downloads. It is specifically
the *navigation* binding that does not exist in maintained form.

**Interim v1 position:** implement FR-5.2 (deep-link-out with explicit handoff and clean
return) first, because it is free and correct, and add in-app turn-by-turn once the bridge
question is settled. **What must not ship is the 2022 behaviour**, where the app deep-links
out *and* navigates internally simultaneously, leaving `DirectionsMap` rendering behind a
departed session.

### 3.4 Local data: `expo-sqlite`

| Library | Status | Verdict |
|---|---|---|
| **expo-sqlite** | v57.0.1, **994,957** weekly downloads | **Selected** |
| op-sqlite | v18.1.4 (2026-08-21), 140,364 | Alternative if raw throughput matters |
| WatermelonDB | **0.28.0, last published 2025-04-07 (16 months)** | **Rejected** |
| Realm | 20.2.0; **Atlas Device Sync EOL 2025-09-30**, cloud sync removed | **Rejected** |
| Legend-State | stable stuck at 2.1.15 (2024-08-30), v3 still beta | Rejected as canonical store |

**WatermelonDB is still widely recommended in 2026 blog posts**, but it has not shipped a
stable release in sixteen months and GitHub issue #1969 (opened 2026-06-05) asking directly
about New Architecture, Bridgeless, and Expo SDK 54+ support **has no maintainer answer.**
For a project whose entire premise is never going dark again, adopting a library that has
gone quiet is the wrong risk.

**Realm is dead for sync.** Any architecture document from 2023 recommending it describes a
product that no longer exists.

`expo-sqlite` gained a **SQLite Inspector DevTools plugin** and a **tagged-template-literal
query API with automatic parameter binding** in SDK 55. That second feature directly
addresses the PII-handling sloppiness in the 2022 build by making parameterised queries the
path of least resistance.

### 3.5 Sync: hand-rolled against Postgres, PowerSync evaluated

Write the sync layer directly against a REST or Postgres backend. The requirement (NFR-1) is
an **append-only local log with opportunistic flush**, which is simple enough to own and too
important to delegate.

**PowerSync** is the credible managed alternative: `@powersync/react-native` v2.1.0, free
tier covers 2 GB synced/month, 500 MB hosted, and 50 peak concurrent connections, which is
an entire pilot at $0; Pro from $49/month; **self-hostable Open Edition** as the lock-in
escape hatch.

> **Gotcha worth naming:** PowerSync Cloud projects **deactivate after one week of
> inactivity.** For a seasonal volunteer app where a provider pauses deliveries over the
> holidays, that is a genuine operational hazard. The Open Edition self-host path is the
> answer if that is unacceptable.

### 3.6 Location: `expo-location`, foreground-first, deliberately

| Option | Cost | Capability |
|---|---|---|
| **expo-location** | Free, in-SDK, **2,250,161** weekly downloads | Foreground plus geofencing. **Stops on app termination.** Android will not restart on a location event; **iOS will restart a terminated app on a geofence event.** Caps: Android 100 geofences, iOS 20 |
| react-native-background-geolocation (Transistor) | **$399 to $999** one-time, 44,734 weekly downloads | Motion state machine, Android headless tasks surviving full termination, durable HTTP + SQLite queue, `stopOnTerminate: false` |

**Selected: `expo-location`, with a foreground service during active routes.**

The reasoning is regulatory, not technical. Google Play evaluates background location
against four criteria, and the fourth is *"Could the app deliver the same experience without
accessing the location in the background?"* A driver on an active delivery run has the app
in an active session, so the honest answer is yes. **Choosing foreground-only removes an
entire review gate, a 30-second demo video submission, a single-feature declaration, and a
recurring re-justification burden.**

Google also states plainly that foreground access "is our preferred approach," and
explicitly rejects background location used **"solely for employee tracking"**, which is
exactly how a reviewer could read volunteer breadcrumb tracking if the framing is wrong.

And **iOS geofencing already restarts a terminated app on a region event**, which covers the
arrival-detection case on the platform where volunteer drivers skew.

**Reconsider the $399 Transistor licence only if** breadcrumb trails surviving a force-quit
become a proven requirement from Phase 2 data. **Licence scope is not published** (one app
ID or many, perpetual or annual, updates included), so contact sales before budgeting.

### 3.7 The rest

| Need | Selection | Notes |
|---|---|---|
| **Camera / barcode** | `expo-camera` (1,974,545 weekly) or `react-native-vision-camera` 5.2.3 (584,426) + MLKit scanner | Replaces the static-PNG QR screen. SDK 55 lets you opt out of barcode APIs to shrink app size |
| **Push** | `expo-notifications` (**4,254,057** weekly, highest of any package surveyed) | 600/sec per project, orders of magnitude above what surge dispatch needs |
| **Crash / perf** | **Sentry** `@sentry/react-native` 8.23.0 (2,789,187 weekly) | Free Developer tier: 5,000 errors/month, sufficient for a solo pilot |
| Observability alternative | EAS Observe, **GA 2026-08-20** | Bundled with EAS. **Two days old at GA**, so complementary to Sentry, not a replacement at launch |
| **E2E** | **Maestro** | First-party in EAS Workflows, YAML flows, insights dashboard shipped 2026-06-24. Far lower overhead than Detox for a solo maintainer |
| **OTA** | **EAS Update** | CodePush retired 2025-03-31 with no migration path. SDK 55 added bytecode diffing (~75% smaller updates) |
| **SVG** | `react-native-svg` | Carries the inherited icon set across |
| **i18n** | Any standard solution | Spanish at launch (NFR-4.4), Haitian Creole next |

**Critical EAS Update limitation to design around:** it ships JS, styling, and images. It
**cannot** update native code, native dependencies, **app permissions (camera, location)**,
or the Expo SDK version. **Plan the permission model up front, because permission changes
are the expensive kind: they are full store submissions with full review.**

**Operational note:** SDK 55 turned the Expo Go Android push warning into a **hard error**,
and Expo Go for SDK 55, 56, and 57 have all been stuck in Apple review for months.
**Use `expo-dev-client` builds from the first sprint.** Expo Go is not a viable dev
environment for this app.

---

## 4. Application structure

```
app/                                    # Expo Router v7, file-based
  (auth)/
    sign-in.tsx
  (driver)/
    index.tsx                           # today's route, the default screen
    route/[routeId]/
      index.tsx                         # ordered stop list
      stop/[stopId].tsx                 # THE screen that matters (§6)
      navigate/[stopId].tsx
    history.tsx
  (coordinator)/
    routes/
    roster/
    reports/
  _layout.tsx

src/
  db/                                   # expo-sqlite, migrations, append-only event log
    schema.ts
    migrations/
    eventLog.ts                         # write-first, sync-later
  sync/
    queue.ts                            # durable outbound queue
    flush.ts                            # opportunistic, background-task driven
    conflict.ts                         # last-write-wins on device timestamp
  domain/
    routing/                            # NO distance math on device. Server owns the solver.
    doorGraph/                          # confidence decay, half-lives, invalidation
    eligibility/                        # FR-1.3 hours meter, FR-1.5 screening state
    outcomes/                           # the nine outcome codes
  api/
    client.ts                           # opaque IDs only, never PII in a URL
  i18n/
    en.json  es.json  ht.json
  ui/
    tokens.ts                           # from the Figma design system
    components/                         # 44x44pt minimum targets, WCAG AA contrast
```

**Structural rules:**

1. **No distance or routing math on device.** The server owns the solver and ships a
   sequenced, immutable route. The device caches the drive-time matrix for offline
   re-sequencing only. This is the direct architectural answer to the 2022 build's three
   competing distance functions.
2. **State: React Query for server state, Zustand for the small amount of genuine UI
   state.** Not five nested context providers with five prop-drilling wrapper components,
   which was the 2022 pattern and caused a full-tree re-render on any state change.
3. **The event log is append-only and is the source of truth on device.** UI reads
   projections of it.

---

## 5. The mapping vendor is a compliance fork, not a pricing choice

**Google Maps Platform Terms of Service, General Restrictions:** customer will not use the
Services *"to transmit, store, or process health information subject to United States HIPAA
regulations."* Google's BAA covers Google Cloud and Workspace. **Consumer products including
Maps are never covered.**

By contrast, **Amazon Location Service is on the AWS HIPAA Eligible Services list**, along
with Amplify, Cognito, SNS, AppSync, API Gateway, Lambda, RDS, and DynamoDB, all under a
self-service BAA in AWS Artifact.

**The 2022 build runs on `@react-google-maps/api` plus Google Maps deep links.** The moment
a payer or provider referral path exists, that layer is contractually unusable.

### The three-tier design

| Tier | What it touches | Vendor |
|---|---|---|
| **Rendering** | Anonymous coordinates and tiles only | `react-native-maps` (Google/Apple tiles). Never receives an identifier |
| **Geocoding** | Recipient addresses | **Server-side, self-hosted** (Nominatim or Pelias). Never leaves our infrastructure |
| **Optimisation** | The full stop set with time windows | **Self-hosted OSRM + VROOM.** Never leaves our infrastructure |

Under this split the map SDK receives only anonymous lat/lng pairs with no identifier and no
recipient-specific address string, which satisfies NFR-3.3 architecturally rather than by
convention.

> **Open item flagged in the research and unresolved:** whether Mapbox, HERE, or TomTom will
> sign a HIPAA BAA for their navigation SDKs. No public compliance documentation exists.
> **The market research contradicts itself here:** the routing and React Native dimensions
> both recommend Mapbox on pure cost grounds without mentioning HIPAA once, while the
> compliance dimension calls the Google Maps prohibition its highest-impact constraint.
> **Resolve in Phase 0 before committing to a navigation SDK.**

---

## 6. The stop screen

One screen carries the product. Its requirements are drawn directly from documented
incumbent failures, so each one is a competitive feature rather than polish.

**Layout, top to bottom:**

1. Recipient display name and unit, large.
2. **Up to three decayed door facts as full-width yes/no taps.** Target: under 5 seconds
   median to clear (FR-3.4).
3. A large primary **Delivered** button.
4. A secondary outcome selector for the other eight codes.
5. A tertiary, always-present **wellness concern** entry point (FR-4.6).

**Behavioural requirements:**

| Requirement | Why |
|---|---|
| **Confirmation completes in under 1 second with zero connectivity** | Incumbent review: *"marking a meal as delivered often seems to take quite a long time"* |
| **Never requires GPS to be enabled** | Incumbent review: *"it would be nice to not have to have GPS on just to mark a meal as delivered"* |
| **Confirmation state survives app kill, backgrounding, and stairwells** | Incumbent review: *"the checks don't work all the time and it is frustrating when running up and down a building and trying to remember who you already delivered to"* |
| One-handed operation, 44x44pt minimum targets | NFR-4.2, plus a driver with full hands |
| Readable in direct Miami sunlight | 4.5:1 minimum contrast |
| Spanish at launch | 227,975 Miami-Dade elders have limited English |
| Voice capture fallback for hands-full input, **on-device only** | FR-3.7, NFR-2.4 |

**The write path, precisely:**

```
tap → write to local append-only SQLite log  → UI updates immediately
                    ↓
              enqueue for sync
                    ↓
        opportunistic background flush
                    ↓
        server ack → mark event synced
```

**The UI never waits on the network.** Queue depth is visible so the driver can see the
system is holding their work and trust it.

---

## 7. Backend

| Layer | Choice | Rationale |
|---|---|---|
| API | Node or Python REST behind API Gateway | Matches the existing AWS footprint from the dead backend |
| Database | **Postgres** with **row-level security** | RLS enforces the per-agency PHI tenancy at the database, not in application code |
| Schema separation | **Separate schemas** for door layer (pooled, no PHI) and person layer (per-agency, PHI) | NFR-2.1. They must never share a table |
| Routing service | **OSRM + VROOM** on EC2, nightly Geofabrik Florida rebuild | §3.2 |
| Geocoding | Self-hosted Nominatim or Pelias | Never send recipient addresses to a third party |
| Auth | Cognito (HIPAA-eligible) with MFA on staff accounts | NFR-2.3 |
| Secrets | Never in the bundle. The 2022 build inlined `REACT_APP_GOOGLE_API_KEY` into the production bundle at build time, where it was public by construction | |

**Network segmentation isolating the PHI tenancy is a build-now item**, not a
retrofit. The proposed HIPAA Security Rule (final rule delayed to July 2027) makes
segmentation explicit, and every proposed control is already standard practice and cheap in
a greenfield build. Retrofitting is pure waste.

---

## 8. Launch path and its gates

| Gate | Detail | Mitigation |
|---|---|---|
| **D-U-N-S number** | Free but **up to 30 business days**. Required for an organisation developer account | **Start day one of Phase 0.** An organisation account sidesteps Google Play's 12-tester / 14-day closed-testing gate entirely |
| **Apple review** | Apple claims ~90% in 24 hours; real-world new apps run **2 to 5 days**, spikes past 7. Q1 2026 releases up 60% YoY | **Never put a submission on a partner's launch date.** Budget 3 to 6 weeks if a location question lands |
| **Google Play background location** | Formal review: single-feature declaration, **30-second demo video**, prominent in-app disclosure, active privacy policy URL. **No published turnaround time** | **Avoid entirely by shipping foreground-only** (§3.6) |
| **Apple nonprofit fee waiver** | Waives $99/year but **requires a legal entity (not a sole proprietor)** and **forbids IAP and selling digital goods** | **Decide entity structure before enrolling the developer account.** Take SaaS revenue via web billing or off-store contract |
| Apple 5.1.1 consent withdrawal | An in-app consent withdrawal control is mandatory and is a common rejection cause | Build it in v1 |
| Apple 5.1.3 | Bans storing personal health information in iCloud | If dietary or condition fields are ever added, do not sync to CloudKit and do not let analytics see them |

**Purpose strings must be specific**, not generic. For example: *"Used to order your
delivery stops and confirm arrival at each recipient's home during an active route."*

---

## 9. Testing

| Layer | Tool | Focus |
|---|---|---|
| Unit | Jest (current, not the pinned v27) | Door-graph confidence decay, eligibility state machine, outcome code transitions |
| **Integration** | | **The offline queue.** Write, kill the app, relaunch, flush, verify zero loss. This is the test that matters most |
| E2E | **Maestro** on EAS Workflows | Confirm-a-delivery and reassign-a-route flows |
| Accessibility | Automated contrast and target-size checks in CI, plus manual VoiceOver and TalkBack passes | NFR-4 |
| **PII leak** | **A CI check that fails the build on any recipient identifier in a log line, URL, or crash payload** | NFR-5.1. This is the automated guard against repeating the 2022 build's worst defect |

**Delete the inherited Cypress suite** rather than migrating it. It visits
`http://localhost:3000/gathering`, a route that does not exist in `App.js`. It has never
tested anything.

---

## 10. Cost model at pilot scale

60 drivers, 15 stops each, twice weekly, so ~7,800 stops per month.

| Line | Monthly |
|---|---|
| OSRM + VROOM (r7i.large reserved, plus storage) | $64 to $100 |
| Realistic with HA, monitoring, second AZ | **$200 to $350** |
| Postgres (RDS small) | ~$50 |
| EAS Starter | $19 |
| Sentry Developer | $0 |
| Map tiles (`react-native-maps`, Google) | Free tier at this volume |
| PowerSync, if adopted | $0 at pilot, $49 at scale |
| **Total** | **~$300 to $450** |

For contrast, the same workload on commercial last-mile SaaS: OptimoRoute ~$2,646/month,
Track-POD ~$2,940/month, Onfleet Scale $1,349/month. **Buying is 10x to 20x the cost of
building here, which inverts the usual make-versus-buy answer.**

**If the entity is a 501(c)(3)**, Google Maps Platform nonprofit credits start at **$250 per
month** and AWS grants up to $5,000, which covers most of the above.

---

## 11. The specific bugs this architecture is designed not to repeat

| 2022 defect | Structural prevention |
|---|---|
| Three distance functions, two wrong by ~100x | **No distance math on device at all.** The server owns the solver |
| Greedy nearest-neighbour called "optimal" | Real CVRPTW solver against a road-network matrix |
| `finalDestination` in open water, `zone = 2`, `capacity = 5` hard-coded | Route parameters are data, owned by the coordinator, validated server-side |
| Recipient PII in URL path params | **Opaque server-issued IDs only, enforced by a CI check that fails the build** |
| Props mutated during render, context array sorted in place | Immutable data flow; server ships an ordered route |
| QR scanner is a static PNG | Real camera and MLKit scanning |
| Deep-link out **and** navigate internally simultaneously | Exactly one navigation path active at a time |
| Voice announces only the first instruction (stale closure over `directions` and `currentStepIndex`) | Refs or functional state updaters, plus an explicit test |
| `LoadScript` mounted twice | Single map provider initialisation |
| `window.innerWidth` read once at render | Responsive hooks that re-evaluate |
| API key inlined into the production bundle | Secrets never reach the client |
| `console.log` printing recipient PII on every render | CI PII-leak check |
| No error boundary anywhere | Error boundaries per route segment |
| Tests are one snapshot and a Cypress spec for a nonexistent route | Offline-queue integration tests as the priority |
| `"fs": "^0.0.1-security"` (a squatter placeholder) in dependencies | Dependency review at setup |
| Three styling systems (Bootstrap, Emotion, Sass) | One token-based system from the Figma design |
| Two competing Google Maps React bindings installed | One map library |

---

## 12. Open technical questions

**Four of the original six are now closed.** Resolutions live on the map at
[#22](https://github.com/cdukedev/gatheringmia/issues/22).

### Closed

| Question | Answer |
|---|---|
| Do the Mapbox RN navigation bridges support the New Architecture? | **No. All dead.** None has published since RN 0.82 made it mandatory. No in-app navigation in the demo. ([#24](https://github.com/cdukedev/gatheringmia/issues/24)) |
| Does `react-native-maps` support offline tile caching? | **Yes**, via `<UrlTile>` + `tileCachePath` + `offlineMode`, verified on the installed 1.27.2. Needs our own raster tiles, which we already host. ([#25](https://github.com/cdukedev/gatheringmia/issues/25)) |
| Is Google Route Optimization billed once or twice per shipment? | **Moot.** We self-host OSRM plus our own solver, so there is no per-shipment meter. ([#27](https://github.com/cdukedev/gatheringmia/issues/27)) |
| What is the Transistor background-geolocation licence scope? | **Moot for now.** Foreground-only was chosen and `ACCESS_BACKGROUND_LOCATION` is explicitly blocked in `app.json`, which removes the whole Play review gate. Reopen only if field data proves breadcrumbs are required. ([#30](https://github.com/cdukedev/gatheringmia/issues/30)) |

### Still open, both needing a phone call rather than a commit

1. **Will Mapbox sign a HIPAA BAA?** Only binds once a payer or provider referral path
   exists. Self-hosting OSRM plus our own tiles sidesteps it entirely for now, so this is no
   longer on the critical path. It becomes urgent the moment a real provider supplies a
   client roster.
2. **Does eCIRTS expose an API or import format?** Determines whether PRD FR-6.4 is an
   integration or a CSV that staff retype. Unchanged in importance: this is still the single
   most load-bearing unanswered question in the whole project, and it is one call to a named
   contact away.

### New, surfaced by the build

3. **Route-to-stop assignment is not fact-aware.** The CVRP assigns stops to routes by
   geography and knows nothing about where door facts live, which produced a Route A with
   **zero** facts to verify. The field kit works around it by selecting the richer route.
   The real fix is an objective term in the solver, and it is not sharp enough to ticket yet.
