"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createGame } = require("./harness.cjs");

function playing(options) {
  const game = createGame(options);
  game.run("restartGame(); startGame(); player.invuln = 0; spawnTimer = 999;");
  return game;
}

test("lethal hit and final kill cannot advance a dead pilot", () => {
  const game = playing();
  game.run(`
    player.lives = 1; game.killsNeeded = 1;
    enemies = [{ x: 200, y: 200, r: 12, hp: 1, score: 100, type: 'fighter' }];
    playerBullets = [{ x: 200, y: 200, r: 3, damage: 1 }];
    enemyBullets = [{ x: player.x, y: player.y, r: 3 }];
    handleCollisions(); checkLevelProgress();
  `);
  assert.equal(game.run("player.alive"), false);
  assert.equal(game.run("player.lives"), 0);
  assert.ok(["nameentry", "gameover"].includes(game.run("game.state")));
  assert.equal(game.run("game.level"), 1);
});

test("lethal hits stop pickup processing and preserve the final score", () => {
  const game = playing();
  game.run(`
    player.lives = 1; game.score = 450;
    enemyBullets = [{ x: player.x, y: player.y, r: 3 }];
    powerups = [{ x: player.x, y: player.y, r: 9, type: 'repair' },
                { x: player.x, y: player.y, r: 9, type: 'score' }];
    handleCollisions();
  `);
  assert.deepEqual(game.read("({ alive: player.alive, lives: player.lives, score: game.score, best: game.highScore })"),
    { alive: false, lives: 0, score: 450, best: 450 });
});

test("a fast projectile hits an enemy crossed between frame endpoints", () => {
  const game = playing();
  game.run(`
    enemies = [{ x: 200, y: 200, r: 12, hp: 1, score: 100, type: 'fighter' }];
    playerBullets = [{ x: 200, y: 250, vx: 0, vy: -1000, r: 3, damage: 1 }];
    updateBullets(0.1); handleCollisions();
  `);
  assert.equal(game.run("enemies.length"), 0);
  assert.equal(game.run("game.killsThisLevel"), 1);
});

test("enemy projectiles also use their full traveled path", () => {
  const game = playing();
  game.run(`
    enemyBullets = [{ x: player.x, y: player.y - 45, vx: 0, vy: 900, r: 3 }];
    updateBullets(0.1); handleCollisions();
  `);
  assert.equal(game.run("player.lives"), 2);
  assert.equal(game.run("enemyBullets.length"), 0);
});

test("a piercing projectile hits each target once but may hit distinct targets", () => {
  const game = playing();
  game.run(`
    enemies = [
      { x: 200, y: 200, r: 25, hp: 10, score: 100, type: 'fighter' },
      { x: 201, y: 200, r: 25, hp: 10, score: 100, type: 'fighter' }
    ];
    playerBullets = [{ x: 200, y: 200, r: 5, damage: 2, pierce: true }];
    handleCollisions(); handleCollisions(); handleCollisions();
  `);
  assert.deepEqual(game.read("enemies.map(enemy => enemy.hp)"), [8, 8]);
});

test("ordinary rounds cannot damage two overlapping enemies", () => {
  const game = playing();
  game.run(`
    enemies = [
      { x: 200, y: 200, r: 15, hp: 2, score: 100, type: 'bomber' },
      { x: 200, y: 200, r: 15, hp: 2, score: 100, type: 'bomber' }
    ];
    playerBullets = [{ x: 200, y: 200, r: 3, damage: 1 }];
    handleCollisions();
  `);
  assert.deepEqual(game.read("enemies.map(enemy => enemy.hp)"), [1, 2]);
  assert.equal(game.run("playerBullets.length"), 0);
});

test("enemy death rewards are idempotent", () => {
  const game = playing();
  game.run("const target = { x: 100, y: 100, hp: 0, score: 250, type: 'bomber' }; killEnemy(target, true); killEnemy(target, true);");
  assert.equal(game.run("game.score"), 250);
  assert.equal(game.run("game.killsThisLevel"), 1);
});

