# BLACKBOX SQUADRON project status

**Current build: v0.5.0 — Operation Dead Signal**

Playable campaign release with twelve sectors, four boss encounters, three difficulty settings, permanent field upgrades, checkpoint continuation, victory, and endless deployment. Native Canvas renderer and Web Audio; no runtime libraries or external assets.

The public entrypoint is `index.html`; production modules live under `js/`. The historical `blackbox-squadron-v0.2.3.html` and `hardening-hotfix-v0.4.1.js` are retained but are not used by the new release.

## Verified by regression tests

Combat death/progression races, projectile traversal and piercing, shield invulnerability, full reset, input release, fixed-step timing, save validation and migration, boss gates and beam warnings, upgrade idempotence, complete campaign traversal, endless continuation, and scoped offline cache installation.

## Remaining development work

- Physical iOS/Android multitouch, install/update/offline, and audio validation.
- Physical gamepad verification and full controller navigation of menus.
- Longer playtesting across all difficulties; performance profiling on older phones.
- Input remapping and additional accessibility options.
- More authored missions, enemy behaviors, and encounter variety.
- A separate backend if public verified leaderboards or cross-device saves are desired.

See the current release notes and test checklist for scope and evidence.
