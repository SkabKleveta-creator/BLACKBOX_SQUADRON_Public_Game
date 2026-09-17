"use strict";

// State/event integration against DOM stubs. These tests do not claim browser
// layout, native dialog focus behavior, or touch-device rendering coverage.
const test = require("node:test");
const assert = require("node:assert/strict");
const { createGame } = require("./harness.cjs");

function createUI() {
  const game = createGame({ campaign: true, platform: true });
  const dialog = game.document.getElementById("utility-dialog");
  dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.dispatchEvent({ type: "close" }); };
  game.load("js/presentation.js");
  game.load("js/ui.js");
  return game;
}

function launch(game) {
  game.document.getElementById("pilot-name").value = "KEN";
  game.document.getElementById("difficulty").value = "standard";
  game.run("BlackboxUI.launch();");
}

test("launch applies the menu callsign and difficulty and hides the flight overlay", () => {
  const game = createUI();
  game.document.getElementById("pilot-name").value = "k<en";
  game.document.getElementById("difficulty").value = "cadet";
  game.run("BlackboxUI.launch();");
  assert.equal(game.run("game.state"), "playing");
  assert.equal(game.run("BlackboxCampaign.state.difficulty"), "cadet");
  assert.equal(game.persisted.get("blackbox_squadron_pilot"), "KEN");
  assert.equal(game.document.getElementById("screen-overlay").hidden, true);
  assert.equal(game.document.getElementById("pause-button").hidden, false);
  assert.equal(game.run("BBPlatform.loadCheckpoint().level"), 1);
});

test("opening settings pauses flight and blocks gameplay keys until the dialog closes", () => {
  const game = createUI();
  launch(game);
  game.run("keys.Space = true; BlackboxPointer.active = true; BlackboxUI.showSettings();");
  assert.equal(game.run("game.state"), "paused");
  assert.equal(game.run("keys.Space"), false);
  assert.equal(game.run("BlackboxPointer.active"), false);
  assert.equal(game.document.getElementById("utility-dialog").open, true);
  game.dispatch("keydown", { key: "Enter", code: "Enter" });
  game.run("handleGlobalInput();");
  assert.equal(game.run("game.state"), "paused");
  game.document.getElementById("utility-dialog").close();
  assert.equal(game.run("game.state"), "paused");
  game.run("toggleStartPause();");
  assert.equal(game.run("game.state"), "playing");
});

test("menu pause and resume clear held controls and do not preserve elapsed backlog", () => {
  const game = createUI();
  launch(game);
  game.run("keys.ArrowRight = true; accumulator = 0.07; toggleStartPause();");
  assert.equal(game.run("game.state"), "paused");
  assert.equal(game.run("keys.ArrowRight"), false);
  game.run("toggleStartPause();");
  assert.equal(game.run("game.state"), "playing");
  assert.equal(game.run("accumulator"), 0);
});

test("death records the chosen pilot automatically and shows a stable debrief", () => {
  const game = createUI();
  launch(game);
  game.run("game.score = 750; player.lives = 1; player.invuln = 0; hitPlayer();");
  assert.equal(game.run("game.state"), "gameover");
  assert.deepEqual(game.read("BBPlatform.getScores()[0]"), { name: "KEN", score: 750, level: 1 });
  assert.equal(game.run("BBPlatform.getProfile().runs"), 1);
  assert.equal(game.run("BBPlatform.loadCheckpoint()"), null);
  assert.equal(game.document.getElementById("screen-overlay").hidden, false);
  assert.match(game.document.getElementById("screen-content").innerHTML, /Signal lost/);
  game.frame(1000);
  assert.equal(game.run("BBPlatform.getProfile().runs"), 1);
  assert.equal(game.run("BBPlatform.getScores().length"), 1);
});

test("window focus loss releases drag input and leaves an explicit paused menu", () => {
  const game = createUI();
  launch(game);
  const canvas = game.document.getElementById("game");
  canvas.dispatchEvent({ type: "pointerdown", pointerId: 10, clientX: 220, clientY: 400, button: 0 });
  assert.equal(game.run("BlackboxPointer.active"), true);
  game.dispatch("blur");
  game.run("BlackboxUI.refresh();");
  assert.equal(game.run("game.state"), "paused");
  assert.equal(game.run("BlackboxPointer.active"), false);
  assert.match(game.document.getElementById("screen-content").innerHTML, /FLIGHT ON HOLD/);
  game.run("toggleStartPause();");
  canvas.dispatchEvent({ type: "pointerdown", pointerId: 11, clientX: 220, clientY: 400, button: 0 });
  assert.equal(game.run("BlackboxPointer.active"), true, "new drag must be accepted after blur recovery");
});

test("touch movement tracks only the captured finger and survives cancellation", () => {
  const game = createUI();
  launch(game);
  const canvas = game.document.getElementById("game");
  canvas.dispatchEvent({ type: "pointerdown", pointerId: 10, clientX: 100, clientY: 500, button: 0 });
  canvas.dispatchEvent({ type: "pointermove", pointerId: 99, clientX: 400, clientY: 500 });
  assert.equal(game.run("BlackboxPointer.x"), 270);
  canvas.dispatchEvent({ type: "pointermove", pointerId: 10, clientX: 120, clientY: 500 });
  assert.equal(game.run("BlackboxPointer.x"), 290);
  canvas.dispatchEvent({ type: "pointercancel", pointerId: 10 });
  assert.equal(game.run("BlackboxPointer.active"), false);
  canvas.dispatchEvent({ type: "pointerdown", pointerId: 11, clientX: 100, clientY: 500, button: 0 });
  assert.equal(game.run("BlackboxPointer.active"), true);
});

test("victory writes the named local score once and leaves endless available", () => {
  const game = createUI();
  launch(game);
  game.run("game.level = 12; startGame(); game.score = 10000; completeLevel(); BlackboxUI.refresh();");
  assert.equal(game.run("game.state"), "victory");
  assert.equal(game.run("BBPlatform.getProfile().wins"), 1);
  assert.equal(game.run("BBPlatform.getScores()[0].name"), "KEN");
  assert.match(game.document.getElementById("screen-content").innerHTML, /ENTER ENDLESS FRONTIER/);
  const count = game.run("BBPlatform.getScores().length");
  game.run("completeLevel(); BlackboxUI.refresh(true);");
  assert.equal(game.run("BBPlatform.getScores().length"), count);
});
