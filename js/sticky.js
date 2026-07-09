/* FounderOS — desktop sticky note. Draggable, editable, remembers what you wrote. */
(function () {
  "use strict";

  const KEY_TEXT = "founderos.sticky.text.v1";
  const KEY_POS = "founderos.sticky.pos.v1";
  const DEFAULT =
    "todo —\n" +
    "✓ ship FounderOS\n" +
    "• DripLyft demo video\n" +
    "• email 2 pilot buildings\n" +
    "• sleep (maybe)";

  function loadText() { try { const v = localStorage.getItem(KEY_TEXT); return v === null ? DEFAULT : v; } catch (_) { return DEFAULT; } }
  function saveText(v) { try { localStorage.setItem(KEY_TEXT, v); } catch (_) {} }
  function loadPos() { try { return JSON.parse(localStorage.getItem(KEY_POS) || "null"); } catch (_) { return null; } }
  function savePos(p) { try { localStorage.setItem(KEY_POS, JSON.stringify(p)); } catch (_) {} }

  function init() {
    const note = document.getElementById("sticky");
    const body = note.querySelector(".sticky__body");
    body.textContent = loadText();

    // position: saved, or default top-right of the desktop
    const pos = loadPos();
    if (pos) { note.style.left = pos.x + "px"; note.style.top = pos.y + "px"; note.style.right = "auto"; }
    else { note.style.right = "34px"; note.style.top = "40px"; }
    note.hidden = false;

    // persist edits
    let t = null;
    body.addEventListener("input", () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => saveText(body.textContent), 300);
    });

    // drag from the note chrome / pin strip; clicking the text just edits it
    note.addEventListener("pointerdown", (e) => {
      if (e.target === body) return; // typing area — leave it alone
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      const r = note.getBoundingClientRect();
      const desk = document.getElementById("desktop").getBoundingClientRect();
      const offX = startX - r.left, offY = startY - r.top;
      note.classList.add("is-dragging");
      note.style.right = "auto";
      function move(ev) {
        const x = Math.max(0, Math.min(desk.width - 60, ev.clientX - offX));
        const y = Math.max(0, Math.min(desk.height - 40, ev.clientY - offY - desk.top));
        note.style.left = x + "px";
        note.style.top = y + "px";
      }
      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        note.classList.remove("is-dragging");
        savePos({ x: parseInt(note.style.left), y: parseInt(note.style.top) });
      }
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }

  window.FounderSticky = { init };
})();
