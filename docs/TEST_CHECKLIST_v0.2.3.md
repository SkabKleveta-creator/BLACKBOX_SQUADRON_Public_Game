# BLACKBOX SQUADRON — v0.2.3 Test Checklist

Use this checklist before publishing or tagging v0.2.3.

## Public Build

https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/

---

## 1. Launch Test

- [ ] Game loads from GitHub Pages.
- [ ] Canvas appears.
- [ ] Start screen appears.
- [ ] Version shows v0.2.3.
- [ ] No visible browser error.
- [ ] No console error.

## 2. Desktop Controls

- [ ] Arrow keys move.
- [ ] WASD moves.
- [ ] Space fires during gameplay.
- [ ] Space starts/resumes/restarts outside gameplay, if supported.
- [ ] C uses bomb.
- [ ] Enter starts the game.
- [ ] Enter pauses/resumes.
- [ ] R restarts.
- [ ] Space does not trigger bomb.

## 3. Mobile Controls

- [ ] D-pad moves.
- [ ] FIRE fires.
- [ ] BOMB uses bomb.
- [ ] START starts game.
- [ ] START pauses/resumes.
- [ ] RST restarts.
- [ ] FIRE does not trigger bomb.
- [ ] BOMB does not fire.
- [ ] Buttons fit on screen.
- [ ] Game canvas remains visible above controls.

## 4. Kill Scaling

- [ ] Level 1 objective is 10 kills.
- [ ] Level 2 objective is 13 kills.
- [ ] Level 3 objective is 16 kills.
- [ ] Level 4 objective is 19 kills.
- [ ] Level 5 objective is 22 kills.
- [ ] Level 6 objective is 25 kills.
- [ ] Level 7 objective is 30 kills.
- [ ] Kill requirement increases after Level 6 by 5.
- [ ] Kill requirement never exceeds 75.

## 5. Level Intro

- [ ] Intro banner appears at start of Level 1.
- [ ] Intro banner appears at start of later levels.
- [ ] Banner shows level number.
- [ ] Banner shows difficulty band.
- [ ] Banner shows modifier.
- [ ] Banner shows objective kill count.
- [ ] Banner disappears cleanly.

## 6. Level Clear

- [ ] Level clear screen appears after objective complete.
- [ ] Level clear screen shows cleared level.
- [ ] Level clear screen shows score.
- [ ] Next level begins correctly.
- [ ] Kills reset for next level.
- [ ] Enemies/bullets clear between levels.

## 7. Hull Upgrade

- [ ] Player starts with 3 max hull.
- [ ] Clearing Level 5 increases max hull to 4.
- [ ] Hull restores to 4 after upgrade.
- [ ] Level clear shows HULL UPGRADE +1.
- [ ] Clearing Level 10 increases max hull to 5.
- [ ] Max hull never exceeds 10.
- [ ] Reward does not duplicate for same milestone.

## 8. Power-Up Timers

- [ ] Spread timer displays while active.
- [ ] Rapid timer displays while active.
- [ ] Rail timer displays while active.
- [ ] Drone timer displays while active.
- [ ] Shield status displays while active.
- [ ] Timers disappear after expiring.
- [ ] HUD remains readable.

## 9. Power-Up Behavior

- [ ] Spread fires side shots.
- [ ] Rapid increases fire rate.
- [ ] Rail fires piercing shot.
- [ ] Drone fires side support shots.
- [ ] Shield absorbs at least one hit.
- [ ] Bomb pickup increases bombs up to max.
- [ ] Repair pickup restores hull up to max.
- [ ] Score pickup adds score.

## 10. Enemy / Obstacle Behavior

- [ ] Fighters spawn correctly.
- [ ] Sweepers spawn correctly.
- [ ] Bombers spawn correctly.
- [ ] Obstacles spawn after early levels.
- [ ] Destructible obstacles can be destroyed.
- [ ] Armor obstacles cannot be destroyed.
- [ ] Enemy contact damages or triggers shield.
- [ ] Obstacle contact damages or triggers shield.

## 11. Final Push

- [ ] Last 25% of level feels more intense.
- [ ] Spawn pressure increases slightly.
- [ ] Bullet spam does not become unfair.
- [ ] Level still feels playable.

## 12. Bomb Behavior

- [ ] Bomb clears enemy bullets.
- [ ] Bomb clears enemies.
- [ ] Bomb destroys destructible obstacles.
- [ ] Bomb does not destroy armor obstacles.
- [ ] Bomb decreases bomb count by 1.
- [ ] Bomb cannot be used when count is 0.

## 13. Score Tracking

- [ ] High score saves locally.
- [ ] Score survives refresh.
- [ ] Scoreboard/name entry works, if included.
- [ ] Scores sort highest first, if scoreboard included.
- [ ] No network write is attempted.
- [ ] No GitHub token appears in source.

## 14. Game Over / Restart

- [ ] Player loses hull when hit.
- [ ] Game Over appears at 0 hull.
- [ ] Final score displays.
- [ ] High score displays.
- [ ] Restart works from Game Over.
- [ ] New run resets level, kills, hull, bombs, and timers.

## 15. Release Decision

Mark v0.2.3 stable only if:

- [ ] Desktop test passes.
- [ ] Mobile test passes.
- [ ] Level 5 hull upgrade verified.
- [ ] High score behavior verified.
- [ ] No console errors.
- [ ] GitHub Pages link works.
