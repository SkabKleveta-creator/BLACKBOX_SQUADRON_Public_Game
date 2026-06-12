# BLACKBOX SQUADRON — Next Claude Prompt v0.2.4

## Patch Target

Patch BLACKBOX SQUADRON from v0.2.3 to v0.2.4.

## Patch Name

**v0.2.4 — Enemy Formations**

## Goal

Make enemy arrivals feel more intentional, arcade-like, and visually interesting without adding bosses, new weapons, new enemy families, or external assets.

The current game already has progression, hull upgrades, power-up timers, level intro cards, final-push pacing, and local score tracking.

Do not redesign the game.

This patch should improve how enemies enter the screen.

## Important Scope Control

Do not add:

- Bosses
- Mini-bosses
- New weapons
- New power-ups
- New enemy families
- Campaign map
- Shop system
- Online leaderboard
- External libraries
- External assets
- Multiple files

Use existing enemy types first.

## Current Enemy Types

Use the current enemy types already in the game:

- fighter
- sweeper
- bomber

## Required Feature 1: Formation Spawning

Add a simple formation spawning system.

Recommended formations:

1. V Formation
2. Wall Formation
3. Diagonal Sweep
4. Staggered Pair
5. Bomber Escort Group

These should reuse existing enemy types.

## Required Feature 2: Formation Rules

Formations should not appear constantly.

Suggested behavior:

- Level 1: mostly single enemies
- Level 2: occasional pairs
- Level 3–4: introduce simple formations
- Level 5+: formations become more common
- Final push: slightly higher chance of formation spawn

Keep it fair.

## Required Feature 3: Formation Helper

Add a helper function such as:

```js
function spawnFormation(type) {
  // creates multiple enemies with offset positions/timing
}
```

or:

```js
function maybeSpawnFormation() {
  // decides whether to spawn a formation or a single enemy
}
```

Do not break existing `spawnEnemy()` behavior. Reuse it or wrap it.

## Required Feature 4: Controlled Screen Pressure

Formation spawning must respect `maxEnemies()`.

Do not spawn a formation if it would exceed the enemy cap.

Example:

```js
if (enemies.length + formationSize > maxEnemies()) {
  spawnEnemy();
  return;
}
```

## Required Feature 5: Readability

Formations should be readable.

Do not stack enemies directly on top of each other.

Use spacing:

- Horizontal spacing: 36–60 pixels
- Vertical spacing: 22–42 pixels
- Avoid spawning directly on player location

## Required Feature 6: Modifier Integration

Tie formations lightly to existing level modifiers.

Examples:

- Swarm Bloom: more fighter groups
- Ace Squadron: tighter mixed formations
- Carrier Lane: bomber escort groups
- Overclock: faster sweep formations
- Standard Patrol: simple pairs
- Scrap Storm: fewer formations if obstacles are heavy

Keep this simple.

## Required Feature 7: Versioning

Update version references to:

```text
v0.2.4
```

Update:

- HTML title
- header comment
- visible version labels

## Acceptance Criteria

The patch passes if:

- Game opens with no console errors.
- Existing controls still work.
- Existing power-ups still work.
- Kill scaling still works.
- Hull upgrades still work.
- Score tracking still works.
- Level progression still works.
- Single enemies still spawn.
- Formations spawn after early levels.
- Formations respect max enemy cap.
- Formations are visually readable.
- Formations do not instantly overwhelm the player.
- Mobile remains playable.
- No bosses are added.
- No new weapons are added.
- No external files are added.

## Required Output

After patching, provide:

1. Summary of changes.
2. Functions changed.
3. New helper functions added.
4. Manual test checklist.
5. Full corrected HTML file.

Reminder:

The goal is not to make BLACKBOX SQUADRON bigger.

The goal is to make the existing enemies arrive with more arcade style.
