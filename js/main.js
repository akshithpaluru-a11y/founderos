/* FounderOS — desktop shell: boot, icons, taskbar, clock, launcher */
(function () {
  "use strict";

  const WM = window.FounderWM;
  const Apps = window.FounderApps;

  // ---------- boot ----------
  function boot() {
    const boot = document.getElementById("boot");
    // let the fill animate, then reveal the desktop
    setTimeout(() => {
      boot.classList.add("boot--done");
      setTimeout(() => { boot.style.display = "none"; }, 500);
    }, 1400);
  }

  // ---------- desktop icons ----------
  function renderIcons() {
    const wrap = document.getElementById("icons");
    wrap.innerHTML = "";
    Apps.list.forEach((app) => {
      const btn = document.createElement("button");
      btn.className = "icon";
      btn.setAttribute("role", "listitem");
      btn.dataset.appId = app.id;
      btn.style.setProperty("--app", app.color);
      btn.style.setProperty("--app-soft", app.colorSoft);
      btn.innerHTML = `
        <span class="icon__tile"><span class="icon__badge">${app.badge}</span></span>
        <span class="icon__label">${app.name}</span>`;
      btn.addEventListener("dblclick", () => Apps.launch(app.id));
      // single tap on touch / accessibility: also allow Enter
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

  // ---------- wire ----------
  function init() {
    boot();
    renderIcons();
    renderTasks();
    renderStartMenu();
    tick();
    setInterval(tick, 10000);

    document.getElementById("start").addEventListener("click", (e) => { e.stopPropagation(); toggleStart(); });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#startmenu") && !e.target.closest("#start")) closeStart();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
