# BLACKBOX SQUADRON — PATCH LOG v0.2.3

## Release Name

**v0.2.3 — Progression + Arcade Scoreboard Update**

## Public Build

https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/

## Release Summary

v0.2.3 is the first BLACKBOX SQUADRON build that moves beyond basic playability and establishes a real arcade run loop.

This patch focuses on progression, pacing, survival rewards, power-up clarity, level identity, and local score tracking.

The goal of this release is simple:

```text
Start → Survive → Clear Level → Upgrade Hull → Score → Try Again
```

This patch does not add bosses, campaign systems, shops, new engines, external files, or online leaderboard infrastructure.

---

## Major Changes

### 1. Kill Requirement Scaling

Level objectives now increase as the run continues.

Previous behavior felt too flat because levels could feel like the same objective repeated.

New progression:

| Level | Kills Required |
|---:|---:|
| 1 | 10 |
| 2 | 13 |
| 3 | 16 |
| 4 | 19 |
| 5 | 22 |
| 6 | 25 |
| 7+ | +5 per level |
| Cap | 75 |

After Level 6, kill requirements increase by 5 per level until reaching the cap of 75.

### 2. Hull Upgrade Rewards

The player now earns a max hull increase every 5 cleared levels.

Rules:

- Player starts with 3 max hull.
- Clearing Level 5 increases max hull to 4.
- Clearing Level 10 increases max hull to 5.
- Rewards continue every 5 levels.
- Max hull caps at 10.
- When a hull upgrade is earned, health restores to the new maximum.

Example:

```text
LEVEL 5 CLEAR
HULL UPGRADE +1
MAX HULL: 4
NEXT WAVE INBOUND
```

### 3. Power-Up Timers

Timed power-ups now show compact HUD timers while active.

Displayed timers include:

- Spread Shot
- Rapid Fire
- Rail Cannon
- Drone Support
- Shield status

Example HUD display:

```text
SPR 7  RAP 4  RAIL 5  DRN 8  SHLD
```

### 4. Level Intro Banner

Each level now opens with a short intro banner showing:

- Level number
- Difficulty band
- Active modifier
- Objective kill count

Example:

```text
LEVEL 4 — LIVE CONTACT
MODIFIER: SCRAP STORM
OBJECTIVE: DESTROY 19
```

This makes progression more readable and gives each level stronger identity.

### 5. Improved Level Clear Messaging

Level clear screens now communicate more than completion.

They can show:

- Cleared level
- Current score
- Hull upgrade reward, when earned
- Next wave notice

### 6. Final Push Pacing

When the player reaches the final 25% of a level objective, enemy spawn pressure increases slightly.

This keeps longer levels from dragging while avoiding unfair bullet walls.

The intended feeling is:

```text
The level is almost clear, but the enemy is pushing back.
```

### 7. Recovery Support

Power-up drops now account for longer levels and player condition.

Recovery bias now supports:

- More repair chance when below max hull
- More bomb chance when bombs are low or empty
- More shield chance when the player is near death
- Slightly more bomb and shield support at higher levels

Overall drop chance scales by level range:

| Level Range | Drop Chance |
|---:|---:|
| 1–3 | 12% |
| 4–7 | 14% |
| 8+ | 16% |

### 8. Local Arcade Scoreboard

The build now supports a local arcade-style score tracking concept.

The intended structure:

- Save scores locally in the player's browser
- Track name or initials
- Track score
- Track level reached
- Keep top scores locally
- Preserve arcade score-chasing without requiring accounts or a backend

This is not a global leaderboard.

### 9. Optional GitHub Score Submission Path

A public/community scoreboard should not write directly from the browser to GitHub.

The safe path is:

1. Player earns a score.
2. Player submits score manually through GitHub Issues or a similar reviewable path.
3. Repo owner verifies and records public scores in `SCOREBOARD.md`.

No GitHub API token should be embedded in browser JavaScript.

---

## Controls Preserved

### Desktop

| Input | Action |
|---|---|
| Arrow Keys / WASD | Move |
| Space | Fire |
| C | Bomb |
| Enter | Start / Pause / Resume |
| R | Restart |

### Mobile

