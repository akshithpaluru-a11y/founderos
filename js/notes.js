/* FounderOS — Idea Pad. A real notepad that autosaves to localStorage. */
(function () {
  "use strict";

  const KEY = "founderos.notes.v1";
  const SEED =
    "# Idea Pad\n\n" +
    "Quick-capture for whatever I'm chewing on. This autosaves to your browser —\n" +
    "type something, refresh, it's still here.\n\n" +
    "- [ ] DripLyft: cut the facade-mapping pass time in half\n" +
    "- [ ] ShieldEye: line up a design-partner store for the pilot\n" +
    "- [ ] SiteSmith: template the intake so onboarding is one call\n" +
    "- [ ] EcoSewa: find a second event to pilot the deposit flow\n";

  function load() { try { const v = localStorage.getItem(KEY); return v === null ? SEED : v; } catch (_) { return SEED; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (_) {} }

  function mount(body) {
    body.innerHTML = `
      <div class="notes">
        <div class="notes__bar">
          <span class="notes__title">Idea Pad</span>
          <span class="notes__status" id="notes-status">saved</span>
          <span class="notes__spacer"></span>
          <span class="notes__count" id="notes-count"></span>
          <button class="notes__clear" id="notes-clear">clear</button>
        </div>
        <textarea class="notes__area" id="notes-area" spellcheck="false" placeholder="Start typing…"></textarea>
      </div>`;

    const area = body.querySelector("#notes-area");
    const status = body.querySelector("#notes-status");
    const count = body.querySelector("#notes-count");
    area.value = load();

    let t = null;
    function updateCount() {
      const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
      count.textContent = `${words} word${words === 1 ? "" : "s"}`;
    }
    updateCount();

    area.addEventListener("input", () => {
      status.textContent = "saving…";
      status.classList.add("is-saving");
      updateCount();
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        save(area.value);
        status.textContent = "saved";
        status.classList.remove("is-saving");
      }, 350);
    });

    body.querySelector("#notes-clear").addEventListener("click", () => {
      area.value = "";
      save("");
      updateCount();
      status.textContent = "cleared";
      area.focus();
    });

    setTimeout(() => area.focus(), 60);
  }

  window.FounderNotes = { mount };
})();
