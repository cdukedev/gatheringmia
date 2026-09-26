# GatheringMIA Revival Audit

**Date:** August 22, 2026
**Auditor:** Engineering review ahead of the React Native rebuild
**Repo:** `github.com/cdukedev/gatheringmia` @ `main` (`6285b63`)
**Verdict up front:** the code is a **design artifact, not a foundation**. Salvage the
product thinking, the visual design, and roughly six specific ideas. Rewrite everything
else. Do not port this codebase to React Native.

---

## 1. Liveness check: the product is completely dark

Every deployed surface referenced by the code and README fails DNS resolution as of
this audit:

| Surface | URL | Result |
|---|---|---|
| Backend API (recipients) | `dwka6a2xd6.execute-api.us-east-1.amazonaws.com/recipients` | `NXDOMAIN` |
| Backend API (foodbanks) | `dwka6a2xd6.execute-api.us-east-1.amazonaws.com/foodbanks` | `NXDOMAIN` |
| Hosting | `main.d3d9kolrqh2fvt.amplifyapp.com` | `NXDOMAIN` |
| Custom domain | `gathering-mia.live` | `NXDOMAIN` |

The AWS API Gateway stage was deleted, the Amplify app was deleted, and the domain
registration lapsed. There is no database to migrate, no user table to preserve, no
traffic to avoid breaking, and no backwards compatibility burden.

**This is good news.** The revival is a greenfield build that inherits a completed
design system and a validated problem statement, with zero migration debt. Treat it
that way in planning.

### What is actually in the repository

| Path | State |
|---|---|
| `client/` | React 18.2 SPA, create-react-app, ~6,100 lines under `src/` |
| `server/` | **Empty directory.** No backend was ever committed. |
| `*.docx` (3 files) | The original product thinking. The most valuable assets here. |
| `docs/` | New, created by this audit |

### Branch archaeology

12 remote branches. The signal in them matters more than the code:

- **`origin/react-native` is byte-identical to `main`.** The branch was created and
  never touched. The React Native intent is three years old and has zero work behind it.
- `origin/typescript`: partial TS conversion that commented out every JS test to get
  the build green. Abandoned.
- `origin/copilot/fix-20`: an abandoned Copilot-driven migration to Next.js
  (adds `pages/_app.js`, `_document.js`, `[...params].js`, CSS modules). Abandoned.
- `origin/live-directions` / `live-directions-2.0`: the in-app turn-by-turn attempt.
  Commit `bd6c9f5` reads "only annouces first direction, need to test if the other
  directions are announced." **Section 3.7 identifies the root cause of that bug.**
- `origin/new-approach-map-render`, `refactor-delivery-map`, `inapp-directions`,
  `develop`, `comments-documention`: various states of partial.

Four separate abandoned platform migrations (TypeScript, Next.js, React Native,
in-app directions) is the clearest possible signal that the project stalled on
**re-platforming instead of on product**. The rebuild plan has to invert that.

---

## 2. What is salvageable

Salvage list, in order of value:

1. **`FoodDonationIdea.docx`.** This is the best thing in the repository and it never
   made it into code. It describes per-location driver rosters with claimable shifts,
   plus a surge mechanism: when a location has more than N recipients unserved past a
   staleness threshold, broadcast to **any driver in the zone regardless of their home
   center**, and allocate the most help to the strained location. That is a real
   dispatch design and it is the spine of the new PRD.
2. **The design system.** Figma-derived splash, gallery, logo, and 18 hand-made SVG
   icons (`foodbank.svg`, `community-garden.svg`, `map-filter-on/off.svg`,
   `map-menu-arrow.svg`, and so on). These port to React Native directly via
   `react-native-svg`. Do not redraw them.
3. **The screen flow.** Splash to geolocation consent, map with layer filters, food
   bank picker sorted by distance, QR handoff at pickup, ordered recipient list,
   navigate, confirm drop-off, completion screen. The information architecture is
   sound and was clearly designed rather than accreted.
4. **`data/communityGardens.json`.** ~13 **real** Miami community gardens with real
   addresses and phone numbers (Grow2Heal South Miami, Ready-to-Grow Gardens, Urban
   Oasis Project, The Green Haven Project, Earth n Us). Real seed data, keep it.
5. **The haversine implementation** buried in `DirectionsMap.js` lines 118 to 148. It
   is the only correct distance math in the repo. Extract it, then delete the two wrong
   implementations.
6. **The empathy in the copy.** The `ZERO_RESULTS` toast says "please don't worry about
   returning the food. Thank you for your understanding." The completion screen thanks
   the volunteer on behalf of the community. Someone thought about how a volunteer feels
   at 11am on a Saturday with a car full of boxes and a failed route. Keep that voice.

