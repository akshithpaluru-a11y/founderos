/* FounderOS — command palette (Cmd/Ctrl+K). Fuzzy-search apps + actions. */
(function () {
  "use strict";

  let items = [];      // {label, hint, kind, run, color}
  let filtered = [];
  let active = 0;

  function buildItems() {
    const list = [];
    window.FounderApps.list.forEach((a) => {
      list.push({
        label: a.name,
        hint: a.tagline_short || a.category,
        kind: "Open",
        color: a.color,
        badge: a.badge,
        run: () => window.FounderApps.launch(a.id),
        keys: (a.name + " " + a.id + " " + (a.tagline_short || "")).toLowerCase(),
      });
    });
    list.push({ label: "Change accent color", hint: "Settings → Appearance", kind: "Action", badge: "◐",
      run: () => window.FounderApps.launch("settings"), keys: "accent color theme appearance settings" });
    list.push({ label: "Change wallpaper", hint: "Settings → Appearance", kind: "Action", badge: "▦",
      run: () => window.FounderApps.launch("settings"), keys: "wallpaper background settings appearance" });
    list.push({ label: "Lock FounderOS", hint: "Return to lock screen", kind: "Action", badge: "◍",
      run: () => window.FounderMain && window.FounderMain.relock(), keys: "lock sign out logout screen" });
    list.push({ label: "Close all windows", hint: "Clear the desktop", kind: "Action", badge: "✕",
      run: () => window.FounderWM.list().forEach((r) => window.FounderWM.close(r.id)), keys: "close all clear windows" });
    items = list;
  }

  function score(item, q) {
    if (!q) return 1;
    const k = item.keys;
    if (k.startsWith(q)) return 3;
    if (k.includes(" " + q)) return 2;
    if (k.includes(q)) return 1;
    // subsequence match
    let i = 0;
    for (const ch of k) { if (ch === q[i]) i++; if (i === q.length) return 0.5; }
    return 0;
  }

  function render() {
    const wrap = document.getElementById("palette-list");
    wrap.innerHTML = "";
    if (!filtered.length) {
      wrap.innerHTML = `<div class="palette__empty">No matches — try “terminal” or “accent”.</div>`;
      return;
    }
    filtered.forEach((item, i) => {
      const el = document.createElement("button");
      el.className = "palette__item" + (i === active ? " is-active" : "");
      el.style.setProperty("--app", item.color || "var(--accent)");
      el.innerHTML = `
        <span class="palette__badge">${item.badge || "›"}</span>
        <span class="palette__meta"><b>${item.label}</b><small>${item.hint || ""}</small></span>
        <span class="palette__kind">${item.kind}</span>`;
      el.addEventListener("click", () => choose(i));
      el.addEventListener("mousemove", () => { if (active !== i) { active = i; render(); } });
      wrap.appendChild(el);
    });
    const activeEl = wrap.children[active];
    if (activeEl && activeEl.scrollIntoView) activeEl.scrollIntoView({ block: "nearest" });
  }

  function refilter() {
    const q = document.getElementById("palette-input").value.trim().toLowerCase();
    filtered = items
      .map((it) => ({ it, s: score(it, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it);
    active = 0;
    render();
  }

  function choose(i) {
    const item = filtered[i];
    if (!item) return;
    close();
    item.run();
  }

  function open() {
    buildItems();
    const p = document.getElementById("palette");
    const input = document.getElementById("palette-input");
    p.hidden = false;
    requestAnimationFrame(() => p.classList.add("is-open"));
    input.value = "";
    refilter();
    input.focus();
  }
  function close() {
    const p = document.getElementById("palette");
    p.classList.remove("is-open");
    setTimeout(() => { p.hidden = true; }, 160);
  }
  function isOpen() { return !document.getElementById("palette").hidden; }
  function toggle() { isOpen() ? close() : open(); }

  function init() {
    const input = document.getElementById("palette-input");
    input.addEventListener("input", refilter);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(filtered.length - 1, active + 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); render(); }
      else if (e.key === "Enter") { e.preventDefault(); choose(active); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
    });
    document.getElementById("palette").addEventListener("click", (e) => {
      if (e.target.id === "palette") close();
    });
  }

  window.FounderPalette = { open, close, toggle, isOpen, init };
})();
