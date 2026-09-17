# v0.5.0 validation

## Automated

Run `npm test` with Node 20+. The suite verifies core combat regressions, campaign progression, checkpoint roundtrips, platform lifecycle, data sanitation, and service-worker cache isolation.

Campaign simulation exercised all twelve sectors with real firing/collision updates and upgrade selection. Invulnerability was used only in this simulation to isolate progression; this does not establish human difficulty balance.

## Browser acceptance

- Launch from the primary button and keyboard; callsign entry must not control the ship.
- Move, fire, bomb, pause, resume, and exit to hangar.
- Start a fresh sortie; continue a sector-entry checkpoint after reload.
- Open settings during flight; timers must remain frozen while paused.
- Verify volume, mute, auto-fire, and reduced motion.
- Clear a sector, choose an upgrade once, and continue safely.
- Verify desktop, phone portrait, and phone landscape layout without obscured controls.
- Verify browser console has no game runtime errors.
- Install a complete app shell, reload offline, and retain scores/settings.

## Physical-device follow-up

A browser width check is not a substitute for physical mobile testing. On iOS and Android, verify simultaneous direction/fire/bomb touches, pointer cancel on an incoming interruption, orientation changes, home-screen installation, service-worker updates, and audio unlock. Test a standard controller directly. Check safe areas and low-end device performance during the final boss.
