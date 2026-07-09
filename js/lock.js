/* FounderOS — lock screen. No password: Enter or click unlocks. Fully public. */
(function () {
  "use strict";

  let onUnlockCb = null;
  let clockTimer = null;

  function updateClock() {
    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ap = now.getHours() < 12 ? "AM" : "PM";
    const time = document.getElementById("lock-time");
    const date = document.getElementById("lock-date");
    if (time) time.textContent = `${hh}:${mm} ${ap}`;
    if (date) date.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }

  function unlock() {
    const lock = document.getElementById("lock");
    if (!lock || lock.classList.contains("lock--out")) return;
    lock.classList.add("lock--out");
    if (clockTimer) clearInterval(clockTimer);
    setTimeout(() => {
      lock.hidden = true;
      lock.classList.remove("lock--out");
      if (typeof onUnlockCb === "function") onUnlockCb();
    }, 620);
  }

  function show(cb) {
    onUnlockCb = cb;
    const lock = document.getElementById("lock");
    lock.hidden = false;
    updateClock();
    clockTimer = setInterval(updateClock, 5000);

    requestAnimationFrame(() => lock.classList.add("lock--in"));

    const form = document.getElementById("lock-form");
    const input = document.getElementById("lock-input");
    form.addEventListener("submit", (e) => { e.preventDefault(); unlock(); });
    // click anywhere (except the input/button) also unlocks
    lock.addEventListener("click", (e) => {
      if (e.target.closest(".lock__form")) return;
      unlock();
    });
    document.addEventListener("keydown", function onKey(e) {
      if (document.getElementById("lock").hidden) { document.removeEventListener("keydown", onKey); return; }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); unlock(); }
    });
    setTimeout(() => input && input.focus(), 400);
  }

  window.FounderLock = { show, lock: (cb) => show(cb) };
})();