test("shield and invulnerability prevent multiple simultaneous hull losses", () => {
  const game = playing();
  game.run("player.shieldHp = 1; absorbOrHitPlayer(0, 0); absorbOrHitPlayer(0, 0); hitPlayer();");
  assert.equal(game.run("player.shieldHp"), 0);
  assert.equal(game.run("player.lives"), 3);
  game.run("player.invuln = 0; hitPlayer(); hitPlayer();");
  assert.equal(game.run("player.lives"), 2);
});

test("restart removes previous run effects, input and weapon cooldown", () => {
  const game = playing();
  game.run(`
    game.shake = 10; game.flash = 2; game.time = 33;
    player.fireCooldown = 0.4; player.speed = 330;
    keys.Space = true; touchInput.left = true;
    enemies.push({}); playerBullets.push({}); obstacles.push({});
    restartGame();
  `);
  assert.deepEqual(game.read("({ state: game.state, score: game.score, level: game.level, shake: game.shake, flash: game.flash, time: game.time, cooldown: player.fireCooldown, speed: player.speed, held: keys.Space, touch: touchInput.left, enemies: enemies.length, bullets: playerBullets.length, obstacles: obstacles.length })"),
    { state: "start", score: 0, level: 1, shake: 0, flash: 0, time: 0, cooldown: 0, speed: 260, held: false, touch: false, enemies: 0, bullets: 0, obstacles: 0 });
});

test("held keyboard input clears after lost focus", () => {
  const game = playing();
  game.dispatch("keydown", { key: "ArrowRight", code: "ArrowRight" });
  assert.equal(game.run("keys.ArrowRight"), true);
  game.dispatch("blur");
  assert.equal(game.run("keys.ArrowRight"), false);
});

test("typing in a settings input cannot move or fire the ship", () => {
  const game = playing();
  game.dispatch("keydown", { key: " ", code: "Space", target: { matches: () => true } });
  assert.equal(game.run("Boolean(keys.Space)"), false);
});

test("active combat ignores the accidental restart hotkey", () => {
  const game = playing();
  game.run("game.score = 321; pressed.KeyR = true; handleGlobalInput();");
  assert.equal(game.run("game.score"), 321);
  assert.equal(game.run("game.state"), "playing");
});

test("pause freezes combat timers and does not catch up missed time", () => {
  const game = playing();
  game.run("player.spreadTimer = 10; game.state = STATE.PAUSED;");
  game.frame(60000);
  assert.equal(game.run("player.spreadTimer"), 10);
  assert.equal(game.run("game.time"), 0);
  game.run("game.state = STATE.PLAYING;");
  game.frame(60010);
  assert.ok(game.run("player.spreadTimer") > 9.98);
});

test("60 Hz and 144 Hz displays simulate equal movement and fire cadence", () => {
  const simulate = (hz) => {
    const game = playing();
    game.run("let shots = 0; const baseFire = firePlayer; firePlayer = function() { shots++; baseFire(); }; keys.ArrowRight = true; keys.Space = true;");
    for (let i = 1; i <= hz; i++) game.frame(i * 1000 / hz);
    return game.read("({ x: player.x, shots, elapsed: game.time })");
  };
  const sixty = simulate(60), fast = simulate(144);
  assert.ok(Math.abs(sixty.x - fast.x) <= 260 / 120 + 0.001);
  assert.equal(sixty.shots, fast.shots);
  assert.ok(Math.abs(sixty.elapsed - fast.elapsed) <= 1 / 120 + 0.000001);
});

test("corrupt and untrusted local leaderboard records are constrained", () => {
  const game = createGame({ storage: {
    blackbox_squadron_highscore: "Infinity",
    blackbox_squadron_scoreboard_v1: '[{"name":"<ace>","score":123.9,"level":-4},{"name":"BAD","score":-5},{"name":"INF","score":1e400},{"name":"","score":25,"level":"bad"}]',
  } });
  assert.deepEqual(game.read("loadScoreboard()"), [
    { name: "ACE", score: 123, level: 1 },
    { name: "ACE", score: 25, level: 1 },
  ]);
  assert.equal(game.run("loadHighScore()"), 0);
  game.persisted.set("blackbox_squadron_scoreboard_v1", "{broken");
  assert.deepEqual(game.read("loadScoreboard()"), []);
});

