# Door-fact taxonomy v0

**Status: v0, invented from research, not observed from the field.**

This label is not modesty. The PRD specifies that this taxonomy comes from a Phase 1
annotation census: ride three real routes, photograph every manifest annotation, sticky
note, laminated card, and driver WhatsApp thread, then tally the candidate fact types. That
census is out of scope for the demo effort. **Every type below is a hypothesis until a real
route contradicts it**, and ticket #35 is the first contact with reality.

Treat the free-text escape hatch as the most important entry in the table, because it is the
mechanism by which the field teaches the schema rather than the schema constraining the
field.

---

## The two layers

The split is enforced at the schema, not by convention, because it is what makes the door
layer licensable and the person layer disposable.

| | **Door layer** | **Person layer** |
|---|---|---|
| Keyed to | `address_key` (property + unit) | `client_id` |
| Contains | Facts about the **built environment** | Facts about the **person** |
| PHI? | **No** | **Yes** |
| Storage | Pooled, shared schema | Per-agency schema, row-level security |
| On contract exit | Retained | **Destroyed** |
| Licensable to other couriers | **Yes** | Never |

**They never share a table.** A fact about a building survives the client who lives there
moving away, dying, or switching providers. A fact about a person does not.

The demo populates only the door layer, because there are no real people in it.

---

## Door layer types (v0)

| Type | Half-life | Example | Rationale |
|---|---|---|---|
| `gate_code` | 120 d | "Gate code 4412, keypad is on the left post" | Codes rotate, but not often |
| `callbox_sequence` | 90 d | "Callbox: dial 214 then press CALL, not #" | Panels get replaced and reprogrammed |
| `which_door` | 365 d | "Use the pedestrian gate, not the vehicle gate" | Stable, but landscaping and renovations change access |
| `entrance_not_obvious` | 365 d | "Front door faces SW 9th St, not the numbered street" | Corner lots. Nearly permanent |
| `unit_numbering` | 365 d | "File says 3B. It is 3-B on the SECOND floor; building skips 13" | The single highest-value type, see below |
| `steps_count` | 3650 d | "Four concrete steps, no rail" | Structural. Effectively permanent |
| `ramp_present` | 3650 d | "Side ramp at the west entrance" | Structural |
| `elevator_present` | 730 d | "Elevator on the north side of the lobby" | Structural, but service changes |
| `elevator_freight_only` | 730 d | "Elevator B is freight only, use A" | Building policy, changes with management |
| `parking_constraint` | 180 d | "No stopping on the main road, use the side street" | Signage and enforcement change |
| `dog_on_property` | 180 d | "Dog in the side yard, stays behind the fence" | Animals come and go |
| `mailbox_blocks_access` | 365 d | "Mailbox bank blocks the ramp on trash day (Tue)" | Recurring, schedule-dependent |
| **`other_freetext`** | 90 d | anything | **The escape hatch. Feeds taxonomy expansion.** |

Twelve typed plus one escape hatch. Deliberately at the low end of the 10 to 12 the PRD
proposed, because a taxonomy invented without field data should be small enough that the
census can expand it rather than large enough that it has to be pruned.

### `unit_numbering` deserves special note

It is the only door-layer type that routinely **contradicts the agency's own system of
record**, which makes it the source of the "your file is wrong" reconciliation stream
(PRD FR-3.8). Agencies are monitored on client-record accuracy, so a verified stream of
corrections is directly valuable and arrives free as exhaust from arrival confirmation.

It is also the switching cost: leave, and the client file starts drifting again immediately.

---

## Person layer types (specified, not built)

Not populated in the demo. Specified so the boundary is unambiguous and so nobody
accidentally files one of these into the door layer:

`hearing_impaired_ring_twice`, `mobility_allow_extra_time`, `caregiver_schedule`,
`refuses_if_left_unattended`, `preferred_greeting_language`, `do_not_leave_with_neighbour`.

Every one of these is PHI the moment a provider or payer supplies it.

---

## Decay

**Step decay at expiry**, not exponential, for the display threshold.

Confidence is computed as `0.5 ** (age_days / half_life_days)` for ranking, but the driver
sees a binary: a fact is either **current** or **needs reconfirming** at the 0.60 threshold.
Simpler to reason about, simpler to explain to a coordinator, and a driver holding a box does
not need a probability.

**Event-driven invalidation overrides age.** A failed delivery, a reported move, or a
contradicting observation drops confidence immediately regardless of how recently the fact
was confirmed. Age is the fallback signal, not the primary one.

---

## The arrival interaction

**At most three facts, lowest confidence first, target under 5 seconds median to clear.**

Lowest-confidence-first rather than most-consequential-first, for a specific reason: consequence
is a judgement the system cannot make reliably, whereas staleness is arithmetic. A gate code
that has not been confirmed in 200 days is worth asking about; a ramp that has been there for
a decade is not.

The seeded demo data produces exactly this: 3 of 13 facts arrive below threshold.

---

## Not in v0

**Negative facts** (`moved`, `in_hospital`, `deceased`, `refuses`, `unsafe_after_dark`) are
deferred past the demo, despite being valuable, for two reasons:

1. They are **person-layer**, not door-layer, so they carry PHI and the demo has no people.
2. Their whole value is the automatic re-test after a half-life, which cannot be demonstrated
   in a single session and needs a real roster to be meaningful.

They remain in the PRD as FR-3.6.
