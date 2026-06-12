# BLACKBOX SQUADRON — Release Notes v0.2.3

## Release

**v0.2.3 — Progression + Arcade Scoreboard Update**

## Public Build

https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/

## Summary

v0.2.3 turns BLACKBOX SQUADRON into a stronger arcade run.

This release adds real progression, better level pacing, hull upgrade rewards, visible power-up timers, level identity cards, final-push pressure, and local score tracking.

The core loop is now:

```text
Start → Survive → Clear Level → Upgrade Hull → Score → Try Again
```

## What Changed

### Progression

- Kill requirements now increase by level.
- Levels 1–6 increase by 3 kills each level.
- After Level 6, requirements increase by 5 kills per level.
- Kill requirements cap at 75.

### Hull Rewards

- Player starts with 3 max hull.
- Every 5 cleared levels increases max hull by 1.
- Hull restores to the new max when upgraded.
- Max hull caps at 10.

### HUD Improvements

- Active power-up timers now display in the HUD.
- Shield status displays while active.
- Kill progress displays as current/required.

### Level Identity

- Level intro banners show level, difficulty band, modifier, and objective.
- Level clear screen now supports hull upgrade messaging.

### Pacing

- Final 25% of a level increases enemy spawn pressure slightly.
- Longer levels should feel more intense without becoming unfair.

### Score Tracking

- Local arcade-style high-score tracking added or prepared.
- Public score tracking should be handled manually through `SCOREBOARD.md`.
- No automatic GitHub write path is used.

## Not Added

This release intentionally does not add:

- Bosses
- Mini-bosses
- Campaign map
- Shop system
- New weapons
- New engine
- External assets
- Backend leaderboard
- Online accounts

## Recommended Test

Before calling this release stable:

- Confirm Level 1 requires 10 kills.
- Confirm Level 2 requires 13 kills.
- Confirm Level 5 triggers hull upgrade after completion.
- Confirm power-up timers display.
- Confirm local high score persists after refresh.
- Confirm desktop and mobile controls still work.
- Confirm bombs do not trigger from Fire.
- Confirm GitHub Pages build loads correctly.

## Next Recommended Patch

**v0.2.4 — Enemy Formations**

Recommended focus:

- V formations
- Wall formations
- Sweep formations
- Carrier-style groups
- More interesting enemy arrivals using existing enemy types

Do not add bosses yet.