test("platform pauses combat on focus loss and requires an explicit resume", () => {
  const game = playing({ platform: true });
  game.dispatch("keydown", { key: "ArrowRight", code: "ArrowRight" });
  game.dispatch("blur");
  assert.equal(game.run("game.state"), "paused");
  assert.equal(game.run("keys.ArrowRight"), false);
  game.dispatch("focus");
  assert.equal(game.run("game.state"), "paused");
});

test("background visibility pauses active combat and clears controller input", () => {
  const game = playing({ platform: true });
  game.run("BBPlatform.gamepadInput.dx = 1; BBPlatform.gamepadInput.fire = true;");
  game.document.hidden = true;
  game.document.dispatchEvent({ type: "visibilitychange" });
  assert.equal(game.run("game.state"), "paused");
  assert.deepEqual(game.read("({ dx: BBPlatform.gamepadInput.dx, fire: BBPlatform.gamepadInput.fire })"), { dx: 0, fire: false });
});

test("saved settings remain typed and bounded despite corrupt storage", () => {
  const game = createGame({ platform: true, storage: {
    blackbox_squadron_settings_v2: JSON.stringify({ volume: 500, sound: "false", autoFire: false, difficulty: "impossible" }),
  } });
  assert.deepEqual(game.read("({ volume: BBPlatform.settings.volume, sound: BBPlatform.settings.sound, autoFire: BBPlatform.settings.autoFire, difficulty: BBPlatform.settings.difficulty })"),
    { volume: 1, sound: true, autoFire: false, difficulty: "standard" });
});

test("duplicate run events do not multiply lifetime totals", () => {
  const game = createGame({ platform: true });
  game.run(`
    BBPlatform.recordRun({ id: 'same-run', score: 750, level: 4, kills: 22, duration: 90, victory: true });
    BBPlatform.recordRun({ id: 'same-run', score: 750, level: 4, kills: 22, duration: 90, victory: true });
  `);
  const profile = game.read("BBPlatform.getProfile()");
  assert.equal(profile.runs, 1);
  assert.equal(profile.wins, 1);
  assert.equal(profile.kills, 22);
  assert.equal(profile.playSeconds, 90);
});

function bossBattle(level = 3, options = {}) {
  const game = playing({ campaign: true, ...options });
  game.run(`
    game.level = ${level}; startGame(); player.invuln = 0;
    game.killsThisLevel = game.killsNeeded; enemies = [];
    checkLevelProgress();
    BlackboxCampaign.state.boss.stage = 'active';
    BlackboxCampaign.state.boss.y = 139;
  `);
  return game;
}

test("campaign contains twelve sectors and four distinct command encounters", () => {
  const game = createGame({ campaign: true });
  assert.equal(game.run("BlackboxCampaign.sectors.length"), 12);
  assert.deepEqual(game.read("BlackboxCampaign.sectors.filter(sector => sector.boss).map(sector => [sector.id, sector.boss])"),
    [[3, "WARDEN"], [6, "BASTION"], [9, "HARROW"], [12, "BLACK CROWN"]]);
  assert.equal(game.run("new Set(BlackboxCampaign.sectors.map(sector => sector.name)).size"), 12);
});

test("boss sectors require the command ship after their escort kill quota", () => {
  const game = bossBattle();
  assert.equal(game.run("game.state"), "playing");
  assert.equal(game.run("game.level"), 3);
  assert.equal(game.run("BlackboxCampaign.state.boss.name"), "WARDEN");
  game.run("checkLevelProgress();");
  assert.equal(game.run("BlackboxCampaign.state.stats.sectorsCleared"), 0);
  assert.equal(game.run("BlackboxCampaign.state.boss.maxHp"), 110);
});

test("bombs award real enemy kills and never manufacture points in empty space", () => {
  const game = playing({ campaign: true });
  game.run("useBomb();");
  assert.equal(game.run("game.score"), 0);
  assert.equal(game.run("game.killsThisLevel"), 0);
  game.run(`
    enemies = [{ x: 100, y: 150, hp: 1, r: 12, score: 100, type: 'fighter' },
               { x: 400, y: 150, hp: 2, r: 14, score: 250, type: 'bomber' }];
    useBomb();
  `);
  assert.equal(game.run("game.score"), 350);
  assert.equal(game.run("game.killsThisLevel"), 2);
  assert.equal(game.run("BlackboxCampaign.state.stats.kills"), 2);
  assert.equal(game.run("BlackboxCampaign.state.stats.bombsUsed"), 2);
  assert.equal(game.run("enemies.length"), 0);
});