Everything else: delete.

---

## 3. Defect inventory

Ordered by severity. Every item was verified by reading the source.

### 3.1 CRITICAL: the distance math is wrong by roughly two orders of magnitude

`client/src/utils/pathFinding/calculateDistance.js` computes Euclidean distance on raw
latitude and longitude **degrees**, then multiplies by `0.621371` as though the result
were kilometres:

```js
const distanceInKm = Math.sqrt(Math.pow(latA - latB, 2) + Math.pow(lngA - lngB, 2));
const distanceInMiles = distanceInKm * 0.621371;
```

At Miami's latitude, 1 degree of latitude is about 69 miles and 1 degree of longitude
is about 62.6 miles. The function therefore reports a 6.9 mile trip as roughly 0.06
"miles". It is also **anisotropic**: it treats a degree of longitude as equal to a
degree of latitude, which is false everywhere except the equator, so it systematically
biases route ordering toward east-west movement.

Every distance shown to a volunteer in the recipient list is wrong. Every ordering
decision made by the route builder is made on wrong input.

### 3.2 CRITICAL: three different distance functions, two of them wrong, none shared

| Location | Method | Correct? |
|---|---|---|
| `utils/pathFinding/calculateDistance.js` | Euclidean degrees × 0.621371 | **No** |
| `Components/.../FoodBankChoice.js` (inline) | Euclidean degrees × 69.2 | **No**, but differently wrong |
| `pages/DirectionsMap/DirectionsMap.js` (inline) | Haversine, R = 3958.8 mi | **Yes** |

`FoodBankChoice.js` uses a 69.2 fudge factor, which is the miles-per-degree-of-latitude
constant applied to a two-dimensional Euclidean magnitude. It is closer to right than
`calculateDistance` but still wrong, and it means **the food bank list and the recipient
list rank distances on incompatible scales.**

### 3.3 CRITICAL: `findOptimalPath` does not find an optimal path

The README claims the app provides "an optimal route to ensure the volunteer drives
either the least amount of time or miles." It does neither.

- It is **greedy nearest neighbour**, which for a travelling salesman instance is
  typically 25% worse than optimal and can be arbitrarily worse.
- It optimises **straight-line distance**, not drive time, so it ignores roads, one-way
  streets, causeways, bridges, turn restrictions, and traffic. In Miami-Dade, where
  Biscayne Bay, the causeways, and the Keys corridor make Euclidean distance a poor
  proxy for drive time, this is a serious modelling error, not a rounding error.
- The tie-break in `findClosestRecipient.js` is broken. The condition is:

  ```js
  if (!closest ||
      (distanceToRecipient < calculateDistance(currentLocation, closest.position) &&
       distanceToFinalDestination < calculateDistance(closest.position, finalDestination)))
  ```

  The `&&` means a genuinely closer recipient is **skipped** unless it also happens to
  be closer to the final destination. The result depends on array order, not geometry.
- There is a dead `let count = 0; ... count = count + 1;` inside the loop that does
  nothing.