| Button | Action |
|---|---|
| D-Pad | Move |
| FIRE | Fire |
| BOMB | Bomb |
| START | Start / Pause / Resume |
| RST | Restart |

---

## Technical Notes

The project remains:

- Single-file HTML
- Vanilla JavaScript
- HTML5 Canvas
- CSS only
- No external libraries
- No external assets
- GitHub Pages compatible
- Browser localStorage compatible

---

## Key Functions / Areas Updated

Likely changed or added areas include:

- `getKillsNeeded(level)`
- `getLevelPlan(level)`
- `maxEnemies()`
- `isFinalPush()`
- `spawnInterval()`
- `getDropChance()`
- `choosePowerupType()`
- `completeLevel()`
- `beginNextLevel()`
- `drawHUD()`
- `getActivePowerupText()`
- `drawLevelIntro()`
- `drawLevelClear()`
- local score tracking helpers, if implemented
- scoreboard display / name-entry logic, if implemented

---

## Acceptance Checklist

Use this checklist before tagging the release.

### Basic Launch

- [ ] Game opens with no console errors.
- [ ] GitHub Pages loads the game.
- [ ] Start screen appears.
- [ ] Game starts from keyboard.
- [ ] Game starts from mobile START button.

### Kill Progression

- [ ] Level 1 requires 10 kills.
- [ ] Level 2 requires 13 kills.
- [ ] Level 3 requires 16 kills.
- [ ] Level 6 requires 25 kills.
- [ ] Level 7 requires 30 kills.
- [ ] Kill requirement never exceeds 75.

### Hull Upgrades

- [ ] Player starts with 3 max hull.
- [ ] Clearing Level 5 increases max hull to 4.
- [ ] Clearing Level 10 increases max hull to 5.
- [ ] Hull restores to new max when upgraded.
- [ ] Max hull never exceeds 10.
- [ ] Hull upgrade message appears on level clear.

### HUD / Readability

- [ ] Kills display as current/required.
- [ ] Power-up timers display while active.
- [ ] Shield status displays while active.
- [ ] HUD remains readable on desktop.
- [ ] HUD remains readable on mobile.

### Level Flow

- [ ] Level intro banner appears.
- [ ] Banner shows level number.
- [ ] Banner shows difficulty band.
- [ ] Banner shows modifier.
- [ ] Banner shows objective kill count.
- [ ] Level clear screen appears.
- [ ] Next level begins correctly.

### Gameplay

- [ ] Space fires only during gameplay.
- [ ] Space starts/resumes/restarts outside gameplay, if supported.
- [ ] C triggers bomb.
- [ ] Touch FIRE only fires.
- [ ] Touch BOMB only bombs.
- [ ] Rail still pierces.
- [ ] Drone still fires side shots.
- [ ] Shield still absorbs hits.
- [ ] Obstacles still behave correctly.
- [ ] Bomb clears bullets/enemies as expected.
- [ ] Final 25% of a level feels more intense but fair.

### Score Tracking

- [ ] High score saves locally.
- [ ] Local score data survives refresh.
- [ ] Scoreboard, if present, sorts highest score first.
- [ ] Name or initials, if present, are saved correctly.
- [ ] No network write is attempted from the browser.
- [ ] No GitHub token exists in the source code.

---

## Deferred Features

These are intentionally not part of v0.2.3:

- Bosses
- Mini-bosses
- New enemy families
- New weapons
- Campaign map
- Save-game system
- Shop or upgrade menu
- Online accounts
- Online leaderboard backend
- External assets
- External JavaScript libraries
- Music
- Sound effects

---

## Recommended Next Patch

**v0.2.4 — Enemy Formations**

Recommended scope:

- V formations
- Wall formations
- Sweep formations
- Carrier-style enemy groups
- Better enemy arrival patterns
- More visual variety using existing enemy types

The next patch should make enemies arrive with more style before adding bosses.

---

## Release Position

v0.2.3 should be treated as the current stable public arcade prototype.

It establishes the first complete BLACKBOX SQUADRON arcade loop:

```text
Start → Survive → Escalate → Upgrade → Score → Retry
```

This is the checkpoint build before moving into enemy formation design.
