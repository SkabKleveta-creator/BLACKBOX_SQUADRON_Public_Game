# BLACKBOX SQUADRON — Build and Test Report

**Designation:** v0.6.1 — ITCH SANDBOX, with the additional Survival event. Contract prepared October 22, 2026. Local playtest build, not a published release.

**Result:** Survival is implemented and its 9 targeted groups PASS. The 16 original functional/regression groups PASS on this final HTML. The original acceptance matrix is **25 PASS / 1 FAIL (AC-20)** after the harsher boss review; its three prior combat/visual findings remain open. Physical-phone/controller, Safari/Firefox, actual itch.io hosting, subjective audio listening, and full human campaign/balance playthrough are **NOT RUN**.

This execution made **no repository changes and no publication changes**. The historical sandbox branch was neither modified nor cleaned up. The public deployed page's current assets and the user's cached browser state were not independently verified.

## Survival event — October 22, 2026 (America/New_York)

Choose **PLAY EVENT → SURVIVAL · UNTIL DESTROYED**, then LAUNCH SURVIVAL. Operation Dead Signal remains a separate complete campaign selection.

Survival continuously spawns the existing fighter, sweeper and bomber families. It has no bosses, sector boundaries, kill quotas, sector-completion bonuses, field-upgrade offers or victory screen. It ends on destruction; FLY AGAIN starts another Survival sortie. Pause remains available. Leaving for the hangar abandons that attempt. Survival has no checkpoint or resume save.

In-flight pickups are retained because the request excluded end-of-level power-ups. Spread, rapid fire, shield, bomb, repair, score, rail and drone pickups retain their existing behavior. FIRE stays manual and bombs remain separate. The HUD shows elapsed flight time and kills. The campaign route and sector readouts are replaced in Survival; the compact HUD/playfield layout is retained.

Pressure rises gradually with elapsed active flight time, capped after 675 seconds. It changes enemy movement, formation capacity, firing/spawn pressure and pickup weights through the existing mechanics. There are no difficulty-transition overlays or player resets. Scrap/armor hazards begin appearing after 40 seconds using a bounded population of five. The existing three difficulty settings apply. Internal campaign-compatible level storage stays at 1; it is not advanced or presented as a level in Survival.

Personal best and the local top ten remain one shared, validated model for both events and all difficulties. Flight-record rows now identify CAMPAIGN with sector or SURVIVAL with elapsed time. Existing rows default to Campaign. Survival longest completed flight is stored separately from personal-best score. The existing sandbox namespace is retained so previous sandbox records are not discarded. Original-site keys remain read-only migration sources. Added optional row fields are mode and duration; mode validation accepts only campaign/survival. The stored mode preference selects the last event when the hangar reloads.

Survival start, defeat and serialization cannot overwrite or clear an existing campaign checkpoint. Switching back to Campaign and choosing Continue restores that checkpoint. This was tested using a sector-six checkpoint with score 3,500.

### Survival verification

| Targeted group | Result |
|---|---|
| S01: event selector, manual fire, movement, and readable Survival HUD | PASS |
| S02: 45 simulated minutes across three difficulties, no boss or level transitions | PASS |
| S03: quota overflow and direct progression calls cannot trigger a sector/boss/upgrade | PASS |
| S04: normal death, mode-tagged record, retry, best and longest-time persistence | PASS |
| S05: Survival cannot overwrite or clear an existing campaign checkpoint | PASS |
| S06: pickups and bombs remain deliberate and functional without field upgrades | PASS |
| S07: simultaneous touch, independent release, pause and cancel in Survival | PASS |
| S08: five viewport menus, HUD, controls and screenshots | PASS |
| S09: storage-denied Survival plays and records in memory | PASS |

The continuity test ran 900 simulated seconds on each difficulty: **45 simulated minutes total** using the actual 1/120-second game update, spawning, projectile and collision paths. The pilot was made invulnerable for that coverage and logical movement/FIRE inputs were supplied. All three runs stayed in playing, kept level storage at 1, produced zero bosses and zero cleared sectors, and granted zero field upgrades. Fighter, sweeper and bomber families appeared in all three runs. This was accelerated state-assisted coverage, not 45 minutes of human play.

