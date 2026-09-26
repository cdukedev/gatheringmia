# GatheringMIA Market Research

**Date:** August 23, 2026
**Method:** 9 parallel research dimensions, ~645 web searches and fetches, followed by an
adversarial completeness critic that audited the corpus for gaps, unverified claims, and
contradictions between dimensions. Every material claim below carries a source. Estimates
are labelled as estimates.
**Scope:** competitive landscape, incumbent software, market sizing, payer economics,
regulatory surface, routing technology, React Native platform state, nonprofit go to
market, and the Miami-Dade local landscape.

---

## 0. Executive summary: the seven things that matter

**1. You are in the wrong competitive set, and correcting it changes the buyer.**
GatheringMIA was framed as a food rescue app. It is not. Its true adjacent competitor is
**ServTracker Mobile Meals** (CaseWorthy), the home-delivered-meals driver app, and the
buyer is a senior nutrition provider funded under the Older Americans Act, not a food
bank's donor-pickup program. The good news is that this dissolves rather than complicates
the strategy, because **Feeding South Florida is simultaneously a Feeding America food
bank and a contracted OAA Title III-C2 home-delivered-meals provider for Miami-Dade.** The
original food-bank premise and the Meals on Wheels buyer thesis are the same customer.

**2. Your exact product is already shipped and priced, by two vendors.** Food Rescue Hero
sells a "Home Delivery" module at **$250/month** with copy that names your exact user
("especially helpful for seniors, people with disabilities, and families without reliable
transportation"). Careit sells "Food Delivery Pro" at **$250/month per hub** with route and
stop management, an available-runs map, a driver delivery board, and ops reporting. You
cannot win on "we do home delivery." That is table stakes as of 2026.

**3. The market is small and the revenue ceiling is visible in a public tax filing.**
412 Food Rescue, which built Food Rescue Hero and licenses it to 18 organisations across
52 counties, books **$403,791 of program service revenue against $18,606,480 of total
expenses** (FY2024). That is roughly 2.4% of revenue after eight years. National TAM for
pure routing-and-proof-of-delivery software is **$50M to $60M ARR**. Plan for a $60K to
$450K ARR business from licensing, or find a different revenue line.

**4. There is a hard technical gate in Florida that nobody outside the sector knows
about.** The Alliance for Aging's OAA RFP states it in one sentence: **"Services not
reported in eCIRTS will not be reimbursed."** The term appears 57 times in that document.
Any Miami-Dade deployment must produce eCIRTS-compatible unit-of-service records or it is
a double-entry burden on the exact staff who would champion it. **Whether eCIRTS exposes
any API or import format is unverified and is the single most important open question in
this entire report.**

**5. Florida is the worst state in the country for the Food is Medicine wedge.** It has
no HRSN 1115 waiver, and its approved in-lieu-of-services list contains **zero** food or
nutrition services, all 17 are behavioural health or facility substitutions. Meanwhile the
federal policy foundation was rescinded on March 4, 2025, North Carolina defunded the
flagship program that proved $164 PMPM savings, and Medicare Advantage meal benefits fell
from 65% to 57% of individual plans between 2025 and 2026. **Do not build the plan around
a health plan paying.**

**6. Two legal constraints reshape the architecture, not just the paperwork.** Google Maps
Platform's Terms of Service **forbid processing HIPAA-regulated data** and Google will not
sign a BAA covering Maps, which invalidates the current mapping stack the moment a payer
or provider referral path exists. And under **Fla. Stat. 430.0402**, handing a volunteer a
recipient's name, address, and phone plausibly makes them a "direct service provider"
requiring Level 2 background screening above 20 volunteer hours per month, which collides
head-on with the cross-center surge-broadcast idea in `FoodDonationIdea.docx`.

**7. The single most actionable finding is a public PDF with email addresses in it.** The
Alliance for Aging **Funded Agency Roster (revised May 2026)** lists every OAA-funded
provider in Miami-Dade and Monroe with named staff, direct emails, and phone extensions,
including a designated **eCIRTS contact** at each one. It is a current primary-source
government document that functions as a free, complete CRM of every possible pilot
partner. It converts strategy into a callable list at zero cost.

---

## 1. The framing correction

The research began by treating GatheringMIA as a volunteer food rescue app. That framing
survived four dimensions and then broke. It is worth walking through the correction
because it changes the buyer, the integration surface, the price, and the product.

### 1.1 What food rescue actually is, and why GatheringMIA is not it

Food rescue is **donor-to-agency logistics**: a volunteer collects surplus from a grocer,
restaurant, or caterer and drops it at a pantry or shelter. The unit is a rescue run. The
value is diverted tonnage. Food Rescue Hero, Food Rescue US, Careit, Copia, Replate, and
Goodr all operate here.

GatheringMIA is **agency-to-household logistics**: a volunteer collects prepared meals or
boxes at a hub and delivers to named, homebound, enrolled individuals. The unit is a
delivered meal to a registered client. The value is a documented unit of service against a
funded contract.

Those are different products with different regulatory exposure. Food rescue touches
anonymous surplus and is shielded by the Bill Emerson Good Samaritan Act. Home-delivered
meals touch identified vulnerable adults, trigger client confidentiality rules under
45 CFR 1321.75, plausibly trigger Level 2 background screening, and must be reported into
a state system to be paid.

### 1.2 The correction, in the research's own words

> "This reframes the PRD: GatheringMIA is a home-delivered-meals driver app competing with
> ServTracker and Careit Food Delivery Pro, NOT a food rescue app competing with Food
> Rescue Hero. That reframe changes the buyer."

### 1.3 Why the two framings collapse into one customer

The Alliance for Aging Funded Agency Roster (May 2026) lists **Feeding South Florida**
under service code O3C2 for "Home Delivered Meals (frozen), Home Delivered Meals
(emergency), Screening & Assessment, Nutrition Education, Nutrition Counseling" and under
LSP for "Home Delivered Meals (frozen), Material Aide (Grocery Boxes)."

Feeding South Florida is a $161M Feeding America member food bank **and** a contracted
Older Americans Act home-delivered-meals provider. The pitch is therefore not "start
delivering meals to seniors," it is **"your existing O3C2 route runs on CERVIS and paper,
here is the driver app."**

---

## 2. Competitive landscape

### 2.1 Direct: the product already exists, twice, at $250/month

| Vendor | Product | Price | Notes |
|---|---|---|---|
| **Food Rescue Hero** (412 Food Rescue) | "Home Delivery" add-on | **$250/mo** on top of Basic $500 / Plus $1,000 / Premium $1,250 | $0 startup. Premium includes a custom private-labeled app. 18 licensees, 52 counties. |
| **Careit** | "Food Delivery Pro" | **$250/mo per hub ($3,000/yr)** | Route and stop management, available-runs map, driver delivery board, schedules and service holds, driver notifications, ops reporting. White label +$3,000/yr flat plus $10,000 setup. |

Food Rescue Hero's own marketing copy names GatheringMIA's exact user: *"With Home
Deliveries, volunteers bring rescued food directly to people's homes. This is especially
helpful for seniors, people with disabilities, and families without reliable
transportation."*

Careit's page meta keywords include **"meals on wheels software"** and its logo wall shows
Meals on Wheels, Salvation Army, Catholic Charities LA, YMCA, and White Pony Express. It
is the closest functional clone in the market and it is actively selling.

**Implication:** a Miami food bank can buy a white-labeled iOS and Android app with home
delivery from Food Rescue Hero for $1,500/month ($18,000/year) with $0 startup and a 20+
organisation reference network. **The realistic price ceiling for this category is $3,000
to $18,000 per organisation per year.**

### 2.2 Miami-Dade is not an unserved market

**Food Rescue US South Florida** has operated in Miami-Dade and Broward since 2018:
17,020,519 lbs diverted, 14,183,765 meals, 296 food donor partners, 122 social service
agency partners, **1,405 volunteers**. Nationally Food Rescue US runs 51 locations in 25
states plus DC.

The wedge is therefore not "a food bank with no software." It is **the household delivery
leg at a food bank that already has a food-rescue relationship for the donor leg.**

### 2.3 The category is mid-transition to native, and the window is open

Food Rescue US, the largest US volunteer food rescue nonprofit, shipped **its first true
native app on July 13, 2026**, six weeks before this research, at version 1.0 with 8
ratings, replacing a web-based app its own site still describes. Building React Native now
puts GatheringMIA on the same timeline as the incumbent leader rather than behind it. That
window closes as they iterate.

### 2.4 Incumbent quality is genuinely poor, and the complaints are specific

| App | Store | Rating | Ratings |
|---|---|---|---|
| ServTracker Mobile Meals | Google Play | **3.8** | 80 (10,000+ installs) |
| ServTracker Mobile Meals | iOS | **3.17** | 29 |
| Food Rescue Hero (white label) | Google Play | **3.0** | 8 |
| 412 Food Rescue | Google Play | 4.2 | 54 |
| Careit | Google Play | 4.7 | 24 |

Verbatim ServTracker reviews name failures that map directly onto a rebuild's
differentiators:

- *"it would be nice to not have to have GPS on just to mark a meal as delivered. Also, marking a meal as delivered often seems to take quite a long time"*
- *"the checks don't work all the time and it is frustrating when running up and down a building and trying to remember who you already delivered to"*
- *"Unable to sign out after completing rounds."*

412 Food Rescue reviews name broken auth and broken geofencing: *"I keep getting
notifications that I can pick things up but they're many states away from me, despite
having set my location."*

**Offline-first local writes with background sync, and a large-target confirmation UI that
does not require GPS to mark a drop, are concrete demonstrable wins.** Note the
"running up and down a building" complaint: that is the vertical-tower use case, and the
incumbent is failing at it today.

### 2.5 The category's installed base is trivially small

| App | Play installs | Play reviews |
|---|---|---|
| 412 Food Rescue | 10,000+ | 54 |
| MealConnect (Feeding America) | 5,000+ | 52 |
| Careit | 1,000+ | 24 |
| Food Rescue Hero | 1,000+ | 8 |
| **Too Good To Go** (consumer, for contrast) | **50,000,000+** | **1.98M** |

412 Food Rescue reached 10,000+ Android installs after ten years in a metro of 2.4 million.
**Do not model consumer scale. The business is B2B to the agency.**

### 2.6 Dead and zombie competitors, which is itself a finding

- **Waste No Food:** dead as a platform in 2026 despite a website still advertising app downloads.
- **ChowMatch:** iOS app untouched in over ten years, site copyright frozen at 2019, still claims 500 US cities.
- **Zero Percent:** Chicago's original food rescue tech player, functionally frozen, replaced by Chicago Food Rescue running on Food Rescue Hero white label.
- **Goodr:** venture-funded, mobile app left to rot.

Two lessons. First, **buyers in this category have been burned**, so any pitch will meet a
credibility objection and needs an explicit answer on operational continuity: data escrow,
export guarantees, uptime commitment. Second, **consolidation onto Food Rescue Hero white
label is the trend** for independent regional apps, which is precisely the fate to avoid or
exploit.

### 2.7 The structural threat: free gig logistics

**DoorDash Project DASH** gives food banks free, guaranteed, insured last-mile delivery,
with 8M+ deliveries completed. Replate markets an explicit anti-volunteer comparison table.
Even 412 Food Rescue now supplements its volunteers with Project DASH.

This is the objection in every food bank meeting: *"Project DASH is free and guaranteed,
why do I need volunteers?"* The three defensible answers:

1. **Cost at scale**, once free tiers and grant-funded DASH capacity are exhausted.
2. **The wellness check.** A Dasher does not notice that the mail has piled up, the AC is
   off in August, or that she seems unsteady. 96% of home-delivered meal programs already
   train drivers to watch for wellbeing. This is a required program function, not a
   feature.
3. **Coverage** in geographies and time windows where gig supply is thin.

Note the second answer is also a liability: see §5.4 on mandatory reporting.

### 2.8 Adjacent: the incumbent system of record

**ServTracker (CaseWorthy)** already ships GatheringMIA's entire feature set:

> "The Mobile Meals app, available for Android and IOS devices, facilitates delivery of
> meals by volunteers or staff. Integration with the device's mapping tools (e.g., Google
> Maps, Apple Maps, WAZE) enables easy directions to/from each client on the route.
> Extended features enable drivers to record delivery/non delivery, change of condition,
> menu choice selections... You can also enable delivery notifications which communicates
> delivery status to a client's emergency contacts."

