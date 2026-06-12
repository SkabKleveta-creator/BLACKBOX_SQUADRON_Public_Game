# BLACKBOX SQUADRON

**BLACKBOX SQUADRON** is a browser-based retro arcade vertical shooter built with HTML5 Canvas, vanilla JavaScript, and no external game engine.

Fly a prototype interceptor through escalating combat zones, destroy enemy waves, collect power-ups, survive longer objectives, earn hull upgrades, and chase the high score.

## Play Online

https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/

## Current Version

**v0.2.3 — Progression + Arcade Scoreboard Update**

This version adds the first true arcade run structure:

* Increasing kill requirements by level
* Hull upgrades every 5 cleared levels
* Power-up timers in the HUD
* Level intro cards
* Level clear reward messaging
* Final-push pacing near the end of each level
* Local arcade-style high-score tracking
* Optional score submission path for public tracking

## Game Summary

BLACKBOX SQUADRON is designed around fast arcade loops:

```text
Start → Survive → Clear Level → Upgrade Hull → Score → Try Again
```

The goal is not to simulate a full campaign yet. The current build focuses on readable combat, escalating pressure, quick restarts, and classic arcade score-chasing.

## Features

* Single-file HTML game
* HTML5 Canvas rendering
* No external libraries
* No external assets
* Desktop keyboard controls
* Mobile touch controls
* Dynamic level director
* Difficulty bands
* Level modifiers
* Enemy waves
* Destructible obstacles
* Power-up pickups
* Shield system
* Bomb system
* Hull upgrade rewards
* Local high-score memory
* Arcade-style scoring loop

## Difficulty Progression

Levels now require more kills as the run continues.

| Level | Kills Required |
| ----: | -------------: |
|     1 |             10 |
|     2 |             13 |
|     3 |             16 |
|     4 |             19 |
|     5 |             22 |
|     6 |             25 |
|    7+ |   +5 per level |
|   Cap |             75 |

After Level 6, the objective increases by 5 kills per level until the cap of 75.

## Hull Upgrade System

The player starts with 3 hull.

Every 5 cleared levels, max hull increases by 1 and health is restored to the new maximum.

| Cleared Level |           Max Hull |
| ------------: | -----------------: |
|         Start |                  3 |
|       Level 5 |                  4 |
|      Level 10 |                  5 |
|      Level 15 |                  6 |
|     Level 20+ | Continues up to 10 |

Maximum hull is capped at 10.

## Power-Ups

| Pickup | Effect                 |
| ------ | ---------------------- |
| S      | Spread Shot            |
| R      | Rapid Fire             |
| H      | Shield                 |
| B      | Bomb Refill            |
| L      | Repair / Hull Recovery |
| $      | Bonus Score            |
| P      | Rail Cannon            |
| D      | Drone Support          |

Timed power-ups now display active timers in the HUD.

Example:

```text
SPR 7  RAP 4  RAIL 5  DRN 8  SHLD
```

## Difficulty Bands

The game uses named difficulty bands to make level progression feel like escalation rather than repetition.

| Levels | Band          |
| -----: | ------------- |
|    1–2 | Training Fire |
|    3–4 | Live Contact  |
|    5–6 | Hot Zone      |
|    7–8 | Kill Box      |
|   9–10 | Black Sky     |
|    11+ | Endless War   |

## Level Modifiers

Each level uses a rotating modifier to vary combat pressure.

Current modifier set:

* Standard Patrol
* Swarm Bloom
* Ace Squadron
* Scrap Storm
* Bullet Weather
* Overclock
* Carrier Lane
* Recovery Run

## Controls

### Desktop

| Input             | Action                 |
| ----------------- | ---------------------- |
| Arrow Keys / WASD | Move                   |
| Space             | Fire                   |
| C                 | Bomb                   |
| Enter             | Start / Pause / Resume |
| R                 | Restart                |

### Mobile

| Button | Action                 |
| ------ | ---------------------- |
| D-Pad  | Move                   |
| FIRE   | Fire                   |
| BOMB   | Bomb                   |
| START  | Start / Pause / Resume |
| RST    | Restart                |

## High Score Tracking

BLACKBOX SQUADRON includes local arcade-style score tracking.

Scores are saved in the player’s browser using local storage.

Current scoreboard behavior:

* Saves local high scores
* Supports arcade-style replay
* Keeps score-chasing lightweight
* Does not require accounts
* Does not use a backend
* Does not write directly to GitHub

A future public scoreboard may be managed through GitHub using manual score submissions and a verified `SCOREBOARD.md`.

## Technology

* HTML5
* CSS
* JavaScript
* Canvas API
* Browser localStorage
* GitHub Pages

No engine.
No build step.
No install.
Open the page and play.

## Development Philosophy

BLACKBOX SQUADRON is being built through fast, controlled iterations.

The current design priorities are:

1. Keep the game playable.
2. Preserve simple arcade controls.
3. Make combat readable.
4. Increase difficulty through pacing, not clutter.
5. Add rewards that make survival matter.
6. Avoid feature creep.
7. Keep the project deployable through GitHub Pages.

## Current Patch Focus

v0.2.3 focuses on making the game feel like a real arcade run.

This patch does **not** add:

* Bosses
* Campaign mode
* Save files
* Shops
* New engines
* External assets
* Online accounts
* Online leaderboard backend

Those are intentionally deferred.

## Planned Next Iteration

The recommended next patch is:

**v0.2.4 — Enemy Formations**

Potential focus:

* V formations
* Wall formations
* Sweep formations
* Better enemy arrival patterns
* More visual variety using existing enemy types

The next step should improve enemy presentation before adding bosses or larger systems.

## Project Status

BLACKBOX SQUADRON is currently a playable public prototype.

It is still rough, still improving, and still being built through live iteration.

Public build:

https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/

## License

Personal project. All rights reserved.