A separate real-time Survival check ran **45.592 actual seconds** in a simulated 390×844 Chromium viewport. Keyboard FIRE and periodic movement were used. **No health, invulnerability, timer, score or progression injection** was used in this run. It ended still playing with score 2,835, hull 1, and 0 natural deaths. Its frame p95 was 16.70 ms; there were no page or console errors. This observation is not a device-performance or balance certification. Natural collision/death/record behavior was separately exercised with a controlled fatal bullet, including retry and a lower-scoring subsequent run.

All five specified layouts were checked in Survival, including its event selection, pause screen, control bounds and absence of campaign sector labels during flight. Actual browser CDP multitouch tested stick + FIRE, independent release and cancellation. Blocked-storage Survival played and recorded in memory with the persistence notice. Score 2,600 and longest Survival time 2:05 survived a lower 200-point run and refresh in the storage-enabled file-URL test context.

### Prior harsh-check findings remain open

The targeted boss suite was rerun against this final HTML: **13 PASS / 3 FAIL**. All 12 full-health boss/difficulty combinations completed; the same three findings reproduced:

1. A continuous 0.6-second beam can consume a shield and then a hull point after the shield's 0.35-second immunity expires. This is inherited behavior; per-activation versus repeated-tick semantics remain unresolved. Survival has no beams or bosses.
2. Visible outer boss artwork extends beyond the preserved circular hitboxes. Survival has no bosses.
3. The player silhouette extends 30 pixels from center, while movement permits centers 14 pixels from the edges, clipping 16 logical pixels of artwork. This remains present in both events.

Adding Survival did not change these mechanics. The earlier all-PASS presentation is qualified by this report's current AC-20 FAIL and explicit findings.

## Compact HUD revision

Implemented Ken's request for a smaller top HUD and larger output screen. Pause/fullscreen controls now share the slim masthead; the extra flight-status row is hidden. The phone score strip is one line (26 px rather than 37 px), and the in-canvas top HUD is 34 logical pixels rather than 48. Mobile boss status remains readable alongside the landscape playfield. Touch movement/FIRE/BOMB target sizes and the original 540×720 simulation coordinates are unchanged.

The final revision was rebuilt and reran all 16 browser test groups, all five layout targets, file/iframe package checks and the real-time run recorded below. It does not rely solely on the previous build's test results. All displayed screenshots were refreshed from this revision.

| Simulated viewport | Previous rendered playfield | Revised rendered playfield |
|---|---:|---:|
| Desktop 1366×768 | 475×634 px | 529×706 px |
| Portrait 390×844 | 368×491.3 px | 380×507.3 px |
| Portrait 375×667 | 276.3×369 px | 316.8×423 px |
| Landscape 844×390 | 219.3×293 px | 251.5×336 px |
| Landscape 667×375 | 208×278 px | 240.3×321 px |

The rendered field retains its 3:4 shape; tall portrait is width-limited. Browser checks confirmed the controls remain outside the field, all essential HUD values remain present, and the document does not overflow any tested viewport. Desktop and mobile phone captures are simulated viewports, not physical devices.

## Source snapshot and evidence boundaries

Repository: https://github.com/SkabKleveta-creator/BLACKBOX_SQUADRON_Public_Game

Default branch read: `main` at **`316efc06a90bd3bd7a8de5d989ef84b2adaffa8f`**.

Tree: `173db1f639cac6d303dcc992c26861d71ae3f633`. Every retrieved file below was pinned to that commit and matched its Git blob SHA byte-for-byte locally. This head includes an existing patch titled “Fix manual fire and persistent pilot score display”; therefore the handoff's historical account is not the present baseline. No historical branch was read as the implementation baseline.