test("boss bombs damage hull, cancel attacks, and reward defeat once", () => {
  const game = bossBattle();
  game.run("BlackboxCampaign.state.boss.warning = { kind: 'beam' }; BlackboxCampaign.state.boss.beam = { x: 100 }; useBomb();");
  assert.equal(game.run("BlackboxCampaign.state.boss.hp"), 86);
  assert.equal(game.run("BlackboxCampaign.state.boss.warning"), null);
  assert.equal(game.run("BlackboxCampaign.state.boss.beam"), null);
  assert.equal(game.run("BlackboxCampaign.state.stats.bossesDefeated"), 0);
  game.run("BlackboxCampaign.state.boss.hp = 20; useBomb(); handleCollisions();");
  assert.equal(game.run("BlackboxCampaign.state.boss"), null);
  assert.equal(game.run("BlackboxCampaign.state.stats.bossesDefeated"), 1);
  assert.equal(game.run("game.score"), 3000);
});

test("one rail projectile cannot apply repeated damage to a boss", () => {
  const game = bossBattle();
  game.run(`
    const boss = BlackboxCampaign.state.boss;
    playerBullets = [{ x: boss.x, y: boss.y, r: 5, damage: 2, pierce: true }];
    handleCollisions(); handleCollisions(); handleCollisions();
  `);
  assert.equal(game.run("BlackboxCampaign.state.boss.hp"), 108);
  assert.equal(game.run("BlackboxCampaign.state.stats.shotsHit"), 1);
});

test("boss hull uses swept projectile collision consistently with regular enemies", () => {
  const game = bossBattle();
  game.run(`
    const boss = BlackboxCampaign.state.boss;
    playerBullets = [{ x: boss.x, y: boss.y + 80, vx: 0, vy: -1600, r: 3, damage: 1 }];
    updateBullets(0.1); handleCollisions();
  `);
  assert.equal(game.run("BlackboxCampaign.state.boss.hp"), 109);
});

test("boss beam telegraphs are harmless until firing and damage only the marked lane", () => {
  const game = bossBattle(6);
  game.run(`
    const boss = BlackboxCampaign.state.boss;
    boss.warning = { kind: 'beam', time: 0.5, duration: 0.5, targetX: player.x, targetY: player.y, width: 38 };
    updateEnemies(0.2); handleCollisions();
  `);
  assert.equal(game.run("player.lives"), 3);
  game.run("updateEnemies(0.31); handleCollisions();");
  assert.equal(game.run("player.lives"), 2);
  game.run("player.invuln = 0; player.x = 20; handleCollisions();");
  assert.equal(game.run("player.lives"), 2);
});

test("sector rewards apply once and wait for an explicit upgrade choice", () => {
  const game = playing({ campaign: true });
  game.run("game.killsThisLevel = game.killsNeeded; enemies = []; checkLevelProgress();");
  const score = game.run("game.score");
  game.run("completeLevel(); update(120);");
  assert.equal(game.run("game.state"), "levelclear");
  assert.equal(game.run("game.level"), 1);
  assert.equal(game.run("game.score"), score);
  assert.equal(game.run("BlackboxCampaign.state.stats.sectorsCleared"), 1);
  assert.equal(game.run("BlackboxCampaign.state.offers.length"), 3);
  assert.equal(game.run("BlackboxCampaign.chooseUpgrade(-1)"), false);
  assert.equal(game.run("BlackboxCampaign.chooseUpgrade(0)"), true);
  assert.equal(game.run("BlackboxCampaign.chooseUpgrade(0)"), false);
  assert.equal(game.run("game.level"), 2);
  assert.equal(game.run("BlackboxCampaign.state.upgrades.reactor"), 1);
  assert.ok(game.run("player.baseFireRate") < 0.16);
});

