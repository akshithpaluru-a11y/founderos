/* FounderOS — OS services: theming, wallpaper, persisted settings.
 * Loads before the shell so the accent/wallpaper apply with no flash.
 */
(function () {
  "use strict";

  const KEY = "founderos.settings.v1";

  const ACCENTS = [
    { id: "ember",  name: "Ember",  a: "#ff7a45", b: "#ff9a63" },
    { id: "flux",   name: "Flux",   a: "#8b7cf6", b: "#a78bfa" },
    { id: "tide",   name: "Tide",   a: "#38bdf8", b: "#56c7fa" },
    { id: "signal", name: "Signal", a: "#34d399", b: "#5ce0ab" },
    { id: "rose",   name: "Rose",   a: "#fb7185", b: "#fda4af" },
    { id: "gold",   name: "Gold",   a: "#f5a524", b: "#f7b84d" },
  ];

  const WALLPAPERS = [
    { id: "ember",  name: "Ember Grid" },
    { id: "aurora", name: "Aurora" },
    { id: "carbon", name: "Carbon" },
    { id: "nebula", name: "Nebula" },
  ];

  const DEFAULTS = { accent: "ember", wallpaper: "ember", reduceMotion: false, userName: "" };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (_) { return Object.assign({}, DEFAULTS); }
  }
  let state = load();
  const listeners = new Set();

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }

  function applyAccent(id) {
    const p = ACCENTS.find((x) => x.id === id) || ACCENTS[0];
    const r = document.documentElement.style;
    r.setProperty("--accent", p.a);
    r.setProperty("--accent-2", p.b);
    r.setProperty("--accent-soft", rgba(p.a, 0.16));
    r.setProperty("--accent-rgb", hexToRgb(p.a).join(","));
  }
  function applyWallpaper(id) {
    document.documentElement.setAttribute("data-wallpaper", id);
  }
  function applyAll() {
    applyAccent(state.accent);
    applyWallpaper(state.wallpaper);
    document.documentElement.toggleAttribute("data-reduce-motion", !!state.reduceMotion);
  }

  function emit() { listeners.forEach((fn) => { try { fn(state); } catch (_) {} }); }

  const API = {
    accents: ACCENTS,
    wallpapers: WALLPAPERS,
    get: () => Object.assign({}, state),
    setAccent(id) { state.accent = id; applyAccent(id); persist(); emit(); },
    setWallpaper(id) { state.wallpaper = id; applyWallpaper(id); persist(); emit(); },
    setReduceMotion(v) { state.reduceMotion = !!v; document.documentElement.toggleAttribute("data-reduce-motion", !!v); persist(); emit(); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    accentName: () => (ACCENTS.find((x) => x.id === state.accent) || ACCENTS[0]).name,
    setUser(name) { state.userName = (name || "").trim().slice(0, 24); persist(); emit(); },
    userName: () => state.userName,
    firstName: () => (state.userName ? state.userName.split(/\s+/)[0] : "Akshith"),
    initials: () => {
      const n = state.userName || "Akshith Paluru";
      const parts = n.split(/\s+/).filter(Boolean);
      return ((parts[0] || "A")[0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
    },
    apply: applyAll,
  };

  applyAll(); // run immediately (script is in <head>) to avoid flash
  window.FounderOS = API;
})();
