"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatchEvent(event) {
      event.preventDefault ||= function () { this.defaultPrevented = true; };
      event.stopPropagation ||= () => {};
      event.target ||= this;
      for (const fn of [...(listeners.get(event.type) || [])]) fn.call(this, event);
      return !event.defaultPrevented;
    },
  };
}

function createGame({ campaign = false, platform = false, storage = {}, seed = 42 } = {}) {
  const persisted = new Map(Object.entries(storage));
  const elements = new Map();
  const context2d = new Proxy({
    measureText: (text) => ({ width: String(text).length * 8 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
  }, {
    get: (target, key) => key in target ? target[key] : () => {},
  });
  function makeElement(tagName = "DIV") {
    const classes = new Set();
    return Object.assign(eventTarget(), {
      tagName: tagName.toUpperCase(), style: {}, dataset: {}, children: [],
      width: 540, height: 720, hidden: false, disabled: false, value: "", textContent: "",
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name),
        toggle(name, force) {
          const next = force ?? !classes.has(name);
          if (next) classes.add(name); else classes.delete(name);
          return next;
        },
      },
      appendChild(child) { this.children.push(child); return child; },
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
      remove() {}, focus() {}, click() {},
      setAttribute(name, value) { this[name] = String(value); },
      getAttribute(name) { return this[name] ?? null; },
      removeAttribute(name) { delete this[name]; },
      getContext: () => context2d,
      getBoundingClientRect: () => ({ x: 0, y: 0, left: 0, top: 0, width: 540, height: 720, right: 540, bottom: 720 }),
      setPointerCapture() {}, releasePointerCapture() {}, hasPointerCapture: () => false,
      querySelectorAll: () => [], querySelector: () => null,
      matches: () => false, closest: () => null,
    });
  }
  const document = Object.assign(eventTarget(), {
    hidden: false, visibilityState: "visible", readyState: "complete",
    body: makeElement("body"), head: makeElement("head"), documentElement: makeElement("html"),
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement(id === "game" ? "canvas" : "div"));
      return elements.get(id);
    },
    createElement: makeElement,
    querySelectorAll: () => [], querySelector: () => null,
  });
  const random = Object.create(Math);
  let state = seed >>> 0;
  random.random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  let now = 0;
  let rafId = 0;
  const sandbox = Object.assign(eventTarget(), {
    document, console, Math: random,
    performance: { now: () => now },
    localStorage: {
      getItem: (key) => persisted.get(key) ?? null,
      setItem: (key, value) => persisted.set(key, String(value)),
      removeItem: (key) => persisted.delete(key),
      clear: () => persisted.clear(),
    },
    navigator: { getGamepads: () => [], vibrate: () => true, onLine: true },
    location: { href: "http://localhost/", origin: "http://localhost", pathname: "/" },
    matchMedia: () => Object.assign(eventTarget(), { matches: false, addListener() {}, removeListener() {} }),
    requestAnimationFrame: () => ++rafId, cancelAnimationFrame() {},
    setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
    CustomEvent: class { constructor(type, options = {}) { this.type = type; Object.assign(this, options); } },
    Event: class { constructor(type, options = {}) { this.type = type; Object.assign(this, options); } },
    innerWidth: 1024, innerHeight: 768, devicePixelRatio: 1,
    URL, URLSearchParams,
  });
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  const context = vm.createContext(sandbox);
  const loaded = [];
  const load = (filename) => {
    vm.runInContext(fs.readFileSync(path.join(root, filename), "utf8"), context, { filename });
    loaded.push(filename);
  };
  load("js/game.js");
  if (campaign) load("js/campaign.js");
  if (platform) load("js/platform.js");
  return {
    context, document, elements, persisted, loaded, load,
    run: (source) => vm.runInContext(source, context),
    read: (source) => JSON.parse(vm.runInContext(`JSON.stringify(${source})`, context)),
    dispatch: (type, detail = {}) => sandbox.dispatchEvent({ type, ...detail }),
    frame(time) { now = time; return vm.runInContext(`frame(${Number(time)})`, context); },
  };
}

module.exports = { createGame };
