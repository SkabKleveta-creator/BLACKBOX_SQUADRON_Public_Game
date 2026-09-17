# v0.5.0 — Operation Dead Signal

## Playable expansion

The original vertical arcade shooter now has a complete campaign loop: launch, twelve named sectors, four command encounters, field refits, victory, and endless continuation. Sector-entry checkpoints retain difficulty, upgrade ranks, hull, ordnance, active weapon timers, score, run identity, and statistics.

The X-01, enemy silhouettes, projectiles, pickups, environments, and cockpit have a unified native Canvas presentation. Settings include independent music/effects, volume, auto-fire, reduced motion, and gamepad support. Local flight records preserve existing scores.

## Confirmed defects repaired

- Final-kill / lethal-hit races no longer advance a dead pilot.
- Pickups cannot repair or score after the run ends.
- Swept projectile tests catch shots crossing between simulation steps.
- Piercing shots strike each target once, including bosses.
- Bombs award actual kills and progress; empty space generates no points.
- Boss phase changes do not silently change already telegraphed beam lanes.
- Level-clear rewards and upgrade selection are idempotent.
- Combat pauses on lost focus, page backgrounding, and controller disconnect.
- Restart clears input, timers, effects, and equipment state.
- Malformed storage is rejected or bounded; unavailable storage falls back to memory.
- Service-worker caches are scoped to this game and installation.
- Missing installation icons, duplicate audio patches, and remote CDN dependencies are removed from the live path.

## Technical changes

The iframe/script-injection wrapper is replaced by one direct document and purpose-specific scripts. Simulation uses a fixed 120 Hz step, capped catch-up, bounded particle/projectile pools, cached environment drawing, and one effect/audio integration. Offline installation caches the complete release atomically. Archived builds remain available as historical references.

## Scope

This is a substantially expanded browser game release, not a claim of finished commercial certification. Physical iPhone/iPad, Android, and controller testing, extended difficulty tuning, and long-session performance review remain release-quality work. Multiplayer, a server-verified leaderboard, cloud saves, full gamepad menu navigation, localization, and remappable keys are not implemented.