It is owned by CaseWorthy, backed by Symphony Technology Group, which also acquired
Eccovia. At acquisition, ServTracker's maker served "over 400 direct service providers,
AAAs, and counties."

**But route optimization is a separately licensed upsell**, not a base feature:

> "Route optimization is available **when licensed** to select the best route based on
> clients receiving meals that day."

That means every program that did not buy the optimization license is running a
**manually sequenced route** today. That is the unmet pain.

**Price point, from a real government contract:** Allegany County NY (2021) paid
**$8,565 implementation plus $404/month** (~$4,848/year) for a small county Office for the
Aging. This is the only hard ServTracker price in public record.

### 2.9 The tier above: do not go there

**WellSky** claims **over 50% of US Area Agencies on Aging**, provides one-click OAAPS
reporting to ACL, has 20+ years of federal reporting lineage as the former Harmony
Information Systems (maker of SAMS), and was valued **north of $3 billion** in 2020. It is
the platform behind Florida's eCIRTS.

Do not build toward case management or OAA reporting. **GatheringMIA's entire viable
surface is below WellSky: the physical act of delivery and the volunteer who performs it.**

### 2.10 The volunteer-management layer is free, so it cannot be monetised

| Product | Free tier | Paid |
|---|---|---|
| **POINT** | Unlimited volunteers and admins, scheduling, messaging, time tracking, reporting, **mobile app** | Pro $99/mo annually |
| **Golden** | Unlimited volunteers, 5 admins, **background checks, waivers** | Professional $100/mo annually |
| VolunteerHub | none | Plus $143/mo, Pro $288/mo |

**Do not build or price around volunteer scheduling, hour tracking, or waivers.** Those are
free commodities with polished mobile apps. Paid value must live entirely in the delivery
execution loop.

Also note the category just consolidated: **Better Impact acquired Galaxy Digital (Get
Connected) on March 11, 2026**, forming an entity claiming 85,000+ organisations and
60,000+ nonprofits. Any generic volunteer feature will be inside a consolidated platform
within a year or two.

### 2.11 The companion-app model is already proven behaviour

Meals on Wheels programs **already bolt third-party route planners onto their system of
record**:

- Meals on Wheels of Chester County PA (~800 seniors, 30 rotating volunteer drivers) adopted **Upper Route Planner** (~$120/mo).
- **RouteSavvy** publishes a nonprofit meal delivery case study.
- **Routific** is free to 100 orders/month, then $150/month to 1,000 orders.

This is the strongest evidence that a companion app that never claims to be the system of
record is a real motion. It also names the true price comparables: **not ServTracker, but
Upper at $120/month and Routific at $150/month.**

### 2.12 The cautionary competitor

**Mon Ami** raised an $8.0M Series A in October 2023. Its 2021 product was a volunteer app
for 1:1 matching, grocery delivery, and prescription pickup, with customers including the
City of San Francisco and City of LA District 4. Its 2026 homepage leads with **eight
case-management modules** and names state customers in Kentucky, New Jersey, and Tennessee.

**The best-funded modern entrant tried the volunteer layer and moved to state contracts.**
That is the classic signal that the volunteer layer alone does not support venture
economics. Read it as: the niche is winnable but small, so either accept a services-scale
business, or design from day one for the multi-agency dispatch model Mon Ami abandoned.

---

## 3. Market size

### 3.1 The national numbers (verified, FY2024 data published April 2026)

| Metric | Value |
|---|---|
| OAA Title III home-delivered meals served per year | **179,196,480** |
| Total US expenditure on OAA home-delivered meals | **$1,442,758,822** (**$8.05 per meal**) |
| Seniors served | 1,178,677 (152 meals per senior per year) |
| Meals on Wheels network | ~5,000 community providers, 244M meals, 2.6M seniors |
| OAA Title III-C appropriation | **$1.059 billion** |
| Seniors food-insecure, low-income, and **not** receiving meals | **2,524,572** |
| Providers with a waitlist | 33%, ~36,000 seniors, **average wait 115 days** |
| US population 60+ | 82,481,715 (24.3%), projected 65+ to ~71M by 2030 |

### 3.2 Provider-reported pain, ranked (628 providers, 2025 Benchmarking Report)

| Challenge | % naming it |
|---|---|
| Funding to pay for meals | **71%** |
| Food prices | 67% |
| **Recruiting and retaining enough volunteers** | **53%** |
| Gas prices | 42% |

Also: 99.8% of home-delivery providers took action due to funding challenges, 51%
subsidise unfunded clients, 47% tapped reserves, 38% added seniors to waitlists (up from
28% in 2023). **96% train drivers to watch for wellbeing.** 46% have a health care
partnership.

**Lead every pitch with volunteer retention and cost per meal delivered, not with "better
routes."** The 115-day waitlist is the ROI story: more routes from the same volunteer pool
converts directly into waitlist reduction, which is the metric funders score.

One more number that explains the volunteer economics: the **IRS charitable mileage rate
has been frozen at 14 cents per mile since 1997**, against a 72.5 cent business rate. A
volunteer driver is absorbing roughly 58 cents per mile of real cost.

### 3.3 Derived TAM, SAM, SOM, with the caveat stated first

**These are the weakest numbers in this report.** The completeness critic flagged this
dimension as the least verified content in the corpus and the most certain to be quoted
verbatim. Specifically: the provider size mix is a stated guess, the assumption that 10% of
Feeding America's 60,000 agency partners run home delivery contributes $14.4M and is
self-described as "the weakest single input," and the $30,000 large-provider tier
**exceeds every observed comparable in the entire corpus** (Food Rescue Hero Premium plus
Home Delivery tops out at $18,000/year).

| Level | Estimate | Confidence |
|---|---|---|
| **US TAM**, routing + proof of delivery software | **$50M to $60M ARR** | derived, inflated by the $30K tier |
| **SAM**, volunteer-dependent and not incumbent-locked | ~3,042 orgs, **$13.7M ARR** | unverified estimate; the 40% lock-in haircut could be 20% to 70%, swinging SAM between $8M and $18M |
| **Florida SOM** at 100% share | $1.0M to $2.0M ARR | derived |
| **Miami-Dade SOM** at 100% share | $103K to $207K ARR | **known to be low by ~2x, see below** |