test("checkpoint storage roundtrip preserves identity, upgrades, hull, statistics and weapons", () => {
  const game = playing({ campaign: true, platform: true });
  game.run(`
    completeLevel(); BlackboxCampaign.chooseUpgrade(0);
    player.lives = 2; player.bombs = 1; player.spreadTimer = 18;
    BlackboxCampaign.state.stats.kills = 8;
    BlackboxCampaign.state.stats.playTime = 41.5;
    const saved = BlackboxCampaign.serialize();
    BBPlatform.saveCheckpoint(saved);
    const loaded = BBPlatform.loadCheckpoint();
    restartGame();
  `);
  assert.equal(game.run("BlackboxCampaign.restore(loaded)"), true);
  assert.equal(game.run("BlackboxCampaign.state.runId === saved.runId"), true);
  assert.equal(game.run("game.level"), 2);
  assert.equal(game.run("player.lives"), 2);
  assert.equal(game.run("player.bombs"), 1);
  assert.equal(game.run("player.spreadTimer"), 18);
  assert.equal(game.run("BlackboxCampaign.state.upgrades.reactor"), 1);
  assert.equal(game.run("BlackboxCampaign.state.stats.kills"), 8);
  assert.equal(game.run("BlackboxCampaign.state.stats.playTime"), 41.5);
  assert.equal(game.run("game.killsThisLevel"), 0);
  assert.ok(game.run("player.invuln") >= 1);
});

test("direct campaign restore rejects dead or malformed saves without changing the run", () => {
  const game = playing({ campaign: true });
  game.run("game.score = 123; const validSave = BlackboxCampaign.serialize();");
  const invalidExpressions = [
    "null", "{}", "{ ...validSave, version: 99 }", "{ ...validSave, level: 0 }",
    "{ ...validSave, difficulty: 'invalid' }", "{ ...validSave, score: Infinity }",
    "{ ...validSave, player: { ...validSave.player, lives: 0 } }",
    "{ ...validSave, player: { ...validSave.player, lives: NaN } }",
  ];
  for (const value of invalidExpressions) {
    assert.equal(game.run(`BlackboxCampaign.restore(${value})`), false, value);
    assert.equal(game.run("game.score"), 123, "invalid save must not partially reset the run");
    assert.equal(game.run("game.state"), "playing");
  }
});

test("all twelve sectors reach victory and endless starts at sector thirteen", () => {
  const game = playing({ campaign: true, platform: true });
  for (let sector = 1; sector <= 12; sector++) {
    assert.equal(game.run("game.level"), sector);
    game.run("enemies = []; game.killsThisLevel = game.killsNeeded; checkLevelProgress();");
    if (sector % 3 === 0) {
      assert.equal(game.run("game.state"), "playing", "boss must gate its sector");
      game.run(`
        BlackboxCampaign.state.boss.stage = 'active';
        BlackboxCampaign.state.boss.y = 139;
        playerBullets = [{ x: BlackboxCampaign.state.boss.x, y: 139, r: 3, damage: 100000 }];
        handleCollisions(); checkLevelProgress();
      `);
    }
    if (sector < 12) {
      assert.equal(game.run("game.state"), "levelclear");
      assert.equal(game.run("BlackboxCampaign.chooseUpgrade(0)"), true);
    }
  }
  assert.equal(game.run("game.state"), "victory");
  assert.equal(game.run("BlackboxCampaign.state.stats.bossesDefeated"), 4);
  assert.equal(game.run("BlackboxCampaign.state.stats.sectorsCleared"), 12);
  assert.equal(game.run("BBPlatform.getProfile().wins"), 1);
  assert.equal(game.run("BBPlatform.loadCheckpoint()"), null);
  assert.equal(game.run("BlackboxCampaign.continueEndless()"), true);
  assert.equal(game.run("BlackboxCampaign.continueEndless()"), false);
  assert.equal(game.run("BlackboxCampaign.chooseUpgrade(0)"), true);
  assert.equal(game.run("game.level"), 13);
  assert.equal(game.run("game.state"), "playing");
  assert.equal(game.run("BlackboxCampaign.state.endless"), true);
});

test("presentation and boss rendering load with the integrated engine", () => {
  const game = bossBattle(12, { platform: true });
  game.load("js/presentation.js");
  assert.doesNotThrow(() => game.run("render(); BlackboxCampaign.drawBoss();"));
  assert.equal(game.run("BlackboxPresentation.version"), "0.5.0");
});