| Source file | Bytes | Git blob SHA-1 |
|---|---:|---|
| `index.html` | 6,304 | `9276b054b824cf48f9c5aadc38b8f1961d6ffbeb` |
| `css/game.css` | 19,053 | `4e378bc02837c99f19000c7ae0ba41919fd48449` |
| `js/game.js` | 54,242 | `5d9622071fa2d8d2dc48bdd38bea9982f8aea31a` |
| `js/campaign.js` | 34,300 | `c8260ea9d8fd01bd8488653d19219155f860a7cf` |
| `js/presentation.js` | 20,127 | `249850be46ffa148cb00fcbd8a1454e7c6531b47` |
| `js/platform.js` | 20,788 | `ead0f39aba61956317339b9f27ac56d76d9cda24` |
| `js/ui.js` | 20,019 | `87754504fd74fec54a460c12f09e524fd62d558a` |
| `sw.js` | 2,807 | `c3f8cb7b142bf71097fd3289b4d026e8aab07d34` |
| `README.md` | 4,526 | `29d71dcc0e2e0f26d8c905d2a4d0d2a8212090d7` |
| `hardening-hotfix-v0.4.1.js` | 5,296 | `7be8eb73ed8060752e246559357824040b77f89e` |

The runtime foundation uses `index.html`, `css/game.css`, `js/game.js`, `js/campaign.js`, `js/presentation.js`, `js/platform.js`, and `js/ui.js`. The original presentation was inspected and replaced with new procedural rendering. `README.md` supplied the retained notice: **“Personal project. All rights reserved.”** `sw.js` was inspected read-only for cache behavior. `hardening-hotfix-v0.4.1.js` was inspected but is not referenced by this snapshot's entry page and was not bundled. The repository tree was also recorded locally. PWA manifest/install icons are not gameplay dependencies; their references were removed. An inline data favicon is used.

No third-party game images, fonts, music files, or remote artwork were introduced. New visuals are native canvas/SVG code; source procedural audio remains embedded. Original attribution/license notice is included in the HTML.

## Findings and fixes

### Scoring

The source had independent legacy high-score storage, a scoreboard cache, and a platform profile. The canvas could display `max(current score, high score)` while the side display/profile remained older; high score was principally saved on death/victory. Its table appended records without a run identity, even though profile totals already attempted victory/endless reconciliation.

The sandbox now has one validated record model. All legitimate `game.score` assignments update personal best through an accessor; `game.highScore`, the profile, HUD, opening compact display and record readouts read the same best. Best is saved when it increases, not each animation frame, with pagehide/hidden flushes. The source kill path briefly applied unscaled base points before campaign difficulty/multiplier correction; that was changed to apply the already-computed final award once, avoiding transient inflated best on Cadet.

Completed results use the campaign's stable UUID run identity. Victory and its endless continuation update the same record. Score ordering is score descending, sector descending, then run ID lexicographically; callsigns are uppercased alphanumeric, at most three characters. Scores are validated finite, nonnegative integers, capped at 999,999,999. Repeated endGame or overlay actions cannot add a second record for the same run. Profile kill/time/win totals apply only positive deltas for that run.

### Firing diagnosis

The pinned baseline already gated `updatePlayer()` on Space, touch FIRE, or gamepad FIRE. Drones were emitted inside `firePlayer()` in this exact source. A local assembled baseline test produced zero idle shots and four shots during a 500 ms Space hold. The user's previously observed auto-fire is therefore **not reproduced or definitively diagnosed** from this snapshot.

Stale UI/README still described automatic fire and directional/drag controls. The original worker uses a cache-first app shell with query strings removed and a fixed `v0.5.0-r2` cache version; an older cached implementation is a plausible explanation, not a verified cause. The public URL could not be retrieved through the public-page lookup tool. No worker or cache on the original origin was changed.

The sandbox adds a held-input check inside `firePlayer()` as well as in its caller. All weapon variants, including support drones, require FIRE. **Interpretation:** drones remain an upgrade, but their attacks count as player offense and share the FIRE gate. No auto-fire setting exists. Source cadence and damage values remain; BOMB is a distinct intentional action. Input state clears on lifecycle/state transitions, and held keyboard/controller actions require release/neutral and fresh input where needed.

### Analog controls and lifecycle