**The Miami-Dade SOM is wrong and the corpus contains its own refutation.** It was derived
by allocating Florida's meal spend on 60+ population share. But primary sources sitting two
dimensions away give the real figures:

| Source | Miami-Dade line | Amount |
|---|---|---|
| Alliance for Aging 2024 OAA RFP | Title III-C2 home-delivered meals **alone** | **$5,332,645** |
| Miami-Dade FY2025-26 Adopted Budget | County Meals on Wheels | **$1,876,000** (270,000 meals) |
| Miami-Dade FY2025-26 Adopted Budget | LSP High Risk Elderly Meals | **$1,211,000** (313,903 meals) |

**Real Miami-Dade home-delivered-meal-related spend is closer to $8M to $9M**, not $5.16M.
Adjust the SOM upward roughly 60% to 75%, giving perhaps **$165K to $360K ARR at 100%
share** and something like **$50K to $110K at a realistic three-year share.** Treat even
that as directional.

### 3.4 The honest read

A cleaner sanity check from the go-to-market dimension: ~5,000 Meals on Wheels providers
plus 250+ Feeding America food banks, at 1% penetration and $10K/year, is **about $525K
ARR.** And 412 Food Rescue's actual licensing revenue after eight years and 18 licensees is
**$403,791.**

**This is a $60K to $450K ARR business from software licensing.** That is a real business
for a solo builder, and it is not a venture business. Anything larger requires either the
volunteer-supply problem or a payer attachment, and §4 explains why the payer path is
closed in Florida right now.

### 3.5 Miami-Dade demand side

| Metric | Value |
|---|---|
| Miami-Dade population 60+ | **629,531** (23% of 2,731,939) |
| Elders at federal poverty level | 111,710 (17%); ~157,000 at or near poverty |
| **Elders with limited English proficiency** | **227,975 (35%)**; one of every two limited-English elders in Florida lives in Miami-Dade |
| Miami-Dade food insecurity | **15.1%** (up from 13.7% in 2022), vs FL 14.4%, US 14.5% |
| Florida senior (60+) food insecurity | 10.7% vs US 9.2%; **Florida ranks 43rd of 50** |
| PSA 11 elders 60+ (Miami-Dade + Monroe) | ~628,741; 88% minority, 68% Hispanic, 37% LEP |

