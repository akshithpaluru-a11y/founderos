/* FounderOS — desktop shell: boot → lock → desktop, icons, taskbar,
 * launcher, command palette, context menu, and keyboard shortcuts. */
(function () {
  "use strict";

  const WM = window.FounderWM;
  const Apps = window.FounderApps;

  // ---------- boot → lock → desktop ----------
  function boot() {
    const bootEl = document.getElementById("boot");
    setTimeout(() => {
      bootEl.classList.add("boot--done");
      setTimeout(() => {
        bootEl.style.display = "none";
        window.FounderLock.show(onUnlocked);
      }, 450);
    }, 1500);
  }
  function onUnlocked() {
    // gentle staggered reveal of desktop icons
    document.getElementById("desktop").classList.add("is-live");
  }

  // ---------- desktop icons ----------
  function renderIcons() {
    const wrap = document.getElementById("icons");
    wrap.innerHTML = "";
    Apps.list.filter((a) => a.desktop !== false).forEach((app, i) => {
      const btn = document.createElement("button");
      btn.className = "icon";
      btn.setAttribute("role", "listitem");
      btn.dataset.appId = app.id;
      btn.style.setProperty("--app", app.color);
      btn.style.setProperty("--app-soft", app.colorSoft);
      btn.style.setProperty("--i", i);
      btn.innerHTML = `
        <span class="icon__tile"><span class="icon__badge">${app.badge}</span></span>
        <span class="icon__label">${app.name}</span>`;
      btn.addEventListener("dblclick", () => Apps.launch(app.id));
      btn.addEventListener("keydown", (e) => { if (e.key === "Enter") Apps.launch(app.id); });
      wrap.appendChild(btn);
    });
  }

  // ---------- taskbar ----------
  function renderTasks() {
    const tasks = document.getElementById("tasks");
    tasks.innerHTML = "";
    WM.list().forEach((rec) => {
      const b = document.createElement("button");
      b.className = "task" + (rec.id === WM.activeId ? " is-active" : "") + (rec.minimized ? " is-min" : "");
      if (rec.accent) b.style.setProperty("--app", rec.accent);
      b.innerHTML = `<span class="task__dot"></span>${rec.badge ? `<span class="task__badge">${rec.badge}</span>` : ""}<span class="task__label">${rec.title}</span>`;
      b.addEventListener("click", () => WM.toggleMin(rec.id));
      tasks.appendChild(b);
    });
  }
  WM.onChange = renderTasks;

  // ---------- clock ----------
  function tick() {
    const el = document.getElementById("clock");
    const d = new Date();
    const hh = d.getHours() % 12 || 12;
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ap = d.getHours() < 12 ? "AM" : "PM";
    el.textContent = `${hh}:${mm} ${ap}`;
  }

  // ---------- start menu ----------
  function renderStartMenu() {
    const wrap = document.getElementById("startmenu-apps");
    wrap.innerHTML = "";
    Apps.list.forEach((app) => {
      const b = document.createElement("button");
      b.className = "startapp";
      b.style.setProperty("--app", app.color);
      b.innerHTML = `<span class="startapp__badge">${app.badge}</span><span class="startapp__meta"><b>${app.name}</b><small>${app.tagline_short}</small></span>`;
      b.addEventListener("click", () => { Apps.launch(app.id); closeStart(); });
      wrap.appendChild(b);
    });
  }
  function openStart() { document.getElementById("startmenu").hidden = false; document.getElementById("start").classList.add("is-open"); }
  function closeStart() { document.getElementById("startmenu").hidden = true; document.getElementById("start").classList.remove("is-open"); }
  function toggleStart() { document.getElementById("startmenu").hidden ? openStart() : closeStart(); }

  // ---------- desktop context menu ----------
  const CTX = [
    { label: "Open Terminal", run: () => Apps.launch("terminal") },
    { label: "Open Traction", run: () => Apps.launch("traction") },
    { label: "Appearance…", run: () => Apps.launch("settings") },
    { sep: true },
    { label: "Cycle wallpaper", run: cycleWallpaper },
    { label: "Cycle accent", run: cycleAccent },
    { sep: true },
    { label: "Command palette (⌘K)", run: () => window.FounderPalette.open() },
    { label: "Lock FounderOS", run: relock },
  ];
  function openCtx(x, y) {
    const menu = document.getElementById("ctxmenu");
    menu.innerHTML = CTX.map((it, i) =>
      it.sep ? `<div class="ctxmenu__sep"></div>` : `<button class="ctxmenu__item" data-i="${i}">${it.label}</button>`
    ).join("");
    menu.hidden = false;
    const mw = 210, mh = menu.offsetHeight || 300;
    menu.style.left = Math.min(x, window.innerWidth - mw - 8) + "px";
    menu.style.top = Math.min(y, window.innerHeight - mh - 8) + "px";
    menu.querySelectorAll("[data-i]").forEach((el) =>
      el.addEventListener("click", () => { closeCtx(); CTX[+el.dataset.i].run(); }));
  }
  function closeCtx() { document.getElementById("ctxmenu").hidden = true; }
  function cycleWallpaper() {
    const list = window.FounderOS.wallpapers; const cur = window.FounderOS.get().wallpaper;
    const i = list.findIndex((w) => w.id === cur);
    window.FounderOS.setWallpaper(list[(i + 1) % list.length].id);
  }
  function cycleAccent() {
    const list = window.FounderOS.accents; const cur = window.FounderOS.get().accent;
    const i = list.findIndex((a) => a.id === cur);
    window.FounderOS.setAccent(list[(i + 1) % list.length].id);
  }

  // ---------- relock ----------
  function relock() {
    closeStart(); closeCtx();
    if (window.FounderPalette.isOpen()) window.FounderPalette.close();
    document.getElementById("desktop").classList.remove("is-live");
    window.FounderLock.show(onUnlocked);
  }

  // ---------- wire ----------
  function init() {
    // reflect motion preference from settings immediately
    boot();
    renderIcons();
    renderTasks();
    renderStartMenu();
    tick();
    setInterval(tick, 10000);
    window.FounderPalette.init();
    window.FounderOS.onChange(() => { /* settings changed live; nothing extra needed */ });

    document.getElementById("start").addEventListener("click", (e) => { e.stopPropagation(); toggleStart(); });
    document.getElementById("palette-btn").addEventListener("click", (e) => { e.stopPropagation(); window.FounderPalette.open(); });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#startmenu") && !e.target.closest("#start")) closeStart();
      if (!e.target.closest("#ctxmenu")) closeCtx();
    });

    // right-click on empty desktop → context menu
    document.getElementById("desktop").addEventListener("contextmenu", (e) => {
      if (e.target.closest(".window") || e.target.closest(".icon")) return;
      e.preventDefault(); closeStart(); openCtx(e.clientX, e.clientY);
    });

    // keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") { e.preventDefault(); if (!document.getElementById("lock").hidden) return; window.FounderPalette.toggle(); return; }
      if (e.key === "Escape") { closeStart(); closeCtx(); }
    });
  }

  window.FounderMain = { relock };
  document.addEventListener("DOMContentLoaded", init);
})();