> **Measured afterwards, and it is worse than the above.** Running this algorithm faithfully
> against a real OSRM drive-time matrix ([#31](https://github.com/cdukedev/gatheringmia/issues/31)):
> the tie-break **fires 0 times in 222 comparisons**, across the original ordering and three
> shuffles. It returns input order every time. It was not a bad optimiser; it was not an
> optimiser.
>
> Root cause is two defects multiplying. `calculateDistance` rounds to a whole number above
> 10 "miles", and the hard-coded `finalDestination` is ~104 real miles away, so the shared
> leg dominates and **all recipients collapse onto a single value (`1.0`)**. The second
> clause is therefore `1.0 < 1.0`, false forever, and `closest` can never be replaced.
> That `1.0` is also the unit bug measured rather than inferred: it reports 1.0 "miles" for a
> distance of about 104. Scored on a real matrix, the resulting route runs **+90.5% worse.**
- Recipients are filtered by a hard-coded `zone` before routing, so cross-zone
  optimisation is impossible by construction.

### 3.4 HIGH: hard-coded magic values in the delivery flow

In `pages/HomeDeliveries/HomeDeliveries.js`:

```js
const [finalDestination, setFinalDestination] = useState({ lat: 24.2801423, lng: -80.6620736 });
const [deliveryCapacity, setDeliveryCapacity] = useState(5);
const zone = 2;
```

- `finalDestination` is **a point in open water in the Straits of Florida**, roughly
  100 miles south of Miami. Every route is optimised toward the ocean.
- The same literal is duplicated a second time inside the `useEffect` below it, so
  changing the state variable silently does nothing.
- `deliveryCapacity` was, per commit `4005d08`, "manually adjusted."
- `zone = 2` means the app only ever serves one hard-coded zone.

### 3.5 HIGH: recipient PII is handled with no protection at all

Recipient records carry **name, home address, and phone number of homebound, largely
elderly people**. In the current design:

- Coordinates are passed through the URL path: `/directions/:userLat/:userLng/:destinationLat/:destinationLng`. URLs land in browser history, in the referrer header, and in any analytics or crash reporter.
- The recipient list is fetched wholesale and held in unencrypted client state. A
  volunteer's device holds the full roster, not just their assigned stops.
- There is no authentication, no authorisation, no role model, no audit log, no
  encryption at rest, no data retention policy, and no consent flow.
- Nothing scopes a volunteer to the recipients they are actually delivering to.

If this product ever touches Medicaid, Medicare Advantage, or Older Americans Act
funding, that recipient roster is protected health information and this design is not
merely sloppy, it is unshippable. **This constraint drives the new architecture.**

### 3.6 HIGH: "in-app directions" is a bait and switch

`Components/.../Recipient/Recipient.js`, `handleRecipientClick`:

```js
if (isMobile) { window.location.href = mapsUrl; }   // leaves the app entirely
else { window.open(mapsUrl, "_blank"); }
navigate(`/directions/${coords.lat}/...`);          // then routes internally anyway
```

On mobile the user is thrown out to Google Maps, and the app *also* navigates to its
own `DirectionsMap` screen, which renders behind the departed session. The two
navigation systems fight each other. When the user comes back, the app has lost
delivery context.

### 3.7 HIGH: the voice navigation bug has a stale-closure root cause

Commit `bd6c9f5` records: "only annouces first direction, need to test if the other
directions are announced." The cause is identifiable from the source.

`navigator.geolocation.watchPosition(handleGeolocationUpdate, ...)` is registered once
inside `handleMapLoad` and once inside a `useEffect` gated on `!watchId`. The callback
closes over `directions`, `currentStepIndex`, and `hasCallbackRun` **as they were at
registration time**. `setCurrentStepIndex(currentStepIndex + 1)` therefore always
computes `0 + 1`, and the `directions` seen inside the callback is permanently `null`
from the first render. Only the first instruction ever fires.

The fix in a React codebase is a ref or a functional state updater. The fix in the
rebuild is to not hand-roll turn-by-turn at all.

### 3.8 MEDIUM: `FoodBankChoice.js` mutates context state during render

```js
foodBanks.map((foodBank) => { ...; foodBank.distance = ...; return foodBank; });
const sortedFoodBanks = foodBanks.sort((a, b) => a.distance - b.distance);
```

`.map()` is used for its side effects and its return value is discarded. Then `.sort()`
mutates the **context-owned array in place** during render. Under React 18 StrictMode
and concurrent rendering this is undefined behaviour, and it silently corrupts shared
state for every other consumer of `FoodBankContext`.

### 3.9 MEDIUM: the QR scanner scans nothing

`Components/.../QRScanner/QRScanner.js` renders a **static PNG image** of a QR code and
a "Begin Deliveries" button. There is no camera access, no decoding, and no
verification. The chain of custody at pickup, which is the one moment where the app
could produce an auditable fact, is theatre.

### 3.10 MEDIUM: Google Maps integration problems

- `<LoadScript>` is mounted inside both `Map.js` and `DirectionsMap.js`. Loading the
  Maps JS API more than once per document is unsupported and `@react-google-maps/api`
  warns about exactly this.
- `google.maps.Marker` is used throughout. Google deprecated `Marker` in February 2024
  in favour of `AdvancedMarkerElement`.
- `const google = window.google;` is read at component scope, before the script has
  necessarily loaded.
- `REACT_APP_GOOGLE_API_KEY` is inlined into the production bundle at build time by
  create-react-app. It is public by construction. Without HTTP referrer restrictions
  this is a billable-quota theft vector.
- The vehicle marker icon is **hotlinked from `images.vexels.com`**, a third-party CDN,
  which is both an availability dependency and a licensing question.

### 3.11 MEDIUM: responsive layout decided once, at render, from `window.innerWidth`

`pages/Home/Home.js`:

```js
if (window.innerWidth > 680) { return <Desktop />; }
```

No resize listener, no media query, no re-evaluation. Rotating a tablet does not change
the layout. `window` is read at render, which breaks under any server rendering.

### 3.12 LOW but pervasive

- `RecipientsList.js` maps to `<Recipient>` with **no `key` prop**, and leaves a
  `console.log(sortedRecipients)` on every render, printing recipient PII to the console.
- `console.log` PII leaks also in `Recipient.js`, `GeolocationContext.js`, and
  `DirectionsMap.js` ("New position:", full coordinates, on every geolocation tick).
- Five separate context providers nested five deep in `index.js`, communicating through
  five "Wrapper" components whose only job is prop drilling. Any state change in any
  provider re-renders the entire tree.
- `contexts/FoodBankContext.js` initialises `foodBanks` to `""` (a string) and then
  calls `.map()` and spreads it into an array. It works only because the fetch resolves
  before first paint on a fast connection.
- No error boundary anywhere.
- `public/index.html` has `manifest.json` **commented out**, so the "mobile web app"
  was not installable as a PWA. Description is still "Web site created using
  create-react-app". Title is "Feed Our Community", which does not match the brand.
- The entire test suite is decorative: one `App.test.js` snapshot, and a Cypress spec
  that visits `http://localhost:3000/gathering`, a route that does not exist in
  `App.js`.
- `utils/convertJson/prepared-for-mysql.js` is a 953-line committed data dump.
- `"fs": "^0.0.1-security"` is in `dependencies`. That package is a **security
  placeholder squatting the name `fs`**, containing no code. It was almost certainly
  installed by mistake and should never be in a browser bundle's dependency list.

### 3.13 Dependency and toolchain rot

| Package | Pinned | Status in 2026 |
|---|---|---|
| `react-scripts` | 5.0.1 | create-react-app is **deprecated and unmaintained**. React's own docs no longer recommend it. |
| `axios` | ^0.27.2 | Pre-1.0, multiple published CVEs since. |
| `enzyme` + `@cfaester/enzyme-adapter-react-18` | ^3.11.0 | Enzyme is **dead**. The React 18 adapter is a community stopgap. |
| `jest` | ^27.5.1 | Two majors behind, mismatched with `babel-jest` ^29. |
| `cypress` | ^10.6.0 | Many majors behind. |
| `create-react-app` | ^5.0.1 | Listed as a **runtime dependency**, which is wrong; it is a scaffolding CLI. |
| `fs` | ^0.0.1-security | Squatter placeholder, see 3.12. |
| `bootstrap` + `@emotion/react` + `sass` | all three | Three styling systems in one app, none used consistently. |
| `google-map-react` **and** `@react-google-maps/api` | both | Two competing Google Maps React bindings installed simultaneously. |

Local Node is v20.19.2, which is fine, but `react-scripts` 5 emits OpenSSL and webpack
warnings on modern Node and pulls a large tree of deprecated transitive packages.

---

## 4. Recommendation

**Do not port. Rebuild.**

The mechanical argument: there is very little to port. Strip the five context providers,
the five prop-drilling wrappers, the three distance functions, the broken greedy router,
the fake QR screen, the duplicated `LoadScript`, the DOM-coupled `window.innerWidth`
branch, and the Sass files (React Native has no CSS), and what remains of the 6,100 lines
is the SVG assets, the JSON seed data, one haversine function, and the screen flow. All
four of those are inputs to a new codebase, not code to migrate.

The strategic argument matters more. This project stalled four separate times on
re-platforming: TypeScript, Next.js, in-app directions, and a React Native branch that
was created and never touched. A fifth re-platforming exercise that ends with the same
feature set on a different runtime would be the same failure with a new package manager.

The rebuild is therefore scoped around the three things the old code never had, which
are the three things that decide whether this becomes a product:

1. **A backend and a real data model**, with authentication, authorisation, an audit
   trail, and a PHI-capable posture from day one. Section 3.5 is not a bug to fix later.
2. **Correct routing**, meaning a real road-network solver for a capacitated vehicle
   routing problem with time windows, not straight-line greedy nearest neighbour.
3. **Verified proof of delivery**, the thing a funder can audit, which is what makes
   this software somebody's line item rather than somebody's side project.

React Native is the right target, and for reasons the old app could not access:
background location for automatic drop-off detection, a real camera for the pickup
handoff, offline queueing for dead zones, and push notifications for the surge dispatch
described in `FoodDonationIdea.docx`. Those four capabilities are why native matters
here, and none of them are available to a mobile web app. They are specified in
`03-RN-ARCHITECTURE.md`.

See `01-MARKET-RESEARCH.md` for who pays and why, and `02-PRD.md` for the product
definition.
