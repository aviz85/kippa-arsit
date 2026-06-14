# כיפה ארסית — PUZZLE FLOW (QA reference & winnable-path checklist)

Derived from `docs/GAME_SPEC.md` + `js/story.js` (flag source of truth) + `CONTRACT.md`.
This is the testable solution path. Each step lists: **scene → action → result (flag/item) → gate it opens**.
QA: walk this top-to-bottom. If any step can't be completed with what you're holding, the chain is broken.

## Canonical flag/item names (USE THESE EXACT STRINGS)

Flag string values live in `js/story.js → GAME.STORY.flags`. The JS *key* differs from the stored *string* for two:

| GAME.STORY.flags key | actual flag string | meaning |
|---|---|---|
| hasMission | `hasMission` | mom gave the quest |
| gotBasket | `gotBasket` | basket taken |
| wolfFriend | `wolfFriend` | wolf befriended |
| gaveSeeds | `gaveSeeds` | seeds given to wolf |
| bridgeFixed | `bridgeFixed` | plank placed on bridge |
| knowsGranny | `grannyTruth` | learned granny is a psychopath |
| hasKnifeProof | `knifeProof` | evidence obtained |
| grannyBeaten | `grannyBeaten` | finale won |

Reference flags via `F.knowsGranny` / `GAME.STORY.flags.knowsGranny` (= `'grannyTruth'`), NOT the raw string in code, so they stay consistent. **Win/gate checks must compare the resolved string.**

Items (ids): `basket`, `cookie`, `seeds`, `plank`, `key`, `evidence`.

## The numbered solution path (the only fully-winnable order)

1. **room_red** → TAKE the basket (`basket_spot`).
   → gains item `basket`, sets flag `gotBasket`. score +5.
   → opens: nothing yet (exit to living_room is ungated), but `gotBasket` is required by step 3's gate.

2. **room_red** → exit door → **living_room**. (ungated)

3. **living_room** → TALK to **mom**.
   → sets flag `hasMission` (+ seeds doubt about granny). score +5.
   → opens: the `out → hood` exit gate, which requires `gotBasket && hasMission`.
   - DEAD-END GUARD: if you reach living_room without `basket`, you can still talk to mom and get `hasMission`, but the hood exit stays blocked until you go BACK to room_red and grab the basket. QA: confirm `back → room_red` exit exists so the player isn't trapped.

4. **living_room** → exit out → **hood**. (gated: `gotBasket && hasMission`)

5. **hood** → TALK to **neighbor** (kiosk).
   → gains item `seeds`. score +5.
   → opens: nothing gated, but `seeds` is required at step 11.

6. **hood** → exit fwd → **forest_edge**. (ungated)

7. **forest_edge** → USE `basket` on **woodcutter** (per Items note: using the basket sneaks out a `cookie` and counts as giving the cookie).
   → gains item `plank` (and `cookie` is auto-given for inventory display). score +5.
   → opens: nothing gated, but `plank` is required at step 13.
   - The woodcutter must accept BOTH `use basket` and `use cookie` on him (Items note, lines 129-132). QA: verify either verb path yields the plank exactly once (no double-give).

8. **forest_edge** → exit fwd → **deep_forest**. (ungated)

9. **deep_forest** → TALK to the **wolf** (first meeting).
   → no flag required; wolf explains he's vegetarian/hungry for seeds, points to his garden.
   → opens: both `garden → wolf_garden` and `fwd → river` are open (no hard gate per brief).

10. **deep_forest** → exit garden (up) → **wolf_garden**.

11. **wolf_garden** → USE `seeds` on **wolf** (or on the soil).
    → sets flags `wolfFriend` AND `gaveSeeds`. score +10.
    → wolf then confides the twist and gives item `evidence` (his hit-list note).
    → gains item `evidence`, sets flags `grannyTruth` (knowsGranny) AND `knifeProof` (hasKnifeProof). score +10.
    → opens: the WIN PATH in finale (`wolfFriend && has('evidence')`) and the `granny_int → finale` gate (requires `grannyTruth`).

12. **wolf_garden** → exit back → **deep_forest** → exit fwd → **river**.

13. **river** → USE `plank` on the broken bridge.
    → sets flag `bridgeFixed`. score +10.
    → opens: the `fwd → granny_ext` exit gate (requires `bridgeFixed`).
    - DEATH GUARD: trying to swim/cross the water without the bridge → `GAME.die(...)`. QA: confirm death, then Restore returns the player to a playable state with `plank` still in inventory.

14. **river** → exit fwd → **granny_ext**. (gated: `bridgeFixed`)

15. **granny_ext** → TAKE/look the **gnome**.
    → gains item `key`. score +5.

16. **granny_ext** → USE `key` on the **door**.
    → sets the door-open flag (brief suggests `grannyDoorOpen`). 
    → opens: the `in → granny_int` exit gate.

17. **granny_ext** → exit in → **granny_int**. (gated: door-open flag)

18. **granny_int** → TALK to **granny** (the inverted "what big eyes" escalation).
    → a `GAME.choice` appears.
    → opens: the `fwd → finale` exit (brief: require `grannyTruth`, already set at step 11).

19. **granny_int** → choose "להאשים אותה עכשיו" (accuse now) WITH `evidence`, OR exit fwd → **finale**.
    → because `grannyTruth` is set and `evidence` held, proceed armed to finale.
    - DEATH GUARD: choosing "accuse now" WITHOUT `evidence` → granny attacks → `GAME.die(...)`. (In the canonical path you already hold evidence from step 11, so this is safe.)

