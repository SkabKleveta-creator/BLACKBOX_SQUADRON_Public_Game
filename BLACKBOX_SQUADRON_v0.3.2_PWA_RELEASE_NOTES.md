# BLACKBOX SQUADRON v0.3.2 — PWA / Add-to-Home-Screen Pass

## Source of Truth
- `index.html` is the GitHub Pages entry file.
- `blackbox-squadron-v0.3.2-pwa.html` is the named version archive.

## Built From
- v0.3.1.1 Audio Mobile Fix

## Preserved
- v0.2.5 enemy formation build-ups
- v0.2.5 boss gates at Level 5, then every 3 levels after
- v0.3.0 modern arcade presentation pass
- v0.3.1 procedural audio arsenal
- v0.3.1.1 mobile audio unlock fix

## Added in v0.3.2
- PWA manifest: `manifest.webmanifest`
- Service worker: `sw.js`
- Offline-ready app shell cache
- App icons: 192px, 512px, maskable 512px, Apple touch icon
- Add-to-Home-Screen / install prompt layer
- iPhone-specific in-game instruction fallback: Share → Add to Home Screen
- Service worker update banner: update cached / refresh
- `PWA OFFLINE READY` HUD confirmation during early gameplay
- PWA metadata: theme color, description, mobile web app tags, Apple web app tags

## GitHub Pages Deployment
Copy all package contents to the public game repo root:

```text
index.html
manifest.webmanifest
sw.js
icons/
```

The browser should load `index.html`. The service worker and manifest are relative-path safe for GitHub Pages subdirectory hosting.

## Manual Verification Checklist
- Open `index.html` from HTTPS/GitHub Pages.
- Start game and verify audio still unlocks after tap.
- Verify browser install/Add-to-Home-Screen prompt behavior.
- On iPhone, use Share → Add to Home Screen.
- Open from Home Screen and confirm fullscreen/stable portrait play.
- Load once online, then test reload after network loss where supported.
- After future updates, verify update banner appears or hard refresh clears old cache.

## Notes
- No App Store dependency.
- No paid platform account required.
- No external libraries or assets added.
- PWA files are static and compatible with GitHub Pages.