The directional pad and canvas drag scheme are removed. The fixed-center analog stick has a 16% radial deadzone, rescaled proportional speed, capped displacement, capped diagonal magnitude, pointer capture, a visibly moving knob, and exact neutral return. The stick has one pointer owner; FIRE tracks its own pointers. BOMB consumes only its own deliberate action. Pause, overlays, cancellation, lost capture, blur, hidden document, resize/orientation, death, and restart reset logical and visual state.

Keyboard and standard gamepad flight controls remain. Controller flight support does not add controller navigation to every menu; menu navigation remains keyboard/pointer/touch, as in the source.

## Content and visual coverage

Operation Dead Signal retains all twelve sectors, Warden/Bastion/Harrow/Black Crown, wedge/column/wall/pincer formations, fighter/sweeper/bomber roles, four boss attack patterns, phase thresholds, all original difficulty coefficients, eight temporary pickup types, eight field-upgrade options and their limits, sector-entry saves, and victory-to-endless progression. The source progression was not replaced by an endless demo.

| Area | Implemented coverage |
|---|---|
| Interceptor | New split-wing silhouette, layered metallic hull, canopy, dual exhaust, visible central collision cue, damage cracks and shield envelope. Spread pods, rail equipment, rapid accents and support craft remain visually distinct. |
| Enemies | New swept fighters, armored diving bombers and lateral rotor/sweeper craft; different silhouettes and animation cues, muzzle warning rings and armor pips. |
| Bosses | Swept Warden, rectangular Bastion battery, rotating Harrow engine, spiked Black Crown; hull cores, phase damage, health thresholds, warnings and destruction effects. |
| Sectors | Twelve separately authored palette/environment combinations: planet, wreck lane, gate, glass stream, ash, array, ghost channel, iron rain, engine, eclipse, spires and citadel. Pre-rendered backgrounds, layered stars, dim distant infrastructure and restrained parallax. |
| Effects | Directional projectile streaks, high-contrast hostile rounds, impact sparks/debris, finite shock rings, shield feedback, bomb wave and bounded lifetimes. |
| HUD | Separate score/best, sector contact count, hull, bombs, combo, shield and timed equipment. Compact DOM HUD keeps critical information readable in small/landscape layouts, including a larger boss name/phase/health/warning line. |
| Menus | Revised hangar art/layout, callsign and difficulty, pause, settings, field-upgrade cards, flight records, defeat, victory and endless-entry layouts. Settings also gives phone access to records and manual. |
| Touch | Functional analog assembly, separated 88 px FIRE/60 px BOMB in portrait and 78/54 px in landscape; safe-area padding. |
| Audio | Embedded source synth soundtrack and weapon/impact/explosion/pickup/bomb/shield/UI feedback. Added warning/UI cues and master compressor; gesture unlock, mute/volume and pause/resume retained and tested. |

Deliberate delivery differences: single-file bundle; separate storage; no service worker/PWA install flow, no directional pad or drag movement, no automatic offense; new visuals and input safety. The vertical 540×720 logical playfield and source movement bounds are preserved. Short phone portrait menus may scroll. Phone landscape keeps a narrow vertical field, with controls and large critical readouts outside it.

## Storage model and tested behavior

Namespace: **`skab.blackbox.itch.v060.v1.`**

- `records`: version 1 canonical best, top ten, callsign, lifetime counters and per-run accounting.
- `settings`: validated audio, reduced motion, gamepad and difficulty settings.
- `checkpoint`: validated source sector-entry snapshot schema, version 1.
- Temporary `probe` key is created/deleted only in this sandbox namespace to detect write availability.

Accessible legacy keys are read once for migration: `blackbox_squadron_highscore`, `blackbox_squadron_scoreboard_v1`, `blackbox_squadron_profile_v2`, and `blackbox_squadron_pilot`. Valid best values reconcile by maximum. Legacy table/profile rows reconcile by occurrence count so duplicate caches do not duplicate a row. Invalid values/JSON are discarded. No original keys are written. Original checkpoints/settings are not silently imported.

