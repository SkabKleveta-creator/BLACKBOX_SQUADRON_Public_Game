# BLACKBOX SQUADRON v0.2 Patch Prompt

Update the provided BLACKBOX SQUADRON v0.1.4 single-file HTML game to v0.2.

Goal:
Add a real power-up system and a procedural Level Director / Randomizer.

Important:
Do not rewrite the whole game. Preserve the existing single-file structure, keyboard controls, touch controls, obstacle system, enemy types, HUD, high score, and core gameplay. Patch the current working build.

Current issue to fix:
The current game only drops Spread Shot. `maybeDropPowerup()` only creates `{ type: "spread" }`, and collision handling always applies `player.spreadTimer = 10`. Replace this with a real weighted power-up system.

## Required Part 1 — Expanded Power-Up System

Add these power-up types:

1. `spread`
- Label: S
- Color: green
- Effect: temporary spread shot for 10 seconds

2. `rapid`
- Label: R
- Color: cyan
- Effect: temporary faster fire rate for 8 seconds

3. `shield`
- Label: O
- Color: blue/cyan
- Effect: gives player one shield charge that absorbs one hit

4. `bomb`
- Label: B
- Color: red/amber
- Effect: adds 1 bomb up to max 3

5. `repair`
- Label: +
- Color: white/green
- Effect: restores 1 life up to max 3

6. `score`
- Label: $
- Color: amber
- Effect: adds bonus score

7. `rail`
- Label: L
- Color: purple or bright white
- Effect: temporary rail shot for 8 seconds; rail bullets pierce enemies if reasonably simple to implement

8. `drone`
- Label: D
- Color: cyan/green
- Effect: temporary drone wing for 10 seconds; side drones fire alongside the player if reasonably simple to implement

Implementation rules:
- Add player state fields for `rapidTimer`, `railTimer`, `droneTimer`, and `shield`.
- Do not break `spreadTimer`.
- Make power-up effects visible in the HUD.
- Update `drawPowerups()` so each pickup type has distinct label and color.
- Update collision handling so each pickup type applies its own effect.
- Add a helper function like `applyPowerup(type)`.
- Add a helper function like `choosePowerupDrop()`.

Weighted drop rules:
- The drop system should be weighted, not purely random.
- Spread and score should be common.
- Bomb and repair should be less common.
- Repair should be more likely if `player.lives < 3`.
- Bomb should be more likely if `player.bombs < 2`.
- Shield should be more likely if `player.lives <= 1`.
- Rail and drone should become more common after level 3.
- Do not flood the screen with pickups.

## Required Part 2 — Level Director / Randomizer

Add a procedural level director that creates a `levelPlan` each level.

Add to game state:
- `seed`
- `runSeed`
- `levelPlan`
- `currentModifier`
- `difficultyBand`

Seed:
- Generate a simple run seed at `startGame()`.
- Show seed on game over and HUD if space allows.
- It does not need perfect deterministic replay yet, but prepare the structure.

Difficulty bands:
- Levels 1–2: Training Fire
- Levels 3–4: Live Contact
- Levels 5–6: Hot Zone
- Levels 7–8: Kill Box
- Levels 9–10: Black Sky
- Levels 11+: Endless War

Modifiers:
Add at least these level modifiers:

1. Standard Patrol — balanced level
2. Swarm Bloom — more fighters, lower enemy HP pressure
3. Ace Squadron — fewer enemies, faster/tougher mix
4. Scrap Storm — more obstacles
5. Bullet Weather — more enemy shots but slightly slower bullets
6. Overclock — faster player fire and faster enemies
7. Carrier Lane — more sweepers and bombers
8. Recovery Run — slightly higher defensive pickup chance

Level Director behavior:
- `beginLevel(n)` should create a new level plan.
- `spawnEnemy()` should use `levelPlan.enemyMix` instead of only fixed level logic.
- `spawnInterval()` should use `levelPlan.spawnInterval`.
- `maxEnemies()` should use `levelPlan.maxEnemies`.
- `obstacleSpawnInterval()` and `updateObstacleSpawning()` should respect `levelPlan.obstacleMode` or `levelPlan.obstacleRate`.
- `maybeDropPowerup()` should use `levelPlan.dropBias`.

Fairness rules:
- Level 1 should stay simple.
- Do not enable harsh modifiers on level 1.
- Do not make obstacle spam too heavy.
- Do not create unavoidable bullet patterns.
- Keep readable bullets.
- Every level should feel different, but still fair.
- Difficulty should increase through controlled budgets, not chaos.

## Required Part 3 — HUD Updates

HUD should show, as space allows:
- Score
- High score
- Level
- Difficulty band
- Current modifier
- Lives
- Bombs
- Active weapon effects: SPREAD, RAPID, RAIL, DRONE, SHIELD

If HUD space is tight, abbreviate:
- TRN, LIVE, HOT, KILL, BLACK, ENDLESS
- STD, SWARM, ACE, SCRAP, BULLET, OVER, CARRIER, RECOVERY

## Required Part 4 — Player Weapon Effects

Rapid:
- Temporarily reduce `player.fireRate`.
- When timer expires, return to normal fire rate.

Rail:
- Rail bullets should be visually distinct.
- If easy, rail bullets pierce enemies.
- If piercing is too risky, make rail bullets deal 2 damage and look distinct.

Drone:
- Add side shots while active.
- Keep it simple: when the player fires, add two extra bullets from left and right offsets.

Shield:
- If `player.shield > 0` and player would be hit, consume shield instead of losing a life.
- Add a small shield burst effect.
- Show shield in HUD.

Repair:
- Increase lives by 1 up to max 3.
- If already at max lives, convert to score bonus.

Bomb:
- Increase bombs by 1 up to max 3.
- If already at max bombs, convert to score bonus.

## Required Part 5 — Versioning and Screens

- Update title/version to BLACKBOX SQUADRON — v0.2
- Start screen should mention randomized levels and expanded pickups.
- Game over should show:
  - final score
  - high score
  - level reached
  - seed
  - “START / RST to fly again”

## Do Not Add Yet

- Do not add full boss system yet.
- Do not add a visual level editor.
- Do not split into multiple files.
- Do not use Phaser or external libraries.
- Do not add external assets.
- Do not change the game into a different genre.

## Acceptance Criteria

- No console errors.
- Keyboard controls still work.
- Touch controls still work.
- Existing enemies still spawn and behave.
- Obstacles still work.
- Player can collect multiple pickup types.
- Repair pickups can restore life.
- Bomb pickups can restore bomb stock.
- Shield can absorb a hit.
- Random level modifiers appear and affect gameplay.
- Different levels feel different.
- Level 1 remains fair and simple.
- Game remains playable on mobile.