The LEP number is a product requirement, not a demographic note. **Spanish-first UI is a
launch requirement in Miami-Dade, not a v2 feature**, with Haitian Creole close behind
(Feeding South Florida's own site translates to English, Spanish, and Haitian).

Scale of the gap: applying Florida's 10.7% senior rate to Miami-Dade implies roughly
50,000 to 67,000 food-insecure seniors, against a county Meals on Wheels program serving
270,000 meals a year, which at 7 meals a week covers about **740 people continuously.**

---

## 4. Who actually pays

### 4.1 The good news: a verified per-delivery price exists

North Carolina's Healthy Opportunities Pilots fee schedule (effective July 1, 2024) is the
only fully public per-unit fee schedule for home-delivered food in US Medicaid:

| Service | Rate |
|---|---|
| Medically Tailored Home Delivered Meal | **$7.92 per meal** |
| Healthy Meal (Home Delivered) | $7.70 per meal |
| Healthy Meal (For Pick-Up) | $7.10 per meal |
| **Implied delivery premium per meal** | **$0.60** |
| Healthy Food Box (Delivered) small / large | $104.97 / $176.51 |
| Healthy Food Box (Pick-Up) small / large | $97.47 / $169.01 |
| **Implied delivery premium per box** | **$7.50** |

The billing plumbing exists as standard HCPCS codes: **S5170** ("Home delivered meals,
including preparation; per meal") and **S5170-AC** (medically tailored), with managed care
organisations actively adding home-delivered meals as an in-lieu-of service in 2025-2026.

### 4.2 The bad news, stated plainly

**That payment goes to the entity that provides the food, not to a technology vendor.** No
state or payer in any document found pays a software vendor per delivery.

And the delivery increment itself is mostly physical cost. **$0.60 per meal must cover the
driver, the vehicle, the fuel, and the insulated packaging.** Software cannot rationally
take more than a minority share.

> **Labelled estimate:** a software layer can realistically capture **$0.15 to $0.60 per
> verified delivery event**, equivalently roughly **$8 to $25 per participant per month**.
> This is derived from the NC fee-schedule differentials, not observed, and must be tested
> against an actual agency's cost stack.

### 4.3 Florida is the worst state in the country for this wedge

Two verified facts:

1. **No HRSN 1115 waiver.** KFF's Medicaid Waiver Tracker (July 14, 2026) shows Florida's
   only pending 1115 action with **no SDOH provisions checked.**
2. **Zero food ILOS.** Florida AHCA's official SMMC In Lieu of Services chart lists 17
   approved in-lieu-of services. **Every single one is behavioural health or facility
   substitution** (ambulatory detox, crisis stabilisation, mobile crisis, partial
   hospitalisation, nursing facility). Not one is food, nutrition, meals, or groceries.

**There is no Medicaid line item to bill against for a meal in Florida outside long-term
care.** The two narrow Florida doors are SMMC Long-Term Care (home-delivered meals as a
covered HCBS for members at nursing-facility level of care) and plan "expanded benefits,"
which are plan-funded value-adds paid from administrative dollars and margin, with no
published fee schedule, droppable at contract renewal.

### 4.4 The policy direction is actively adverse

| Event | Date | Effect |
|---|---|---|
| CMS rescinded HRSN guidance (CIB03042025) | **March 4, 2025** | Moved to case-by-case review |
| One Big Beautiful Bill Act | 2025 | 1115 budget neutrality restricted to **federal Medicaid savings only**, structurally disadvantaging food interventions whose benefits cross budgets |
| **North Carolina HOP suspended** | **July 1, 2025** | Defunded by its own legislature **despite** a June 2, 2026 evaluation of 31,000+ participants finding **$164 PMPM** in reduced costs. Only $9M approved for an SFY27 partial restart |
| MA meal benefits | 2025 → 2026 | **65% → 57%** of individual plans; SNPs **73% → 66%** |
| Health Affairs assessment | March 12, 2026 | Approval of new HRSN waivers "highly unlikely" |

**A business case that requires the policy environment to improve is a bad business case
right now.**

### 4.5 The structural barrier even where money does flow

In every state where the money flows, **the state designates the system of record and
conditions reimbursement on the transaction being recorded there.** New York's DOH memo
(July 11, 2025) requires screening and navigation to happen "directly in the SCN IT
platform or in an interoperable platform."

A new mobile app cannot intercept the payment stream. It must **emit standards-based
records into whatever system the payer already mandates** (FHIR, 837 encounter, Gravity
Project SDOH codes), or be the platform via state procurement.

### 4.6 What food actually is, when a payer opens a social-needs budget

Two independent programs agree:

- **North Carolina HOP:** 89% of enrollees received at least one service; **85% of all services delivered were food services.**
- **CalAIM (California):** **59%+** of Community Supports users accessed Medically Tailored Meals or Medically Supportive Foods.

When a payer opens a social-needs budget, roughly six of every seven transactions are food
deliveries. High count is exactly where software leverage lives. NC ran roughly 10,000
transactions per month across three regions, which is realistic single-metro pilot scale.

### 4.7 The evidence argument is settled; the operational one is not

A Tufts study (Health Affairs, April 7, 2025) modelled national medically tailored meals as
**net cost-saving in 49 states**, averting ~3.5 million hospitalisations annually, ~$23B in
national savings. Massachusetts found a 23% reduction in hospitalisations. NC found $164
PMPM.

**Payers are no longer asking whether meals work. They are asking who can deliver them
reliably, prove it, and produce clean encounter data.** That is a logistics and
verification problem.

### 4.8 The payer seats are taken, and one competitor is a warning

| Vendor | Position |
|---|---|
| **Foodsmart** | $247.0M raised, 2.2M members, contracts with commercial insurers, Medicaid MCOs, MA plans |
| **Mom's Meals** | Largest national HDM vendor; $7.99 to $9.49 per meal; holds the Florida Medicaid relationships |
| **GA Foods (SunMeadow)** | 50 years old, **St. Petersburg FL**, sells into MA / Managed Medicaid / LTSS, partnered with InComm |
| **NationsBenefits** | **Plantation FL**, 30 miles from Miami, runs OTC/flex-card/grocery benefit plumbing, partnered with Instacart |
| **Season Health** | $34M Series A (a16z) plus $7M |

**GatheringMIA will not win a health plan RFP against Mom's Meals or GA Foods as a meal
supplier.** The two Florida companies are better read as partners than competitors.

The warning: **Papa**, the Miami-founded companion-care company, whose 2022 safety
reporting made plans warier of non-clinical workers in members' homes. That is a headwind
for any product putting screened-but-not-clinical people at a member's door.

### 4.9 Where the money actually is: Older Americans Act

| Metric | Value |
|---|---|
| OAA Title III-C appropriation | $1.059B (network asking $2.285B for FY27) |
| **Alliance for Aging total OAA funding, PSA 11** | **$17,422,295** (Jan 1 to Dec 31, 2025); $16,614,683 Miami-Dade |
| **Title III-C2 home-delivered meals, Miami-Dade** | **$5,332,645** across six regions |
| Alliance for Aging total revenue (FY2024, 990) | $66,447,296 |
| Required local match | 10% ($1 per $9), per 2 CFR 200.306 |
| Contract structure | 12 months, renewable annually **up to five consecutive years** |

**This is the actual first customer.** One entity controlling ~$65M a year in Miami-Dade
and Monroe, contracting out to provider agencies that each run delivery routes.

**But note the timing risk:** no 2026 Alliance RFP was located. The 2024 RFP runs contracts
from January 1, 2025 with up to five annual renewals, **which may mean the channel is
closed to new providers until 2030.** That is unverified and is a one-phone-call question.
It does not block selling *to* incumbent providers as a subcontractor, which is the
recommended motion anyway.

---

## 5. Regulatory and compliance surface

### 5.1 When recipient data becomes PHI

Recipient data becomes PHI, and GatheringMIA becomes a HIPAA business associate, **only
when it performs a function on behalf of a covered entity involving PHI.** Merely knowing
someone is homebound and receiving food is not PHI if the data comes from the recipient or
a non-covered food bank.

The CHCS/CHLPI framework names four compliant pathways: patient authorisation,
treatment-based disclosure, business associate arrangements, and research under data use
agreements.

**Engineering requirement: two distinct data tenancies from day one.** A non-PHI tenancy
(self-referred or food-bank-referred, consent-based) and a PHI tenancy (payer or provider
referred). **The trigger is the contractual relationship, not the content.** A single shared
recipients table that mixes both sources pulls the whole system into HIPAA scope
permanently.

The cheapest compliant v1 is pathway 1: explicit recipient authorisation captured in-app,
which avoids BAA status entirely while a food bank partner is the only source.

### 5.2 HIPAA penalties, if a BAA is signed

Effective January 28, 2026 (inflation multiplier 1.02598):

| Tier | Per violation | Annual cap |
|---|---|---|
| 1, Did Not Know | $145 min | |
| 2, Reasonable Cause | $1,461 to $73,011 | $146,053 |
| 3, Willful Neglect | $14,602 to $73,011 | $365,052 |
| 4, Willful Neglect, uncorrected | $73,011 to **$2,190,294** | **$2,190,294** |

Business associates are **directly liable**. Criminal exposure runs to 10 years.

The current codebase is a Tier 3 or 4 fact pattern under a BAA: recipient name, address,
and phone in URL path params, no auth, no risk analysis, no access controls. OCR closed 12
enforcement actions under its Risk Analysis Initiative by early 2026.

### 5.3 The Google Maps HIPAA fork

This is the single highest-impact architectural constraint in the report.

**Google Maps Platform Terms of Service, General Restrictions:** customer will not use the
Services *"to transmit, store, or process health information subject to United States
HIPAA regulations."* Google's BAA covers Google Cloud and Workspace. **Consumer products
including Maps are never covered.**

By contrast, **Amazon Location Service is on the AWS HIPAA Eligible Services list**, along
with Amplify, Cognito, SNS, AppSync, API Gateway, Lambda, RDS, and DynamoDB, all under a
self-service BAA in AWS Artifact.

**GatheringMIA currently runs on `@react-google-maps/api` 2.12 plus Google Maps deep
links.** If any payer or provider referral path is added, that layer must be replaced or
firewalled. Two designs:

- **(a)** Keep Google but never send a recipient identifier or recipient-specific address to it; geocode server-side and pass only anonymous coordinates. Fragile and hard to prove.
- **(b)** Move mapping to a BAA-covered vendor. Maintainable, and a first-order PRD decision.

**Unresolved and important:** whether Mapbox, HERE, or TomTom will sign a HIPAA BAA for
their navigation SDKs. No public compliance documentation was found. **Note the corpus
contradicts itself here:** the routing and React Native dimensions both recommend Mapbox on
pure cost grounds without mentioning HIPAA once. **The cost-optimal architecture may be
contractually unusable the moment a payer path exists.** Resolve before committing.

### 5.4 Florida-specific volunteer constraints

**Level 2 background screening (Fla. Stat. 430.0402).** A "direct service provider" is a
person 18+ who "has direct, face-to-face contact with a client while providing services and
**has access to the client's living areas, funds, personal property, or personal
identification information**," and the definition **expressly includes volunteers.**
Exemption: volunteers under **20 hours per month** not on the Career Offender or National
Sex Offender registries. Rescreening every 5 years.

**The app itself is what grants that data access.** Because it hands a driver a recipient's
name, address, and phone, every driver over 20 hours/month plausibly requires Level 2
screening.

> **Caveat, stated by the researcher:** "this is my reading of the plain text, not a cited
> agency interpretation or advisory opinion." It needs written confirmation from DOEA or
> AHCA. It determines whether the 20-hour exemption is usable at all.

**This collides directly with the surge-dispatch idea in `FoodDonationIdea.docx`.** A
broadcast to "any driver in the zone regardless of home center" can only legally reach
screened drivers, or drivers still under their monthly cap. **The app must meter volunteer
hours per driver per calendar month and hard-gate assignment at 20 hours for unscreened
drivers.**

Disqualification under Fla. Stat. 435.04 is triggered by **pending arrests, not just
convictions**, so eligibility is a live, server-side computed state that can flip
mid-cycle. A client-cached "approved" boolean is not acceptable. Cost: roughly **$75 to
$110 per driver**, recurring every 5 years (estimate from vendor pages, not an AHCA fee
schedule).

**Volunteer driver liability is the largest uninsured exposure in the model.** The federal
Volunteer Protection Act (42 U.S.C. 14503) **expressly excludes motor vehicle operation.**
Florida's own statute (768.1355) grants the volunteer immunity but then provides that **the
nonprofit becomes liable to the same extent** as if immunity had not been provided.

And Florida requires **$0 bodily injury liability** for ordinary passenger vehicles (only
$10K PIP plus $10K PDL). Florida is one of only two states like this. **"Driver must carry
state-minimum insurance" is a meaningless standard in Florida.** The app must set its own
floor (industry norm 100/300/50 or at least 50/100/25), verified from the declarations page
with an expiry date, not self-attested. This has a real recruiting cost: a meaningful share
of Miami volunteer drivers will not meet it.

**Mandatory reporting (Fla. Stat. 415.1034).** **Every person** in Florida is a mandatory
reporter of suspected abuse, neglect, or exploitation of a vulnerable adult. Failure to
report is a second-degree misdemeanour; a knowingly false report is a third-degree felony.

Product requirement: a one-tap "concern about this recipient" flow that surfaces the
Florida Abuse Hotline (**1-800-96-ABUSE**), **states that the volunteer personally must
report**, records that the prompt was shown and what was selected, and routes an internal
alert to the partner agency. **The app must never position itself as reporting on the
volunteer's behalf, because the duty is personal and non-delegable.**

### 5.5 OAA client confidentiality applies with no payer at all

**45 CFR 1321.75** (2024 OAA final rule): "No information about an older person obtained
from an older person by a service provider or the State or area agencies may be disclosed
in a form that identifies the person without the informed consent of the person or of his
or her legal representative."

This is a lower bar than HIPAA but **it is the bar that actually applies to the most
realistic Miami-Dade first partner, and it applies to v1.** Requirements: per-recipient
informed consent with version and timestamp; role-scoped minimisation so a driver sees only
today's stops for the duration of that route; **no third-party analytics SDK receiving
recipient identifiers or precise stop coordinates**; an auditable monitoring-agency export.

### 5.6 Accessibility is now a binding deadline

WCAG 2.1 Level AA is legally required on two independent tracks that both reach
GatheringMIA through its partners:

| Track | Rule | Deadline |
|---|---|---|
| **HHS Section 504** (45 CFR Part 84) | Recipients of HHS federal financial assistance | **May 11, 2027** (15+ employees), May 10, 2028 (fewer) |
| **DOJ ADA Title II** | State and local government web content and mobile apps | **April 26, 2027** (50,000+ population), April 26, 2028 (smaller) |

Both agencies issued one-year extensions in 2026, and DOJ stated it "fully anticipates
implementing the regulation at the new deadline."

Requirements: full VoiceOver and TalkBack support on every delivery flow, 4.5:1 contrast,
dynamic type to OS maximum without clipping, **no colour-only status encoding** (the
current SVG icon set and zone colours are a risk), accessible names on map annotations,
44x44pt minimum touch targets. **Retrofitting WCAG 2.1 AA into a shipped React Native app
is far more expensive than designing to it.**

### 5.7 Breach notification: design to 30 days, not 60

| Regime | Deadline |
|---|---|
| HIPAA (45 CFR 164.404) | 60 days |
| **Florida (Fla. Stat. 501.171)** | **30 days** to individuals and to the AG (500+ FL residents) |

Florida penalties escalate from $1,000/day for the first 30 days to $50,000 per subsequent
30-day period, capped at $500,000 per breach. **The Florida clock governs a mixed dataset.
Build the 30-day runbook.**

Also: **precise geolocation is classified as sensitive data requiring opt-in consent in the
majority of the 20 states with comprehensive privacy laws** (commonly defined at a ~1,750
foot radius). Recipient home coordinates are precise geolocation about a vulnerable person
and should never reach any third-party SDK.

### 5.8 App store gates

**Google Play background location** is a formal evidence-based review: a Permissions
Declaration Form, a **single** named location feature (not multiple), a **30-second demo
video** showing the feature triggered from the background plus the disclosure dialog plus
the runtime prompt, and an in-app prominent disclosure using the word "location" and
describing use "when the app is closed." Google explicitly rejects background location used
**"solely for employee tracking."**

Google states foreground access "is our preferred approach." **A foreground service with a
persistent notification during an active route arguably fails Google's own question 4
("could the app deliver the same experience without background access"), which means
choosing foreground-only removes an entire review gate.** If arrival geofencing while
locked is a hard requirement, budget a multi-week review with real rejection probability.
Google publishes no turnaround time, so the Android timeline is unbounded.

**Apple:** Guideline 5.1.5 requires location to be "directly relevant"; 5.1.1 requires
specific purpose strings and **an in-app consent withdrawal control** (a common rejection
cause); 5.1.3 bans sharing health-context data with third parties and **bans storing
personal health information in iCloud.** If dietary-restriction or medical-condition fields
are ever added, do not sync them to CloudKit and do not let analytics see them.

---

## 6. Routing technology

### 6.1 The problem is small and the correct answer is cheap

GatheringMIA's problem is a **Capacitated Vehicle Routing Problem with Time Windows
(CVRPTW)** at 10 to 200 stops. At that size it is computationally trivial.

**VROOM v1.12.0** on the 56-instance Solomon VRPTW 100-customer benchmark: **average 359
ms, median 382 ms, longest 716 ms**, with gaps to best-known of **median +1.12%, average
+1.63%.**

**OR-Tools 9.14** average gap to best known at a 1-minute limit: **1.5% at 100 customers,
4.4% at 200.**

Greedy nearest-neighbour typically lands **15% to 25% worse than optimal.** The current
code is therefore not just wrong from the ~100x unit bug; it is **unnecessarily** wrong,
because the correct answer returns in tens of milliseconds. **The hard part is the
travel-time matrix, not the solver.**

### 6.2 Google's March 2025 pricing change is the trap

Google **retired the pooled $200 monthly credit on March 1, 2025** and replaced it with
per-SKU free caps that **do not pool**: 10,000 events (Essentials), 5,000 (Pro), **1,000
(Enterprise)**.

| Google SKU | Free/month | Price |
|---|---|---|
| Routes: Compute Routes (Essentials) | 10,000 | $5.00/1,000 |
| Routes: Compute Route Matrix (Essentials) | 10,000 | $5.00/1,000 **per element** |
| **Route Optimization: Single Vehicle** (Pro) | 5,000 | **$10.00/1,000 shipments** |
| Route Optimization: Fleet Routing (Enterprise) | 1,000 | $30.00/1,000 |
| **Navigation SDK** (Enterprise) | **1,000** | **$25.00/1,000 destinations** |

**The Navigation SDK bills per destination, not per session.** That is $0.025 per stop
navigated, scaling linearly with the exact thing the product wants to grow.

**The architectural trap:** hand-rolling a solver on Google's matrix. A 16x16 matrix per
route at 520 routes/month is 133,120 elements, **~$592/month**, versus **$28/month** for
the same work through Route Optimization. **Never hand-roll the solver on Google's matrix.**

### 6.3 Cost comparison at realistic scale

Modelled at **7,800 stops/month** (60 drivers x 15 stops x 2 days/week):

| Stack | Monthly cost |
|---|---|
| **Mapbox** (Optimization + Navigation + Maps) | **~$0.54** |
| Self-hosted OSRM + VROOM on one r7i.large | ~$64 to $100 flat (realistically $200 to $350 with HA, monitoring, storage) |
| Google (Route Optimization $28 + Navigation SDK $170) | ~$198 |
| Google, hand-rolled matrix | ~$790 |
| HERE Tour Planning | ~EUR 204 |
| Onfleet Scale | $1,349 |
| Spoke (formerly Circuit for Teams) | $200 to $1,000 |
| OptimoRoute at 60 drivers | ~$2,646 |
| Track-POD Advanced at 60 drivers | ~$2,940 |

**Mapbox free tiers are 10x to 100x more generous** than Google's post-March-2025 caps on
exactly the needed SKUs: Directions, Matrix, Optimization, and Isochrone are each **100,000
free requests per month**; Mobile Maps SDK is free to **25,000 MAU**; Navigation SDK
metered trips are free to 100 MAU and 1,000 trips, then $0.30/MAU and $0.08 per 1,000
trips.

**For a nonprofit product, buying a last-mile SaaS platform is 10x to 20x the cost of
building on a routing API.** That flips the usual make-vs-buy answer. Those vendors' real
value is as a feature checklist and a pricing benchmark to cite when pitching.

### 6.4 The React Native navigation fork

| Option | Status | Cost | Risk |
|---|---|---|---|
| **`@googlemaps/react-native-navigation-sdk`** | **Official Google, Beta (pre-1.0)** | $0.025/stop | Requires RN 0.79+ New Architecture; incompatible with projects pulling other Google Maps SDK deps; not covered by GMP SLAs |
| **Mapbox community bridges** (`@pawan-pk`, `@homee`, `@routebuddies`) | Third party | ~$0.0026/stop | **No verified maintenance signal, no confirmed New Architecture compatibility** |
| **Deep link out** to Google/Apple Maps | Free, no key, no quota | $0 | Loses arrival detection, ETA telemetry, proof-of-delivery continuity, live re-sequencing |

> **Flagged as "the highest-priority open question for the navigation decision":** the
> Mapbox community bridges have no confirmed New Architecture support. Since RN 0.82+ runs
> **only** on the New Architecture, if those bridges do not support it, the cost-optimal
> recommendation collapses and the fallback is Google at roughly 10x per stop.

> **RESOLVED 2026-08-23, and the answer is the bad one.** Measured against the npm registry
> and the GitHub API: **every Mapbox bridge is dead.** `@pawan-pk` last published
> 2024-10-08 (314 weekly downloads), `@homee` 2021-07-21 (11 downloads, 69 open issues),
> `@routebuddies` 2023-05-23 (3 downloads). **Not one has published since RN 0.82 made the
> New Architecture mandatory in October 2025.** The cost-optimal recommendation does
> collapse. Decision: no in-app turn-by-turn, deep-link out instead. Note this kills only
> Mapbox *navigation*; `@rnmapbox/maps` for rendering is healthy at 212,172 weekly downloads.
> See [#24](https://github.com/cdukedev/gatheringmia/issues/24).

> **Also resolved, in the other direction:** §10.1 and §7.2 of this report treat
> `react-native-maps` offline tiles as unverified and likely unsupported. **`<UrlTile>`
> supports them** via `tileCachePath`, `offlineMode`, and `maximumNativeZ`, verified on the
> installed 1.27.2. That removes a Mapbox dependency for rendering too.
> See [#25](https://github.com/cdukedev/gatheringmia/issues/25).

**Deep-linking is what the current app does, and it is the source of the bait-and-switch
bug.** It costs $0 forever but hands the driver to another app mid-route. For a product
whose value proposition is a route-ordered list with drop-off confirmation, that is a
product-level downgrade, not a UX one.

### 6.5 Self-hosting is genuinely viable for a Florida-only product

The Florida OSM extract is **624 MB** (Geofabrik, 2026-08-22). OSRM needs roughly 5x the
PBF in RAM, so **~3 GB for Florida** versus ~50 GB for the full USA. An AWS r7i.large
(2 vCPU, 16 GiB) is $0.132/hr on-demand (~$96/month) or $0.088/hr reserved (~$64/month).

**OSRM + VROOM gives unlimited road-network matrices and unlimited CVRPTW solves at a flat
cost that does not scale with stops.** All the relevant projects are actively maintained:
osrm-backend and valhalla both pushed 2026-08-22, or-tools 2026-08-20, graphhopper
2026-08-21. VROOM last pushed 2026-05-11.

**It also sidesteps a licensing problem.** Google's terms permit caching Route Optimization
coordinates for only **30 consecutive days**. GatheringMIA stores coordinates for homebound
seniors permanently. Self-hosted OSM-based geocoding and routing removes the caching
restriction entirely, which is an underrated argument for the open-source path in a product
handling vulnerable-population PII.

### 6.6 Miami-Dade geography indicts the current algorithm specifically

| Constraint | Value |
|---|---|
| Population / area | 2,814,927 over ~1,900 sq mi, 1,481.6 per sq mi |
| Mean commute | 30.9 min (FL 28.0) |
| Congestion | Miami ~74 to 75 hours lost per driver, 5th to 6th nationally (partial verification) |
| **Overseas Highway (US-1)** | **113 miles, the only road in or out of Monroe County** |
| Hurricane season | Mandatory Category 3+ evacuation of Monroe; no county shelters opened |

Euclidean distance on raw lat/lng, in a county where the Keys leg is a single 113-mile road
with no alternates and where causeway and I-95/Palmetto congestion dominates travel time,
produces routes that are **not merely suboptimal but nonsensical.** The synthetic recipient
data scattered across the Keys in `recipients.json` is a routing worst case, not a toy.

### 6.7 The mode split changes the routing formulation

Miami-Dade's model is **predominantly weekly frozen delivery**, not daily hot delivery.
Miami-Dade County: "Eligible Meals on Wheels participants receive **seven free frozen meals
each week**."

The May 2026 Alliance roster codes providers explicitly:

- **Frozen:** Feeding South Florida, Miami-Dade County CSD, JCS (kosher), UNIDAD of Miami Beach, Monroe County Social Services
- **Hot:** City of Miami Springs, Hialeah Housing Authority, Hialeah, Hialeah Gardens, Sweetwater, West Miami, Florida City, Allapattah Community Action
- **Both:** LHANC, United Home Care, Independent Living Systems, First Quality

**Frozen runs are capacity and cold-chain constrained** (how many boxes fit in a
volunteer's trunk). **Hot runs are time-window constrained.** A single hard-coded
`deliveryCapacity = 5` fits neither. The PRD needs a genuine capacitated formulation plus
an explicit hot-versus-frozen mode.

---

## 7. React Native platform (August 2026)

### 7.1 The platform question is settled

| Component | Current |
|---|---|
| React Native | **0.87.0** (2026-08-11) |
| **Expo SDK** | **57** (`expo@57.0.15`), bundles RN 0.86 + React 19.2 |
| Architecture | **New Architecture mandatory.** RN 0.82 was the first to run entirely on it; RN 0.84 removed legacy components and made Hermes V1 default; Expo SDK 55+ dropped legacy |
| Router | Expo Router v7 |
| E2E | **Maestro** (first-party in EAS Workflows) |
| OTA | **EAS Update** (CodePush retired 2025-03-31) |

**Every "should we enable the New Architecture?" post from 2023-2024 is dead information.**
Any dependency that has not shipped Fabric/TurboModule support is unusable, which is the
correct screening test. It also confirms the 2022 CRA codebase shares **literally zero
runtime** with the target platform.

**Expo SDK support is ~1 year.** A solo maintainer who lets the project sit for two years is
back in exactly the dormant, unbuildable state it is in today. **Pin the upgrade cadence as
an operational requirement.**

### 7.2 Three specific soft spots

**1. `expo-maps` is alpha.** Officially "in alpha," "will frequently experience breaking
changes," Apple Maps on iOS and Google Maps on Android with no cross-platform provider
choice, no clustering, no documented offline maps. Not the foundation for a
navigation-heavy core screen.

| Map library | Version | Weekly downloads |
|---|---|---|
| **react-native-maps** | 1.29.0 | **1,153,353** |
| @rnmapbox/maps | 10.3.5 | 212,830 |
| @maplibre/maplibre-react-native | 11.3.7 | 121,816 |
| expo-maps (alpha) | 57.0.2 | 117,679 |

**2. WatermelonDB has been quiet for 16 months.** Last stable release 0.28.0 on 2025-04-07.
GitHub issue #1969 (opened 2026-06-05) asking about New Architecture, Bridgeless, and Expo
SDK 54+ support **has no maintainer answer.** Do not adopt it for a project whose whole
premise is never going dark again.

**Realm is dead for sync:** Atlas Device Sync reached EOL 2025-09-30 and 20.x removed cloud
sync entirely. Any 2023-era architecture doc recommending Realm sync describes a product
that no longer exists.

The local data layer has consolidated around SQLite: **`expo-sqlite` (994,957 weekly
downloads)** or **`op-sqlite` (140,364, published 2026-08-21)**. `expo-sqlite` gained a
SQLite Inspector DevTools plugin and a tagged-template-literal query API with automatic
parameter binding in SDK 55, which directly addresses the PII-handling sloppiness in the
current codebase by making parameterised queries the path of least resistance.

**PowerSync** is the credible managed sync option: free tier is 2 GB synced/month, 500 MB
hosted, 50 peak concurrent connections, which covers an entire pilot at $0; Pro from
$49/month; self-hostable Open Edition. **Gotcha: projects deactivate after 1 week of
inactivity**, which is a real risk for a seasonal volunteer app pausing over the holidays.

**3. Background location is the most review-hostile permission on both stores.**

`expo-location` is adequate only for foreground and geofence-triggered work. Its own docs:
*"Background location will stop if the user terminates the app"*; *"Android: A terminated
app will not automatically restart when a location or geofencing event occurs"*; **iOS will
restart a terminated app on a geofence event.** Geofence caps: Android 100, iOS 20.

Continuous tracking through termination requires **`react-native-background-geolocation`
(Transistor Software)**, licensed at **$399 (Starter) to $999 (Studio)**, free in debug
builds, with an Expo config plugin. Note it has only 44,734 weekly downloads versus
`expo-location`'s 2,250,161. **Licence scope is not published** (one app ID or many,
perpetual or annual, updates included), so contact sales before budgeting.

**This is the fork:** if the requirement is only "confirm the driver arrived at each stop,"
**iOS geofencing (which restarts a terminated app) plus foreground tracking is free and
avoids the Android background-location permission entirely.**

### 7.3 Launch-path gates that are easy to miss

**Apple review is visibly slower in 2026**, and Expo's own app proves it: **Expo Go for SDK
55, 56, and 57 have all been stuck awaiting App Store approval for months.** Apple claims
~90% within 24 hours; real-world new-app submissions run 2 to 5 days with spikes past 7.
Q1 2026 worldwide app releases were up 60% YoY (80% on iOS).

**Do not put an App Store submission on the critical path of a partner's launch date.**
Budget 2 to 5 days happy path, 3 to 6 weeks for a first submission that draws a
background-location question. **Build with `expo-dev-client` from day one** rather than
depending on Expo Go, which is chronically behind on iOS.

**Google Play's 12-tester / 14-day closed-testing gate** applies to personal developer
accounts created after 2023-11-13. **An organisation account with a D-U-N-S number
sidesteps it entirely** and can publish straight to production. **The D-U-N-S is free but
can take up to 30 business days, so start it early.**

**The Apple nonprofit fee waiver is a one-way door.** A US 501(c)(3) can get the $99/year
fee permanently waived, but the waiver requires a **legal entity (not a sole proprietor)**
and **forbids the Paid Applications Agreement, in-app purchase, and selling digital
goods.** If GatheringMIA ever charges a food bank a SaaS fee, that revenue must come via
web billing or an off-App-Store contract. **Resolve this before enrolling the developer
account.**

**EAS Update cannot fix what most often needs fixing.** It ships JS, styling, and images.
It explicitly **cannot** update native code, native dependencies, **app permissions
(camera, location)**, or the Expo SDK version. **Plan the permission model up front,
because permission changes are the expensive kind.**

### 7.4 The rest of the stack

| Need | Choice | Cost |
|---|---|---|
| Crash/perf | **Sentry** (`@sentry/react-native`, 2.79M weekly downloads) | Free Developer tier: 5,000 errors/month |
| Alternative | EAS Observe (GA **2026-08-20**, two days old) | Bundled: 100K events on Free |
| Camera/QR | `expo-camera` (1.97M) or `react-native-vision-camera` (584K) + MLKit code scanner | Free |
| Push | `expo-notifications` (4.25M, highest of any package surveyed) | Free; 600/sec per project |
| Build/CI | EAS | Free: 15 iOS + 15 Android builds; Starter $19/mo; Production $199/mo |

**Push rate limits are orders of magnitude above what Miami-Dade volunteer counts need**,
so the surge-broadcast fan-out from `FoodDonationIdea.docx` is not a scaling problem.

**Operational note:** SDK 55 turned the Expo Go Android push warning into a **hard error**,
so Expo Go is not a viable dev environment for this app at all.

---

## 8. Go to market

### 8.1 The price band is set by comparables

| Product | Price |
|---|---|
| Careit Food Delivery Pro | **$250/mo per hub ($3,000/yr)** |
| Food Rescue Hero + Home Delivery | $750 to **$1,500/mo ($9,000 to $18,000/yr)** |
| ServTracker (Allegany County NY, 2021) | $8,565 setup + $404/mo (~$4,848/yr) |
| Upper Route Planner (used by MOW Chester County) | ~$120/mo |
| Routific | Free to 100 orders/mo, then $150/mo |
| CharityTracker | $20/$40/$60 per user per month |
| PantrySoft | $50/$75/$125 per month by household count, $500 to $5,000 implementation |
| POINT / Golden | **Free** |

**Recommended:** price **per organisation, not per driver or per seat**, and **publish it.**
A food bank with 40 volunteer drivers will not pay per seat. Credible entry: **$99 to $299
per month single site, $500 to $1,250 multi-site.**

### 8.2 The micro-purchase lane is the real entry strategy

**2 CFR 200.320** sets a micro-purchase threshold (commonly **$10,000**) below which
purchases may be awarded **without soliciting competitive quotations**. Miami-Dade County
requires formal advertised competition over $25,000, with written quotations from $1,000 to
under $50,000.

> **Price the first two or three deployments under $10,000 per year on purpose.** That keeps
> a federally funded provider inside micro-purchase territory, removes the three-quote
> requirement, and lets an operations director sign without an RFP.

(Caveat: the April 2024 Uniform Guidance revision changed micro-purchase self-certification
rules and the current figure could not be verified from primary source. Re-verify before
structuring a contract.)

### 8.3 Who signs, and what actually blocks the sale

NTEN and Heller Consulting 2024 Nonprofit Digital Investments Report:

| Barrier | % |
|---|---|
| Available budget | **77%** |
| Lack of grant or funder support | 47% |
| Organisation culture | 44% |
| Donations/fundraising support | 38% |
| Leadership buy-in | 28% |
| **Board buy-in** | **12%** |

**Board approval is a myth for a sub-$10K tool.** The blocker is the budget line. **The
highest-leverage GTM move is therefore not a better demo, it is bringing the money with the
product**: a co-application to Florida Blue or Kroger where GatheringMIA is a named line
item in the provider's own grant.

**Timing:** Feeding South Florida's fiscal year ends June, so it sets budget in spring.
**Any Miami pilot conversation must start by February or March to land in the following
fiscal year.**

### 8.4 Nonprofit status is worth real money, and carries a real risk

| Program | Value |
|---|---|
| **Google Ad Grants** | **Up to $10,000/month** in Google.com search ads (~$120,000/yr) |
| **Google Maps Platform nonprofit credits** | **Starting at $250/month** |
| AWS Nonprofit Credit Program | Up to $5,000, via TechSoup |
| Microsoft Azure | $2,000/year |

For a routing product whose unit cost is Directions and Matrix calls, **the Maps credit
alone can swing gross margin.** This is the strongest single argument for the 501(c)(3) or
fiscal sponsorship path.

**But a 501(c)(3) that sells software to other nonprofits carries exemption risk.**
*B.S.W. Group, Inc. v. Commissioner*, 70 T.C. 352 (1978) is the leading authority for
denying 501(c)(3) status to an organisation providing fee-based services to nonprofit
clients in a manner indistinguishable from a commercial enterprise. The IRS still teaches
this commerciality doctrine.

**The clean structure is a two-entity split:** a 501(c)(3) or fiscally sponsored project
that runs the Miami pilot, holds the grants, claims Ad Grants and Maps credits, and
publishes impact data; plus a for-profit LLC or PBC that owns the code and licenses it.

Fiscal sponsorship has a published price: Community Initiatives charges **10% of gross
receipts, 15% on government funds, with a $50,000 annual fundraising minimum.** Market range
is 5% to 15%.

### 8.5 The grant stack

| Funder | Amount | Timing |
|---|---|---|
| **Florida Blue Foundation** food security | $300K to $400K over 4 years ($75K to $100K/yr) | Deadline was April 22, 2026 |
| **Kroger Zero Hunger Zero Waste** | $25,000 to $250,000 | **Rolling, reviewed quarterly** |
| USDA NIFA Community Food Projects | $25,000 to $400,000, **dollar-for-dollar match** | Due July 16, 2026 |
| Feeding America Network Capacity Grant | $5,000 to $100,000 | |
| Walmart Spark Good Local | $250 to $5,000 | 3 cycles/year |
| **Miami-Dade Innovation Authority** | **$100,000** on an uncapped post-money YC SAFE + a brokered county pilot | **Only during an open challenge** |

**Lilly Endowment granted Feeding America $75 million** on January 13, 2026 over three
years, explicitly including "advancing technology solutions for data-driven
decision-making." That money flows to Feeding America and its member food banks, so **the
play is to be the tool a member food bank buys with capacity dollars, not to apply
directly.**

**MDIA is gated:** it requires a for-profit **Delaware C corp**, a functioning non-idea-stage
product, significant Miami-Dade operational presence, and **an open challenge in a matching
vertical.** Its verticals explicitly include aging and assistive technology (Health) and
logistics and product delivery (Mobility), but **no aging or food-access challenge is
currently open** (the live one is water operations). Practical move: file a
challenge-topic proposal and time an application to the next Health or Mobility round.

**Do not put AARP Foundation, CVS/Aetna Foundation, or The Health Foundation of South
Florida in a funding plan without verifying an open program.** None surfaced with a current
named program, and the last may have merged, rebranded, or wound down.

### 8.6 The distribution channel

**Meals on Wheels America's MORE program** (Member Offers, Rewards and Expertise) connects
~5,000 member providers with vendor partners. **Galley Solutions joined February 25, 2025**,
proving software vendors are admitted.

Membership dues reveal customer budget reality: **Extra Small (<$500K) $250/yr, Small
($500K-$999K) $400/yr, Medium ($1M-$2M) $650/yr, Large ($2M+) $1,200/yr.** The largest
cohort runs on under $2M a year total. **Target sub-$1M programs that cannot justify
ServTracker.**

Caveat: it is unverified whether MOWA's 2018 ServTracker endorsement survived the CaseWorthy
acquisition. If MOWA still steers members to ServTracker, this channel is harder than it
looks.

---

## 9. Miami-Dade: the actual pilot landscape

### 9.1 The single most actionable asset

The **Alliance for Aging Funded Agency Roster (revised May 2026)** is a current
primary-source government PDF listing every OAA-funded provider in PSA 11 with named staff,
direct email addresses, phone extensions, **and a designated eCIRTS contact at each
organisation.**

It converts strategy into a callable list at zero cost. Named contacts it surfaces include:

- **Feeding South Florida:** Paco Velez, President/CEO (x1839); Alyssa Villalba, Director of Partner Services (x1905); **Martha Hidalgo, Senior Programs Manager and eCIRTS Contact, mhidalgo@feedingsouthflorida.org (x1906)**
- **LHANC:** Rafael Iglesias, President (x1222); **Olga Barrios, eCIRTS Specialist (x1240)**
- **Miami-Dade County CSD:** Patrick Saintilus, Social Services Administrator for Meals on Wheels; Evelyn Elliott, Care Planning and eCIRTS
- **JCS:** Raquel Nicado, HDM Program Coordinator; Luz Moll, Transportation Program Manager

### 9.2 The market is fragmented, which is the opportunity

Alliance for Aging In-Service Training (September 17, 2025):

> "65 Congregate meal sites managed by 14 Providers; **15 Home Delivered Meal Providers**;
> 7 Adult Day Care services Providers... 3 Lead Agencies in Miami-Dade, 1 Lead Agency in
> Monroe County; 22 Community Based Service Providers."

**Fifteen separate HDM providers, each running their own routes, own waitlist ("Each
provider maintains their own waitlist"), and own eCIRTS entry.** That is precisely the
condition the `FoodDonationIdea.docx` cross-location surge-dispatch concept was designed
for, and it means a pilot can start with one provider without county-wide buy-in.

### 9.3 Ranked pilot targets

| # | Organisation | Why | Friction |
|---|---|---|---|
| **1** | **Feeding South Florida** | Contracted O3C2 provider **and** a food bank. Exactly matches the original workflow. Only visible volunteer tech is **CERVIS (shift scheduling) plus Microsoft Forms**, neither of which routes, sequences, or confirms. Named eCIRTS contact. | Large org; HQ in Broward, kitchen in Palm Beach, so Miami-Dade seniors are served from outside the county |
| **2** | **Little Havana Activities and Nutrition Centers (LHANC)** | Deepest Miami-Dade-only senior nutrition operator. Runs **hot + frozen + emergency** HDM across six funding codes, which forces service-code-aware routing. 11,000+ individuals annually. | Overwhelmingly Spanish-speaking, making Spanish-first UI mandatory not optional |
| **3** | **Miami-Dade County Community Services Department** | **Its own adopted budget names transportation as the limiter.** Growing deliveries **54% YoY (175,000 to 270,000) on flat 4-position staffing.** | County procurement |
| **4** | **Jewish Community Services of South Florida** | Small enough for a controlled pilot, bounded geography (North Miami-Dade, Miami Beach), and unusually well-staffed for the exact roles a routing app touches. Kosher and tailored-grocery constraints force per-recipient dietary attributes into the data model. | Smaller volume |
| **5** | **Curley's House of Style / Hope Relief Food Bank** | **Deliberately the lowest-friction first pilot: no state OAA contract means no eCIRTS obligation, no county procurement.** ~5,000 clients/month, volunteer-run. Ideal for validating driver UX and the routing engine on real Miami-Dade addresses before touching regulated data. | No reimbursement story, so no revenue proof |

**Explicitly not recommended:** Camillus House, Chapman Partnership, Miami Rescue Mission,
Lotus House. High meal volume but **congregate on-site feeding to a sheltered population,
not home delivery to dispersed recipients.** Poor routing fit despite being the most
visible Miami hunger brands.

### 9.4 The unit economics ceiling, from the county's own budget

Miami-Dade FY2025-26 Adopted Budget: **$1.876M for 270,000 meals = ~$6.95 per delivered
meal**, with **4 positions.**

That sets the ceiling for what any software line item can plausibly cost per meal. It also
prints the procurement narrative in the county's own words: *"In FY 2023-24, a lack of
transportation for potential clients affected enrollment and ultimately impacted the overall
number of participants."*

### 9.5 The integration seam is nameable

Feeding South Florida routes every volunteer signup through
`feedingsouthflorida.cervistech.com` (CERVIS Technologies), including a dedicated **"Senior
Meal Box Distribution"** category described as *"Volunteer to assist in distributing grocery
meal boxes to older adults in Miami-Dade."* The Volunteer Leader Application goes to
Microsoft 365 Forms.

**CERVIS holds the volunteer roster and the shift. Nothing holds the route.** GatheringMIA
can position as the last-mile layer that consumes a CERVIS shift and produces a sequenced,
confirmed delivery manifest. **No incumbent routing vendor has to be displaced.**

### 9.6 Surge and disaster is a credible v2 wedge

Miami-Dade County, Farm Share, Feeding South Florida, and United Way Miami operate as a
**pre-wired emergency food coalition** activated by the county Departments of Emergency
Management and Community Services, with published fixed distribution addresses.

That maps almost exactly onto the `FoodDonationIdea.docx` broadcast-alert concept, and
**MDIA already ran a "Supercharging Emergency Management Across Miami-Dade" challenge in
2025**, so the county has demonstrated appetite to buy technology for this scenario.

### 9.7 The Miami funding ecosystem is unusually deep

| Source | Scale |
|---|---|
| **Tech Equity Miami** (JPMorgan Chase, Knight, Miami Foundation, aire ventures) | **$100 million** consortium |
| **Knight Foundation Miami** | **$57M+** into the tech ecosystem since 2012 |
| **Give Miami Day 2025** | **$43.8 million in one day**, 60,000+ donors, 1,400+ nonprofits |
| MDIA | $9M seed ($3M each from Knight, Miami-Dade County, Ken Griffin/Citadel) |

**GatheringMIA does not have to be a venture-scale business to get funded in Miami.** The
realistic capital path is a philanthropic or civic pilot grant plus MDIA's $100K, with Give
Miami Day as the annual channel a nonprofit partner already uses.

---

## 10. What this research did not establish

The completeness critic's audit, reproduced because it is more useful than another finding.

### 10.1 The three highest-priority unknowns

**1. Does eCIRTS expose any API, bulk import, or documented export format?** Three
dimensions independently identify this as the hardest constraint. If it is screen-entry
only, the "eCIRTS-ready export" value proposition **degrades to a CSV that staff retype**,
which materially weakens the entire pitch. **This is one phone call away** (Martha Hidalgo
at FSF, or Evelyn Elliott at Miami-Dade CSD).

**2. Will Mapbox sign a HIPAA BAA?** The compliance dimension calls the Google Maps HIPAA
prohibition its highest-impact constraint. The routing and React Native dimensions both
recommend Mapbox without mentioning HIPAA once. **The recommended architecture may be
contractually unusable the moment a payer path exists.**

**3. Does Fla. Stat. 430.0402 actually reach a volunteer holding a recipient's name,
address, and phone?** This single statutory reading determines whether every driver over 20
hours per month needs a $75 to $110 fingerprint screening, whether the 20-hour exemption is
usable at all, and **whether the cross-center surge-broadcast model is legal.** It is
explicitly the researcher's plain-text reading, not an agency interpretation.

### 10.2 What was never researched at all

- **Zero primary human research.** Not one interview, email, or call, despite the corpus surfacing direct email addresses for exactly the people who hold the answers.
- **No volunteer-side research whatsoever.** The product is a volunteer driver app and there is **not one data point from a volunteer driver** anywhere in nine dimensions. Missing: who drives food routes in Miami-Dade, device mix, phone age, digital literacy, why they quit, actual stops per run, actual dwell time.
- **No recipient-side research.** Nothing on what homebound seniors experience, whether they want app-mediated delivery, or accessibility needs. The corpus has census-grade LEP statistics and no lived experience.
- **No hands-on product teardown.** Nobody installed Food Rescue Hero, Careit, or ServTracker. **Careit offers a free nonprofit account and is called the closest functional clone, and nobody signed up.** The "incumbent quality is weak" thesis rests entirely on App Store ratings from samples as small as 7 and 8.
- **No vendor mystery-shop.** Every price is list price. ServTracker, Link2Feed, Zippy Meals, Mon Ami, Bringg, NextBillion, Better Impact are all quote-only. **The actual competitive price surface is unknown.**
- **No public-procurement mining.** One government contract found (Allegany County NY, 2021) and a price ceiling built on it. Nobody searched Florida DMS state term contracts, Miami-Dade contract awards, or county commission agendas at scale, which is the richest public source of real negotiated pricing in this sector.
- **Volunteer driver insurance was never priced**, despite being named the single largest uninsured liability in the model.
- **No adversarial dimension.** Nine dimensions of market description and zero of "why this fails." No pre-mortem, no base rates for solo-founder nonprofit ops SaaS, no explicit do-not-build case.
- **The React Native decision was assumed, never evaluated.** No dimension compared it against a PWA, Flutter, or native, despite the user population skewing older and lower-literacy.
- **No brand, trademark, or domain research.** USPTO status of "GatheringMIA" unchecked, store name collisions unchecked, and **`gathering-mia.live` is expired and reclaimable by anyone.**
- **Apple MapKit was never costed**, a real omission for an iOS-first delivery app.

### 10.3 Internal contradictions worth knowing

- **Miami-Dade market size is wrong by ~2x** and the corpus contains its own refutation (see §3.3).
- **Three dimensions render three different verdicts on whether volunteers are the asset or the liability**, and none adjudicates. One says paid gig logistics is "the real structural threat to any volunteer-driver model." One says volunteer supply is "the buyer's most acute, most fundable pain" and the wedge. One notes Mon Ami tried the volunteer layer, raised $8M, and abandoned it. **The volunteer premise is the product's foundation and the research is three-way split on it.**
- **Medicare Advantage is simultaneously the biggest upside and a dead end.** The market-sizing dimension calls it "the only plausible path to a TAM an order of magnitude larger," citing 65% of plans offering meals, from **2025 data**. Three sibling dimensions cite the newer KFF 2026 figure of 57% and falling, and one concludes flatly: **"Do not build the 2026 plan around a health plan paying."**
- **Alliance for Aging's size is stated four different ways** ($42.05M, $60M+, $66.4M, $17.4M) across four dimensions. All are reconcilable by year and scope, but **nobody reconciled them and they will get quoted interchangeably.**
- **Pricing recommendations do not converge** across dimensions ($100-300/mo, $99-299/mo, $3,000-18,000/yr, and a TAM model assuming a $30,000 tier that exceeds every observed comparable).
- **Careit is "the closest functional clone" in one dimension and does not exist in another**, whose central thesis (the only open wedge is the driver-facing layer) is undermined by a competitor already selling exactly that layer.

### 10.4 The critic's own verdict

> **Strongest signal:** the Alliance for Aging Funded Agency Roster. Current primary-source
> government document, collapses the framing war (Feeding South Florida is simultaneously a
> food bank and an OAA meal contractor), establishes the 15-provider fragmentation that the
> surge-dispatch concept requires, and **converts strategy into a callable list with email
> addresses, so it is the only finding in nine dimensions that can be acted on tomorrow
> morning at zero cost.**
>
> **Weakest area:** the TAM/SAM/SOM model, which is simultaneously the least verified
> content in the corpus and the most certain to be quoted verbatim in a PRD.

---

## 11. Ten conclusions for the PRD

1. **The buyer is an OAA-funded home-delivered-meals provider, not a food bank's rescue program.** In Miami-Dade the two are often the same organisation, which is convenient, but the money, the compliance obligations, and the system of record all come from the OAA side.

2. **Never claim to be the system of record.** The stack is eCIRTS (state, mandatory) → ServTracker or equivalent (provider ops and billing) → GatheringMIA (driver layer). **Emit OAAPS-compatible service-unit primitives at the doorstep** so the provider's existing system can consume them. Any pitch that ignores eCIRTS is dismissed in the first meeting.

3. **Price under $10,000/year for the first deployments, deliberately**, to stay inside the federal micro-purchase threshold. Publish the price. Charge per organisation, never per driver.

4. **Do not build the plan around a payer.** Florida has no HRSN waiver, zero food ILOS, federal guidance was rescinded in March 2025, and MA meal benefits are contracting. Treat payer contracting as a 2028 option that becomes real only after a pilot produces data a plan would buy.

5. **Two data tenancies from day one**, non-PHI and PHI, separated at the schema level. The trigger is the contractual relationship, not the content, and a single mixed table pulls everything into HIPAA scope permanently.

6. **Resolve the mapping vendor as a first-order decision, not an implementation detail.** Google Maps ToS forbids HIPAA data. Mapbox is ~10x cheaper but its BAA status is unknown and its React Native navigation bridges have unverified New Architecture support. Self-hosted OSRM + VROOM sidesteps both the licensing and the caching restriction at ~$200 to $350/month all-in.

7. **Fix routing properly, because correct is cheap.** VROOM solves a 100-stop VRPTW in ~360ms at a 1.6% gap. Model it as a genuine CVRPTW with an explicit hot-versus-frozen mode, not one magic capacity number.

8. **Design the volunteer-hours meter and the screening state machine as core features**, not admin chrome. Fla. Stat. 430.0402 makes them the gate on the entire surge-dispatch concept, and eligibility must be a server-side state that can flip mid-cycle.

9. **Spanish-first, Haitian Creole second, WCAG 2.1 AA throughout.** 227,975 Miami-Dade elders have limited English, one of every two limited-English elders in Florida lives there, and the accessibility deadlines are April and May 2027.

10. **Prefer foreground-only location if the product can survive it.** It removes an entire Google Play review gate, a demo video, and a recurring re-justification burden, and iOS geofencing already restarts a terminated app on a region event.

---

## 12. The five calls to make before writing any code

Every one of these is free, takes under an hour, and closes a question the research could
not:

1. **Martha Hidalgo, Feeding South Florida** (mhidalgo@feedingsouthflorida.org, 954-518-1818 x1906). Ask: what does your eCIRTS entry workflow look like today, and does the O3C2 route run on paper?
2. **Alliance for Aging contracts staff** (305-670-6500). Ask: what is the current procurement calendar, and do subrecipient agreements prohibit a subcontracted driver from retaining de-identified operational data?
3. **Florida DOEA or AHCA**, in writing. Ask: does giving a volunteer a client's name, address, and phone constitute "access to personal identification information" under Fla. Stat. 430.0402?
4. **Mapbox sales.** Ask: will you sign a HIPAA BAA covering the Navigation SDK and Optimization API?
5. **Careit.** Sign up for the free nonprofit account and actually use Food Delivery Pro for a week. It is the closest thing to this product that exists, it is free to evaluate, and nobody has looked at it.