Blocked storage keeps data in memory for the current visit and displays **STORAGE BLOCKED · RECORDS LAST THIS VISIT**. No score-transfer promise exists across origins, browsers or devices.

| Environment | Actual result |
|---|---|
| Clean local HTTP origin | Best survived reload, lower run, full Chromium close/reopen. |
| Extracted local-file URL | Launch passed, storage was available, 200-point best survived reload at that same path in Chromium. This does not certify other browsers' file-origin policies. |
| Local iframe with scripts + same-origin allowed | Game launched with storage available. |
| Local sandbox iframe allowing scripts without same-origin | Game launched, storage was blocked, in-memory 200-point result and truthful notice passed. |
| Actual itch.io embed / iOS file attachment viewer | NOT RUN. No upload or external hosting occurred. |

## Verification method and results

Browser: **headless Chromium 153.0.8010.0 on Linux**, controlled by Playwright. The normal Playwright browser download failed; a local Chromium package supplied the executable. No test/debug controls are added to the player interface. Tests access existing JS state from the browser automation runner.

The three requested passes were completed: functional systems, layout/lifecycle, and final regression/progression. Sixteen automated groups passed on the final HTML after the visual correction. Initial harness failures were corrected: an assertion had checked before the animation frame processed Escape; the CDP release test had supplied the still-held pointer instead of the pointer being released; an iframe fixture lacked the proper local host page. These were test-harness faults, not asserted game passes. A real screenshot-discovered defect, the boss hull covering warning text, was fixed by rendering warning labels after the boss hull.

| Final test group | Status |
|---|---|
| P1: idle, movement-only, keyboard hold/release and pause fresh input | PASS |
| P1: weapon cadence, spread, rapid, rail, drone and no-FIRE guard | PASS |
| P1: real keyboard projectile collision and score awards | PASS |
| P1: legacy reconciliation, sanitization, corrupt storage, no legacy writes | PASS |
| P1: denied storage uses in-memory records and visible notice | PASS |
| P1: top ten deterministic ranking and same-run upsert totals | PASS |
| P2: real browser multitouch stick ownership, analog magnitude, FIRE/BOMB independence | PASS |
| P2: cancel, lost capture, blur, hidden document, resize, overlay, restart and death clear input | PASS |
| P2: emulated standard gamepad movement, fire, pause fresh input, disconnect | PASS |
| P3: all twelve sectors, checkpoints, four bosses, victory/endless same sortie | PASS |
| P3: all field upgrades and difficulty score scaling retained | PASS |
| P2: five layouts, menus, settings and no obstructed gameplay controls | PASS |
| P2: gesture audio, synth activity, volume/mute, pause and resume | PASS |
| P3: reduced motion and bounded particle pools | PASS |
| P3: file URL and embedded execution without external requests | PASS |
| P3: full browser close/reopen preserves best on same clean local origin | PASS |

**Real-input tests:** Playwright keyboard down/up, browser-dispatched CDP multi-touch with native pointer capture, and actual button clicks. **Emulations:** standard Gamepad API with synthetic devices; pointercancel/lostcapture and document visibility/focus/orientation lifecycle injection; simulated phone viewport sizes. No physical phone or physical controller was connected.

**Controlled progression:** quota kills via the source `killEnemy`, boss entry/update routines, controlled health thresholds, projectile/boss collision, source `chooseUpgrade`, serialized checkpoint restore, victory/endless events and endGame. Health/score/progression injections are not a full human or balance test. Random source drops remain active, so route totals below are this run's observations rather than expected fixed totals.

| Sector | Name | Verified clear state | Observed score |
|---:|---|---|---:|
| 01 | OUTER PERIMETER | levelclear | 1,830 |
| 02 | SALVAGE CORRIDOR | levelclear | 4,340 |
| 03 | WARDEN GATE | levelclear | 10,105 |
| 04 | GLASS CURRENT | levelclear | 13,500 |
| 05 | ASH BELT | levelclear | 17,025 |
| 06 | BASTION ARRAY | levelclear | 24,355 |
| 07 | GHOST CHANNEL | levelclear | 28,565 |
| 08 | IRON RAIN | levelclear | 33,455 |
| 09 | HARROW ENGINE | levelclear | 42,900 |
| 10 | MIDNIGHT REACH | levelclear | 48,250 |
| 11 | CROWN APPROACH | levelclear | 54,130 |
| 12 | BLACKBOX CITADEL | victory | 65,715 |

