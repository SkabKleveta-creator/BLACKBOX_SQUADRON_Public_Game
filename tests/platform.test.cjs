'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const platform = require('../js/platform.js');
function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.has(key) ? data.get(key) : null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key), data };
}
function fakeWindow(storage) {
  const handlers = {};
  return { document: { hidden: false, addEventListener: (type, fn) => { handlers['document:' + type] = fn; } }, localStorage: storage, navigator: {}, location: { protocol: 'file:' }, CustomEvent: class { constructor(type, value) { this.type = type; this.detail = value.detail; } }, addEventListener: (type, fn) => { handlers[type] = fn; }, dispatchEvent: () => {}, matchMedia: () => ({ matches: false }), requestAnimationFrame: () => 1, setInterval: () => 1, clearInterval: () => {}, handlers };
}
function checkpoint() {
  return { version: 1, level: 4, score: 6000, difficulty: 'standard', endless: false, player: { lives: 3, maxLives: 4, bombs: 2, maxBombs: 3, shieldHp: 1, speed: 280, baseFireRate: 0.14 }, upgrades: { engine: 1 }, stats: { kills: 22, playTime: 154.4 } };
}
test('settings reject malformed types and clamp safe numeric controls', () => {
  const value = platform.validateSettings({ volume: Infinity, difficulty: '__proto__', music: 'false', gamepad: false, autoFire: false, extra: 123 });
  assert.equal(value.volume, 0.45); assert.equal(value.difficulty, 'standard'); assert.equal(value.music, true); assert.equal(value.gamepad, false); assert.equal(value.autoFire, false); assert.equal(value.extra, undefined);
  assert.equal(platform.validateSettings({ volume: -2 }).volume, 0);
  assert.equal(platform.validateSettings({ volume: 9, difficulty: 'cadet' }).volume, 1);
});
test('legacy score migration drops invalid records and sanitizes local pilot names', () => {
  const scores = platform.validateScores([{ score: NaN }, { score: -1 }, { score: 1e11 }, { score: 10.9, name: '<A>!!', level: Infinity }, { score: 20, name: 'BETA', level: 3 }]);
  assert.deepEqual(scores, [{ name: 'BET', score: 20, level: 3 }, { name: 'A', score: 10, level: 1 }]);
});
test('quota and denied storage retain current settings in memory instead of reviving stale data', () => {
  const storage = memoryStorage({ item: '{"volume":0.2}' });
  const store = platform.createStore(storage);
  assert.equal(store.read('item').volume, 0.2);
  storage.setItem = () => { throw new Error('quota'); };
  assert.equal(store.write('item', { volume: 0.8 }), false);
  assert.equal(store.read('item').volume, 0.8);
  storage.removeItem = () => { throw new Error('denied'); };
  store.remove('item'); assert.equal(store.read('item', null), null);
  assert.equal(store.available, false);
});
test('invalid JSON safely falls back without claiming storage is inaccessible', () => {
  const store = platform.createStore(memoryStorage({ corrupt: '{' }));
  assert.deepEqual(store.read('corrupt', []), []); assert.equal(store.available, true);
});
test('checkpoint only restores a living, bounded, recognized campaign snapshot', () => {
  const good = platform.validateCheckpoint(checkpoint());
  assert.equal(good.level, 4); assert.equal(good.stats.playTime, 154.4); assert.equal(good.upgrades.reactor, 0);
  for (const mutate of [v => { v.version = 2; }, v => { v.level = 4.5; }, v => { v.score = NaN; }, v => { v.player.lives = 0; }, v => { v.player.bombs = 99; }, v => { v.difficulty = 'unknown'; }]) {
    const value = checkpoint(); mutate(value); assert.equal(platform.validateCheckpoint(value), null);
  }
});
test('profile imports legacy data without overwriting legacy keys and counts each run once', () => {
  const storage = memoryStorage({ blackbox_squadron_scoreboard_v1: JSON.stringify([{ name: 'KEN', score: 5000, level: 6 }]), blackbox_squadron_highscore: '7000' });
  const api = platform.createPlatform(fakeWindow(storage));
  assert.equal(api.getProfile().bestScore, 7000);
  api.recordRun({ id: 'flight-1', score: 8000, kills: 10, duration: 30, level: 12, victory: true });
  api.recordRun({ id: 'flight-1', score: 9000, kills: 20, duration: 50, level: 13, victory: false });
  const result = api.getProfile();
  assert.equal(result.runs, 1); assert.equal(result.wins, 1); assert.equal(result.kills, 20); assert.equal(result.playSeconds, 50); assert.equal(result.bestScore, 9000);
  assert.equal(storage.getItem('blackbox_squadron_highscore'), '7000');
  assert.equal(JSON.parse(storage.getItem('blackbox_squadron_scoreboard_v1'))[0].name, 'KEN');
});
test('lost focus pauses via adapter and clears controller input, repeated attach does not bind listeners again', () => {
  const win = fakeWindow(memoryStorage()), api = platform.createPlatform(win);
  let paused = 0, cleared = 0; const initial = win.handlers.blur;
  api.attach({ pause: () => paused++, clearInput: () => cleared++ });
  assert.equal(win.handlers.blur, initial);
  api.gamepadInput.dx = 1; api.gamepadInput.fire = true; win.handlers.blur();
  assert.equal(paused, 1); assert.equal(cleared, 1); assert.equal(api.gamepadInput.dx, 0); assert.equal(api.gamepadInput.fire, false);
});
test('campaign checkpoint survives load, clears on defeat, and records authoritative run statistics', () => {
  const win = fakeWindow(memoryStorage()), api = platform.createPlatform(win);
  win.BlackboxCampaign = { serialize: checkpoint };
  win.handlers['blackbox:campaign']({ detail: { type: 'sector-start' } });
  assert.equal(api.loadCheckpoint().level, 4);
  win.handlers['blackbox:campaign']({ detail: { type: 'defeat', runId: 'x', level: 4, score: 6000, stats: { kills: 22, playTime: 155 } } });
  assert.equal(api.loadCheckpoint(), null); assert.equal(api.getProfile().kills, 22); assert.equal(api.getProfile().playSeconds, 155);
});
function workerHarness() {
  const listeners = {}, deleted = [], fetched = [], buckets = new Map();
  const scope = 'https://example.com/BLACKBOX_SQUADRON_Public_Game/';
  const prefix = 'blackbox-squadron:' + encodeURIComponent('/BLACKBOX_SQUADRON_Public_Game/') + ':';
  function bucket(key) { if (!buckets.has(key)) buckets.set(key, new Map()); const entries = buckets.get(key); return { addAll: async urls => { for (const item of urls) { const url = typeof item === 'string' ? item : item.url; entries.set(url, new Response('cached:' + url)); } }, keys: async () => [...entries.keys()].map(url => ({ url })), match: async url => entries.has(url) ? entries.get(url).clone() : undefined, put: async (url, response) => { entries.set(url, response); } }; }
  const caches = { open: async key => bucket(key), keys: async () => [...buckets.keys()], delete: async key => { deleted.push(key); return buckets.delete(key); } };
  const self = { registration: { scope }, addEventListener: (type, fn) => { listeners[type] = fn; }, skipWaiting: async () => {}, clients: { claim: async () => {} } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8'), { self, caches, URL, Request, Response, Set, fetch: async request => { fetched.push(request.url); throw new Error('offline'); } });
  return { listeners, buckets, bucket, deleted, fetched, scope, prefix };
}
test('service worker activation never deletes another game or another installation cache', async () => {
  const w = workerHarness();
  w.bucket('other-game-cache'); w.bucket('blackbox-squadron:%2Fother%2F:v0.4.0'); w.bucket(w.prefix + 'v0.4.0');
  await w.bucket('blackbox-squadron-v0.4.2-input-hotfix').put(w.scope + 'index.html', new Response('old'));
  await w.bucket('blackbox-squadron-v0.3.0').put('https://example.com/another-game/index.html', new Response('other'));
  let promise; w.listeners.activate({ waitUntil: p => { promise = p; } }); await promise;
  assert.deepEqual(w.deleted.sort(), ['blackbox-squadron-v0.4.2-input-hotfix', w.prefix + 'v0.4.0'].sort());
  assert.ok(w.buckets.has('other-game-cache')); assert.ok(w.buckets.has('blackbox-squadron-v0.3.0'));
});
test('installed app shell and versioned assets are available offline without response rewriting', async () => {
  const w = workerHarness(); let promise;
  w.listeners.install({ waitUntil: p => { promise = p; } }); await promise;
  w.listeners.fetch({ request: { method: 'GET', url: w.scope + 'index.html?app=blackbox', mode: 'navigate' }, respondWith: p => { promise = p; } });
  assert.equal(await (await promise).text(), 'cached:' + w.scope + 'index.html'); assert.equal(w.fetched.length, 0);
  w.listeners.fetch({ request: { method: 'GET', url: w.scope + 'js/platform.js?v=050', mode: 'cors' }, respondWith: p => { promise = p; } });
  assert.equal(await (await promise).text(), 'cached:' + w.scope + 'js/platform.js');
  let intercepted = false;
  w.listeners.fetch({ request: { method: 'GET', url: 'https://example.com/other-game/index.html', mode: 'navigate' }, respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false);
});
test('loading platform script twice does not wrap game effects or register input twice', () => {
  const { createGame } = require('./harness.cjs');
  const game = createGame({ platform: true });
  game.run('globalThis.originalFireWrapper = firePlayer; globalThis.originalPlatform = BBPlatform;');
  game.load('js/platform.js');
  assert.equal(game.run('originalFireWrapper === firePlayer'), true);
  assert.equal(game.run('originalPlatform === BBPlatform'), true);
});
test('campaign checkpoint roundtrip retains run identity and earned weapon-supply timers', () => {
  const { createGame } = require('./harness.cjs');
  const game = createGame({ campaign: true, platform: true });
  game.run('restartGame(); startGame(); player.spreadTimer = 18; player.rapidTimer = 9; BBPlatform.saveCheckpoint(BlackboxCampaign.serialize());');
  const saved = game.read('BBPlatform.loadCheckpoint()');
  assert.ok(saved.runId.length > 0); assert.equal(saved.player.spreadTimer, 18);
  game.run('globalThis.savedCheckpoint = BBPlatform.loadCheckpoint(); restartGame(); BlackboxCampaign.restore(savedCheckpoint);');
  assert.equal(game.read('BlackboxCampaign.getState().runId'), saved.runId);
  assert.equal(game.read('player.spreadTimer'), 18); assert.equal(game.read('player.rapidTimer'), 9);
});
test('submitted names sync to profile and unavailable storage retains multiple scores for the visit', () => {
  const { createGame } = require('./harness.cjs');
  const game = createGame({ campaign: true, platform: true });
  game.run(`
    localStorage.setItem = () => { throw new Error('quota'); };
    BBPlatform.updateSettings({volume:0.4});
    addScoreboardEntry('KEN', 1200, 2);
    addScoreboardEntry('ACE', 900, 1);
  `);
  assert.equal(game.read('BBPlatform.storageAvailable'), false);
  assert.deepEqual(game.read('BBPlatform.getScores()'), [{name:'KEN',score:1200,level:2},{name:'ACE',score:900,level:1}]);
  assert.deepEqual(game.read('BBPlatform.getProfile().scores'), game.read('BBPlatform.getScores()'));
});
