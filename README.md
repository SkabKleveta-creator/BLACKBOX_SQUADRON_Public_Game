# BLACKBOX SQUADRON

A native Canvas arcade shooter. Pilot the X-01 through **Operation Dead Signal**: twelve combat sectors, four command ships, field upgrades, and an endless frontier.

**Current release: v0.5.0 — Operation Dead Signal**

[Play BLACKBOX SQUADRON](https://skabkleveta-creator.github.io/BLACKBOX_SQUADRON_Public_Game/)

## What is playable

- Twelve authored sectors with wedge, column, wall, and pincer formations.
- Warden, Bastion, Harrow, and Black Crown bosses, including aimed salvos, phase changes, and warning lanes before beam attacks.
- A choice of three equipment or recovery upgrades after every cleared sector.
- Cadet, Standard, and Ace difficulty; combo scoring and clean-sector bonuses.
- Victory debrief and endless deployment beyond sector twelve.
- Eight temporary pickups and visible interceptor equipment.
- Sector-entry checkpoints, local flight records, persistent settings, and legacy score migration.
- Keyboard, relative pointer dragging, multitouch directional pad, and standard gamepad input.
- Procedural music and sound effects; volume, auto-fire, and reduced-motion controls.
- Offline app shell and installable PWA with complete icons.

## Controls

| Action | Keyboard | Touch / pointer | Standard gamepad |
| --- | --- | --- | --- |
| Move | WASD / arrows | Drag within the playfield or hold directional pad | Left stick / D-pad |
| Fire | Space | FIRE (auto-fire is on by default) | A / right trigger |
| Smart bomb | C | BOMB | B / right shoulder |
| Precision movement | Shift | — | Analog stick magnitude |
| Pause / resume | Escape / P / Enter | PAUSE / Resume | Start |
| Field upgrade | 1 / 2 / 3 | Tap one upgrade | Use touch / pointer or keyboard |

Launch and utility menus are keyboard accessible. Gamepad support covers flight controls; the full interface is not controller navigable yet.

## Run structure

Clear the escort quota. On sectors 3, 6, 9, and 12, defeat the command ship as well. Each clear replenishes one bomb and offers a permanent ship upgrade or recovery package. Hull, reactor, engine, shield-capacitor, and ordnance ranks last for the current sortie. Timed weapon pickups remain temporary.

Cadet reduces threat and scores at 0.8×; Standard scores at 1×; Ace raises threat and scores at 1.2×. Kill chains build a multiplier. Empty bombs give no free score. Bosses take limited bomb damage.

## Saves and scores

A checkpoint is written at **sector entry**, after the previous upgrade is applied. Continue restarts that sector using its starting equipment, score, and statistics. Current-sector combat progress is not preserved. Death ends the sortie and removes its checkpoint. Finishing the campaign records victory; choosing endless continues that flight.

Progress stays in the current browser. There are no accounts, cloud saves, or online leaderboard. The local score table intentionally includes previous versions and all difficulties. If storage is unavailable, play and settings still work for the current visit.

## Offline / installation

Visit the online game once and let its files load completely. Supported browsers cache the complete release for offline play. On iPhone, use **Share → Add to Home Screen**. After a release update, reload from the hangar to use the newly cached build. The service worker never clears another game's caches.

## Development

No build step or runtime dependencies. Serve the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Use Node 20 or newer to run the regression suite:

```sh
npm test
```

| File | Responsibility |
| --- | --- |
| `index.html`, `css/game.css` | Accessible menus and responsive cockpit |
| `js/game.js` | Fixed-step simulation, collision, pickups, native input |
| `js/campaign.js` | Sectors, formations, bosses, upgrades, save schema |
| `js/presentation.js` | Native Canvas art, effects, environments, HUD |
| `js/platform.js` | Audio, storage, gamepad, lifecycle, offline registration |
| `js/ui.js` | Menus, debriefs, settings, pointer controls |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline installation |
| `tests/` | Engine, campaign, persistence, and cache regression tests |

The historical single-file build and older patches remain in the repository for reference. They are not loaded by the current release.

See [release notes](docs/RELEASE_NOTES_v0.5.0.md), [test checklist](docs/TEST_CHECKLIST_v0.5.0.md), and [project status](docs/PROJECT_STATUS.md).

## License

Personal project. All rights reserved.