Bosses observed: WARDEN, BASTION, HARROW, BLACK CROWN. Warning patterns observed: fan, aim, beam, ring. After victory, endless started at **sector 13**, retained its run ID, and the later defeat retained **1 table row / 1 sortie / 1 victory**.

### Sustained final runtime

An earlier 181.876-second run also passed before the last compact boss-status text addition. That earlier duration is not presented as testing the final exact HTML. The final exact-file duration is reported below.

Duration: **30.81 real seconds**. Actual keyboard FIRE stayed held; brief keyboard movement occurred periodically. Invulnerability was injected to keep the runtime active, and upgrade option 1 was selected automatically. This is a stability run, not a human playthrough. It reached sector **1**, score **500**, and emitted **193** recorded player projectiles.

Observed population peaks: `{"pb": 8, "eb": 7, "enemies": 5, "particles": 8, "rings": 0, "powerups": 0, "obstacles": 0}`. The source caps hostile bullets at 120, player projectiles at at most 219 (guard before a six-projectile volley), normal enemies at 11; particles at 450 and shock rings at 32. All effects expire. Twelve environment surfaces are the maximum render cache. Existing entity culling and fixed 1/120-second simulation remain; elapsed-frame clamp is 0.1 s with at most 12 simulation steps.

Measured browser animation frames: **1,847**; mean **16.67 ms**, median **16.70 ms**, p95 **16.70 ms**, maximum **16.80 ms**; **0** frames over 33.4 ms. These are hosted headless-renderer measurements, including automation/capture overhead, not phone FPS or device-performance claims.

Final automated suite, capture checks, extracted-package check and sustained run recorded **zero page errors**. The final suite and sustained run recorded **zero console errors**. Gameplay made no external network requests; local tests requested only their HTML documents. Audio checks inspected real Web Audio context state and synth voice creation, not subjective loudness or speaker output.

## Numbered acceptance matrix

PASS means verified within the specific evidence/environment stated. It does not convert the listed physical-device or human checks into passes.

