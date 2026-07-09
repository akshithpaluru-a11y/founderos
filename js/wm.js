/* FounderOS — window manager
 * Vanilla JS. Pointer Events unify mouse + touch for drag/resize.
 * State lives on each window's DOM node; z-index counter drives focus.
 */
(function () {
  "use strict";

  const TASKBAR_H = 56;
  const MIN_W = 300;
  const MIN_H = 180;

  const WM = {
    windows: new Map(), // id -> record
    z: 10,
    activeId: null,
    seq: 0,
    onChange: null, // callback (fired when taskbar needs a redraw)
  };

  function notify() {
    if (typeof WM.onChange === "function") WM.onChange();
  }

  function bringToFront(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    WM.z += 1;
    rec.el.style.zIndex = WM.z;
    if (WM.activeId && WM.windows.has(WM.activeId)) {
      WM.windows.get(WM.activeId).el.classList.remove("is-active");
    }
    rec.el.classList.add("is-active");
    WM.activeId = id;
    notify();
  }

  function clampIntoView(rec) {
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - TASKBAR_H - 40;
    rec.x = Math.min(Math.max(rec.x, -rec.w + 120), maxX);
    rec.y = Math.min(Math.max(rec.y, 0), maxY);
  }

  function applyGeom(rec) {
    const el = rec.el;
    if (rec.maximized) {
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.width = "100vw";
      el.style.height = `calc(100vh - ${TASKBAR_H}px)`;
    } else {
      el.style.left = rec.x + "px";
      el.style.top = rec.y + "px";
      el.style.width = rec.w + "px";
      el.style.height = rec.h + "px";
    }
  }

  // ---- drag ----
  function startDrag(rec, ev) {
    if (rec.maximized) return;
    ev.preventDefault();
    bringToFront(rec.id);
    const el = rec.el;
    el.style.transition = "none";
    const offX = ev.clientX - rec.x;
    const offY = ev.clientY - rec.y;
    const pid = ev.pointerId;
    el.classList.add("is-dragging");

    function move(e) {
      rec.x = e.clientX - offX;
      rec.y = Math.max(0, e.clientY - offY);
      el.style.left = rec.x + "px";
      el.style.top = rec.y + "px";
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.style.transition = "";
      el.classList.remove("is-dragging");
      clampIntoView(rec);
      applyGeom(rec);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    try { el.setPointerCapture && el.setPointerCapture(pid); } catch (_) {}
  }

  // ---- resize ----
  function startResize(rec, dir, ev) {
    if (rec.maximized) return;
    ev.preventDefault();
    ev.stopPropagation();
    bringToFront(rec.id);
    const el = rec.el;
    el.style.transition = "none";
    const sx = ev.clientX, sy = ev.clientY;
    const sw = rec.w, sh = rec.h, sX = rec.x, sY = rec.y;

    function move(e) {
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      let w = sw, h = sh, x = sX, y = sY;
      if (dir.includes("e")) w = Math.max(MIN_W, sw + dx);
      if (dir.includes("s")) h = Math.max(MIN_H, sh + dy);
      if (dir.includes("w")) { w = Math.max(MIN_W, sw - dx); x = sX + (sw - w); }
      if (dir.includes("n")) { h = Math.max(MIN_H, sh - dy); y = Math.max(0, sY + (sh - h)); }
      rec.w = w; rec.h = h; rec.x = x; rec.y = y;
      el.style.width = w + "px";
      el.style.height = h + "px";
      el.style.left = x + "px";
      el.style.top = y + "px";
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.style.transition = "";
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const RESIZE_DIRS = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

  // ---- public: open a window ----
  function open(opts) {
    // opts: { appId, title, badge, render(bodyEl), width, height }
    // If a window for this appId already exists, just focus/restore it.
    for (const rec of WM.windows.values()) {
      if (rec.appId === opts.appId) {
        restore(rec.id);
        bringToFront(rec.id);
        return rec.id;
      }
    }

    WM.seq += 1;
    const id = "win-" + WM.seq;
    const el = document.createElement("section");
    el.className = "window window--enter";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", opts.title);
    el.dataset.appId = opts.appId;

    const w = opts.width || 560;
    const h = opts.height || 420;
    // cascade placement
    const idx = WM.windows.size;
    const x = Math.max(24, Math.round((window.innerWidth - w) / 2) + idx * 26 - 60);
    const y = Math.max(24, Math.round((window.innerHeight - TASKBAR_H - h) / 2) + idx * 22 - 50);

    el.innerHTML = `
      <header class="window__bar">
        <div class="window__lights">
          <button class="light light--close"  aria-label="Close"></button>
          <button class="light light--min"    aria-label="Minimize"></button>
          <button class="light light--max"    aria-label="Maximize"></button>
        </div>
        <div class="window__title">
          ${opts.badge ? `<span class="window__badge">${opts.badge}</span>` : ""}
          <span>${opts.title}</span>
        </div>
        <div class="window__bar-spacer"></div>
      </header>
      <div class="window__body"></div>
      ${RESIZE_DIRS.map((d) => `<span class="rz rz--${d}" data-dir="${d}"></span>`).join("")}
    `;

    const rec = {
      id, appId: opts.appId, el,
      title: opts.title, badge: opts.badge || "",
      x, y, w, h, maximized: false, minimized: false,
    };
    WM.windows.set(id, rec);
    document.getElementById("windows").appendChild(el);
    applyGeom(rec);

    // wire controls
    const bar = el.querySelector(".window__bar");
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".light")) return;
      startDrag(rec, e);
    });
    bar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".light")) return;
      toggleMax(id);
    });
    el.querySelector(".light--close").addEventListener("click", (e) => { e.stopPropagation(); close(id); });
    el.querySelector(".light--min").addEventListener("click", (e) => { e.stopPropagation(); minimize(id); });
    el.querySelector(".light--max").addEventListener("click", (e) => { e.stopPropagation(); toggleMax(id); });
    el.addEventListener("pointerdown", () => bringToFront(id));
    el.querySelectorAll(".rz").forEach((handle) => {
      handle.addEventListener("pointerdown", (e) => startResize(rec, handle.dataset.dir, e));
    });

    // render content
    const body = el.querySelector(".window__body");
    if (typeof opts.render === "function") opts.render(body, rec);

    bringToFront(id);
    // remove enter class after animation
    setTimeout(() => el.classList.remove("window--enter"), 260);
    notify();
    return id;
  }

  function close(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    rec.el.classList.add("window--exit");
    setTimeout(() => {
      rec.el.remove();
      WM.windows.delete(id);
      if (WM.activeId === id) WM.activeId = null;
      notify();
    }, 150);
  }

  function minimize(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    rec.minimized = true;
    rec.el.classList.add("is-minimized");
    if (WM.activeId === id) {
      rec.el.classList.remove("is-active");
      WM.activeId = null;
    }
    notify();
  }

  function restore(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    rec.minimized = false;
    rec.el.classList.remove("is-minimized");
    notify();
  }

  function toggleMin(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    if (rec.minimized) { restore(id); bringToFront(id); }
    else if (WM.activeId === id) minimize(id);
    else bringToFront(id);
  }

  function toggleMax(id) {
    const rec = WM.windows.get(id);
    if (!rec) return;
    rec.maximized = !rec.maximized;
    rec.el.classList.toggle("is-maximized", rec.maximized);
    applyGeom(rec);
    bringToFront(id);
  }

  function list() {
    return Array.from(WM.windows.values());
  }

  window.FounderWM = { open, close, minimize, restore, toggleMin, toggleMax, bringToFront, list, get activeId() { return WM.activeId; }, set onChange(fn) { WM.onChange = fn; } };
})();
