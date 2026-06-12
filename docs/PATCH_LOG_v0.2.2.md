# BLACKBOX SQUADRON v0.2.2 Patch Log

## Purpose

Focused stabilization patch after v0.2.1. This release fixes start/restart flow, makes Rail and Shield behavior match their intended gameplay roles, and cleans up level-clear transitions.

## Changes

### Start / Pause / Game Over Flow
- Space now starts from the start screen.
- Space resumes from pause.
- Space restarts from game over.
- Space still fires only during gameplay.
- Space never triggers bomb.
- Enter / START continues to start, pause, resume, and restart from game over.

### Bomb Safety
- Touch BOMB and C only trigger bombs during gameplay.
- Bomb use remains guarded by game state and available bomb count.

### Rail Shot
- Rail bullets now carry explicit gameplay properties.
- Rail bullets deal 2 damage.
- Rail bullets pierce enemies.
- Rail bullets draw with a distinct cyan beam style.

### Drone Shot
- Drone side shots remain distinct and use purple bullet rendering.

### Shield Behavior
- Added shield absorption helper.
- Shield now absorbs enemy bullets, enemy ship collision, and obstacle collision.
- Shield consumption creates a cyan burst and light shake.

### Level Flow
- Level clear no longer increments the level before showing the clear screen.
- Added completeLevel() and beginNextLevel().
- Level clear shows the level just completed.
- Next level begins only after the clear timer expires.
- Enemy bullets, player bullets, enemies, and powerups are cleared on level clear.
- Obstacles are cleared when the next level begins.

### HUD
- Added compact active power-up display:
  - SPR
  - RAP
  - RAIL
  - DRN
  - SHLD

### Versioning
- Updated title, header, and start screen to v0.2.2.

## Manual Test Checklist

- Open index.html locally or through GitHub Pages.
- Press Space from the start screen. Game should start.
- Press Space during gameplay. Player should fire, not bomb.
- Press C during gameplay. Bomb should trigger.
- Press Enter during gameplay. Game should pause.
- Press Space while paused. Game should resume.
- Die and reach Game Over. Press Space or START. New run should fully reset.
- Confirm Repair pickup restores life up to max.
- Confirm Bomb pickup restores bomb count up to max.
- Confirm Shield absorbs bullets, enemies, and obstacles once.
- Confirm Rail hits harder and pierces.
- Confirm Drone adds side shots.
- Clear Level 1. Screen should show Level 1 Clear, then start Level 2.