| ID | Status | Evidence / qualification |
|---|---|---|
| AC-01 | PASS | Read-only GitHub default-branch snapshot and ten exact Git blob hashes recorded below. No GitHub mutation, repository checkout/push, branch operation, deployment, or itch.io upload. |
| AC-02 | PASS | Final HTML launched over loopback HTTP, file URL, and after ZIP extraction. Only document requests; no required remote assets, scripts, fonts, audio, or worker. |
| AC-03 | PASS | Twelve named sectors, three enemy families, four boss tiers, formations, eight pickups, eight field-upgrade choices, all three difficulties, sector checkpoints and endless continuation retained. Deliberate differences listed below. |
| AC-04 | PASS | Idle launch and movement-only real keyboard tests: zero player shots. Movement changed player position. |
| AC-05 | PASS | 650 ms actual Space hold produced five shots; release produced no new shots. Controlled 1-second base cadence: seven projectiles. Pause with held Space required release/repress. |
| AC-06 | PASS | CDP multitouch FIRE press/release passed. Synthetic pointercancel, lostpointercapture, blur, hidden-document event and resume cleared input. Physical touch NOT RUN. |
| AC-07 | PASS | Standard gamepad API emulation exercised analog movement, held fire/release, neutral/repress after pause, and disconnect-induced pause/clear. Physical controller NOT RUN. |
| AC-08 | PASS | Base/spread/rapid/rail/drone/combined/reactor cases passed both cadence and no-FIRE guard. Support shots are emitted only inside input-gated firePlayer. Touch BOMB consumed one bomb independently. |
| AC-09 | PASS | Visible directional pad and hold handlers removed; no competing drag-to-move listener. 16% radial deadzone, proportional output, capped knob, exact zero transform after release. |
| AC-10 | PASS | Measured half-stick output 0.4394 and capped diagonal magnitude 1. Second pointer could not steal ownership. Player remained within source bounds x=14..526, y=201.6..655. |
| AC-11 | PASS | Real browser CDP multitouch: releasing FIRE kept stick active; releasing stick kept FIRE active; a bomb tap did not take movement ownership. All releases returned neutral. |
| AC-12 | PASS | Pause/settings overlay/resize/orientation event/blur/hidden/restart/death all cleared logical input and knob; keyboard and gamepad fresh-input behavior passed. Large resume timestep prevented by existing fixed-step clamp/reset. |
| AC-13 | PASS | Actual keyboard projectile hit awarded 100. All eight pickup awards, scrap destruction, controlled boss destruction, and sector bonuses synchronized current high score, profile and displays. Current score remains separate. |
| AC-14 | PASS | 5,200 best survived reload and 200-point later run. Separate persistent Chromium profile closed/reopened the full browser and retained 6,200 after another 200-point run. |
| AC-15 | PASS | Legacy best 2,100 / table 3,400 / profile 5,000 reconciled to 5,000. Duplicate legacy table/profile row merged, a<>b sanitized to AB, invalid scores rejected, corrupt records/settings/checkpoint JSON started safely. Original legacy keys unchanged. |
| AC-16 | PASS | localStorage getter denial and opaque sandbox iframe both played and kept a 200-point in-memory result with visible STORAGE BLOCKED notice. |
| AC-17 | PASS | Fourteen entries trimmed to ten; descending scores and deterministic ties checked. Same-run victory/repeated submission/endless defeat retained one row, one sortie, one win, incremental kill/time totals. |
| AC-18 | PASS | State-assisted route covered all twelve sectors, checkpoint writes at every entry, restore after sector six, all four bosses, all four warning patterns, victory and level 13. Not a human playthrough. |
| AC-19 | PASS | New procedural interceptor/equipment, fighter/sweeper/bomber art, four boss silhouettes, twelve sector treatments, effects, canvas/compact HUD, hangar/debrief/upgrade/settings/records screens and analog controls. Screenshots reviewed. |
| AC-20 | FAIL | Later stress tests confirmed visible outer boss hull outside its hitbox, and player artwork clipping 16 logical pixels at horizontal limits. Player/hostile bullets and warning lanes remain distinct. These findings remain open; boss-specific issues do not occur in Survival because it has no bosses. |
| AC-21 | PASS | 1366×768, 390×844, 375×667, 844×390 and 667×375 simulated layouts passed bounds/no-overlap checks. Stick/fire/bomb all ≥44 px; compact HUD carries critical values on phones. Menus may scroll in short portrait layouts. |
| AC-22 | PASS | No AudioContext before gesture; running synth after launch; oscillator activity for music/shots; mute+zero volume stopped new voices; pause suspended and resume restarted context. Volume/mute settings and compressor present. Subjective listening/physical speaker test NOT RUN. |
| AC-23 | PASS | Reduced-motion explosion count 30→10; 450-particle and 32-ring caps stressed, effects expired. New art suppresses disruptive flicker/pulses; source shake/flash skip remains. Sustained observed peaks: {'pb': 8, 'eb': 7, 'enemies': 5, 'particles': 8, 'rings': 0, 'powerups': 0, 'obstacles': 0}. |
| AC-24 | PASS | Final automated suite: 16/16 groups; no page or console errors. Final real-time sustained run: 30.81 seconds; no page/console errors. Frame timing and limitations below. |
| AC-25 | PASS | ZIP has exactly index.html at root. CRC check, extraction, byte-for-byte SHA-256 equality and extracted-file launch/persistence all passed. |
| AC-26 | PASS | Report distinguishes keyboard input, CDP/synthetic touch, gamepad emulation, injected progression and invulnerability from human/device testing; all remaining unrun tests listed. |

## Screenshots

These are genuine captures of the delivered HTML. No generated concept illustrations were used.