20. **finale** → scripted showdown.
    → WIN check: `wolfFriend === true && GAME.has('evidence')` → both satisfied →
      sets flag `grannyBeaten`, score +20, `GAME.win('...100/100')`.

**Total score on the canonical path: 5+5+5+5+10+10+10+5 = 55 from puzzles + 20 win + small look bonuses (e.g. mirror +2) ≈ 77+ before the +20 win.** The win text claims 100/100 — see Issue #7.

## Win condition (single check, must match exactly)

`finale` wins iff `GAME.flag('wolfFriend') === true && GAME.has('evidence')`.
- Accuse/face granny without `evidence` → `GAME.die`.
- Face granny without `wolfFriend` → `GAME.die`.

## Death scenes to verify (Sierra charm, must be recoverable)
- river crossing without `bridgeFixed`
- eating forest mushrooms (deep_forest)
- grabbing the woodcutter's axe (forest_edge)
- accusing granny unarmed / without evidence (granny_int)
- jumping out the bedroom window (granny_int / finale)

Each must use `GAME.die('...')` and leave inventory/flags intact on Restore so the path is still completable.

---

## DEAD-ENDS, MISSING LINKS & RISKS FLAGGED (fix before QA sign-off)

1. **Items not registered.** `js/items.js` currently registers ONLY `basket`. The path REQUIRES
   `cookie`, `seeds`, `plank`, `key`, `evidence` to exist for inventory display and `GAME.has()` checks.
   → The items.js agent MUST register all six. If `seeds`/`plank`/`key`/`evidence` are only `GAME.give()`'d
   without being registered, `GAME.has()` may work but the inventory icon `GAME.itemDef(id).draw` will throw.
   **Blocking.**

2. **Flag string vs key mismatch.** `knowsGranny` stores `'grannyTruth'`; `hasKnifeProof` stores `'knifeProof'`.
   GAME_SPEC prose uses both names loosely. Any scene that hardcodes `GAME.setFlag('knowsGranny', true)`
   instead of `GAME.setFlag(F.knowsGranny, true)` (= `'grannyTruth'`) will set the WRONG flag and the
   `granny_int → finale` gate (which should test `grannyTruth`) will never open. **Blocking — enforce `F.*` usage.**

3. **`gaveCookie` flag.** GAME_SPEC Flags line (25-28) mentions `gaveCookie`, but it is NOT in
   `GAME.STORY.flags`. scene04 should rely on `GAME.has('plank')` (the result) rather than a `gaveCookie`
   flag that doesn't exist, OR the flag must be added to story.js. Decide one. (Non-blocking if scene04
   gates on item possession, but flag-based logic would silently no-op.)

4. **Door-open flag name unconfirmed.** Brief suggests `grannyDoorOpen` (scene08, line 95) but it is NOT in
   `GAME.STORY.flags`. scene08 (USE key → set flag) and scene08 exit gate (read flag) must use the SAME
   literal. Recommend adding `grannyDoorOpen` to story.js OR keeping it scene-local but identical on both
   sides. **Risk of soft-lock if the two literals diverge.**

5. **`evidence` double-source.** Step 11 sets `wolfFriend`, `gaveSeeds`, `grannyTruth`, `knifeProof` AND
   gives `evidence` all in one interaction. Ensure idempotency: re-using seeds on the wolf must not
   re-give `evidence` or re-add score (score is idempotent per reason, but `GAME.give` may duplicate).
   Guard with `if(!GAME.has('evidence'))`.

6. **deep_forest both exits open early.** Per brief, no hard gate on garden/river. A player can reach
   `river` and fix the bridge BEFORE meeting the wolf, then reach `granny_ext`/`granny_int` and walk into
   `finale` WITHOUT `wolfFriend`/`evidence` → guaranteed `GAME.die`. This is *intended* Sierra cruelty, but
   QA should confirm it's a death (recoverable), NOT a soft-lock or crash.

7. **Score math vs "100/100".** Summed canonical puzzle+win scores ≈ 75-80, but the win text says
   "100/100". Either add more scored beats (look/talk bonuses across scenes) to reach 100, or change the
   win copy. Cosmetic, non-blocking, but note for polish.

8. **`gotBasket` requirement before mom.** The hood gate needs `gotBasket && hasMission`. If a player
   talks to mom (gets `hasMission`) but never took the basket, they must be able to return to room_red.
   Confirm `living_room` has a `back → room_red` exit (brief says it does). **No soft-lock if back exit exists.**

9. **Woodcutter accepts basket OR cookie.** Per Items note, both `use basket` and `use cookie` must yield
   the plank. If only one is wired, a player who somehow has `cookie` but not `basket` (or vice-versa)
   could stall. Low risk on canonical path; verify both branches and single-give guard.

## Connectivity check (every scene reachable & exitable)
room_red ⇄ living_room ⇄ hood ⇄ forest_edge ⇄ deep_forest ⇄ {wolf_garden (⇄), river} ; river → granny_ext ⇄ granny_int → finale.
- Every scene has a `back` exit except `finale` (terminal) and the one-way `river → granny_ext` is fine
  because granny_ext has `back → river`. No island scenes. **OK.**