- `DESKTOP_GAMEPLAY_1366x768.png`: actual keyboard-controlled gameplay from the final sustained run; invulnerability enabled by the test runner.
- `MOBILE_PORTRAIT_390x844.png`: simulated phone portrait viewport; source sector-six/Bastion checkpoint and combat state assisted for capture.
- `MOBILE_LANDSCAPE_844x390.png`: simulated phone landscape viewport; source sector-twelve/Black Crown combat state assisted for capture.
- `BOSS_GAMEPLAY_1366x768.png`: desktop Harrow combat; source sector-nine state assisted for capture.
- `SURVIVAL_1366x768.png`: simulated desktop Survival; short setup advance and invulnerability for capture.
- `SURVIVAL_390x844.png`: simulated phone portrait from the real-time Survival check; no gameplay-state injection.

All five layout targets were tested, including 375×667 and 667×375. All twelve background treatments were rendered. Test screenshots are not a claim of physical iPhone testing.

## Remaining limitations / NOT RUN

1. Physical iPhone/iPad/Android, Safari/WebKit and Firefox rendering/input/audio: NOT RUN. Chromium viewport simulation cannot certify those devices.
2. Physical gamepad, disconnect at the hardware level, and controller-specific mappings: NOT RUN; standard mapping API emulation passed.
3. Actual itch.io hosting/embed/storage policy: NOT RUN. No publication authorized or performed. Local normal/opaque iframe checks passed.
4. Full human twelve-sector run, difficulty/balance certification, long-session battery/thermal behavior and subjective audio review: NOT RUN.
5. Historical public auto-fire behavior/current deployed assets/user cache: unresolved. The exact pinned baseline did not idle-fire; stale instructions and cache behavior were identified, without modifying the original site.
6. Local-file persistence varies by browser/path and privacy policy. Best is local; it does not automatically follow the user from GitHub Pages to itch.io or across devices.
7. Very short layouts can require menu scrolling; landscape retains the vertical game field. Gamepad menus are not fully navigable by controller.
8. The three prior boss/player visual findings above remain open; see AC-20. Survival difficulty has not received a human balance playthrough.

Ken's playtest and explicit approval remain required before any later publication. This delivery is the local sandbox and evidence, not a release approval.

## Package integrity

ZIP has exactly **`index.html`** at its root, no extra directory. Archive CRC, extraction, identical bytes and extracted-file browser launch passed. Required code, art, styling and procedural audio are embedded. No CDN, remote font/script/audio, backend, account, install step or service-worker registration is required.

SHA-256 values cover the deliverables below. The report does not hash itself; a companion `SHA256SUMS.txt` includes the report checksum.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 188,965 | `44e751dd63eb69ab4bddd30d2be310b8cd69980f660897dcc1de7037240ded8a` |
| `BLACKBOX_SQUADRON_ITCH_SANDBOX.zip` | 53,692 | `2368435500679bd2213337614d21d064c546059690e4cac0120d05489252640f` |
| `DESKTOP_GAMEPLAY_1366x768.png` | 502,952 | `4a6d408b637041297737e39582d55d563881d8eae201bde653d3c23e55284a28` |
| `MOBILE_PORTRAIT_390x844.png` | 186,658 | `b633023b4160d55858af9298bc1a1b71df6973b50811124392ab4b150950f6cf` |
| `MOBILE_LANDSCAPE_844x390.png` | 198,316 | `a5a3b859734e30b4c407ecc15ff3f59d52a3a56745170a06040e37ea42ca2c48` |
| `BOSS_GAMEPLAY_1366x768.png` | 545,165 | `ca7b195e1ede0e6c6e4e2aff02d6c27b66b14199396c3d93a72c6701d382bc44` |
| `SURVIVAL_1366x768.png` | 496,064 | `d4174cd1831a36ab102466a2bded3aab9edf8985eb1cc62a45773cd7071870f0` |
| `SURVIVAL_390x844.png` | 172,126 | `81393cec012475a30b83b8ca8a4c1ea01c0c7c3b3f0f930f8e94921de8492907` |
