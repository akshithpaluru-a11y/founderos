/* FounderOS — Arcade: ROUNDS, a 2048-style merge game themed as funding rounds.
 * Merge matching rounds to advance: Idea → Seed → Series A → … → IPO.
 */
(function () {
  "use strict";

  const KEY_BEST = "founderos.rounds.best.v1";
  const SIZE = 4;

  const STAGES = {
    2: "Idea", 4: "Pre-seed", 8: "Seed", 16: "Angel", 32: "Series A",
    64: "Series B", 128: "Series C", 256: "Series D", 512: "Growth",
    1024: "Unicorn", 2048: "IPO", 4096: "Legend", 8192: "Dynasty",
  };
  const COLORS = {
    2: "#262c3b", 4: "#2f3a52", 8: "#37527d", 16: "#3a6ea6", 32: "#3f8bc4",
    64: "#f0a93a", 128: "#f59e0b", 256: "#f5843c", 512: "#ff7a45",
    1024: "#ff5f7a", 2048: "#ffd166", 4096: "#e879f9", 8192: "#a78bfa",
  };

  function loadBest() { try { return +localStorage.getItem(KEY_BEST) || 0; } catch (_) { return 0; } }
  function saveBest(v) { try { localStorage.setItem(KEY_BEST, v); } catch (_) {} }

  function mount(body) {
    let grid, score, best = loadBest(), won = false, over = false;
    let newCells = new Set(), mergedCells = new Set();

    body.innerHTML = `
      <div class="arc">
        <div class="arc__top">
          <div class="arc__title"><b>ROUNDS</b><span>merge rounds → reach IPO</span></div>
          <div class="arc__scores">
            <div class="arc__score"><small>SCORE</small><b id="arc-score">0</b></div>
            <div class="arc__score"><small>BEST</small><b id="arc-best">${best}</b></div>
          </div>
        </div>
        <div class="arc__board" id="arc-board"></div>
        <div class="arc__foot">
          <span class="arc__hint">arrow keys / WASD · swipe on touch</span>
          <button class="arc__new" id="arc-new">new run</button>
        </div>
        <div class="arc__overlay" id="arc-overlay" hidden></div>
      </div>`;

    const boardEl = body.querySelector("#arc-board");
    const scoreEl = body.querySelector("#arc-score");
    const bestEl = body.querySelector("#arc-best");
    const overlay = body.querySelector("#arc-overlay");

    function empty() { return grid.flatMap((r, y) => r.map((v, x) => (v ? null : [y, x]))).filter(Boolean); }
    function addTile() {
      const cells = empty();
      if (!cells.length) return;
      const [y, x] = cells[Math.floor(Math.random() * cells.length)];
      grid[y][x] = Math.random() < 0.9 ? 2 : 4;
      newCells.add(y * SIZE + x);
    }
    function reset() {
      grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      score = 0; won = false; over = false;
      newCells = new Set(); mergedCells = new Set();
      addTile(); addTile();
      render();
    }

    function render() {
      boardEl.innerHTML = "";
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
        const v = grid[y][x];
        const cell = document.createElement("div");
        cell.className = "arc__cell";
        if (v) {
          const t = document.createElement("div");
          const idx = y * SIZE + x;
          t.className = "arc__tile" + (newCells.has(idx) ? " is-new" : "") + (mergedCells.has(idx) ? " is-merged" : "");
          const c = COLORS[v] || "#ffd166";
          t.style.background = `linear-gradient(155deg, ${c}, ${shade(c, -18)})`;
          if (v >= 64) t.style.boxShadow = `0 6px 18px ${c}55, inset 0 1px 0 rgba(255,255,255,.25)`;
          t.style.color = v <= 8 ? "#cfd3de" : (v === 2048 ? "#3a2e00" : "#fff");
          const label = STAGES[v] || v;
          t.innerHTML = `<span class="arc__val" style="font-size:${labelSize(label)}px">${label}</span>`;
          cell.appendChild(t);
        }
        boardEl.appendChild(cell);
      }
      scoreEl.textContent = score;
      if (score > best) { best = score; saveBest(best); bestEl.textContent = best; }
      newCells = new Set(); mergedCells = new Set();
    }

    function labelSize(l) { const s = String(l).length; return s <= 4 ? 20 : s <= 6 ? 15 : s <= 8 ? 12.5 : 11; }

    // slide+merge one row toward the left; returns {row, moved, gained, merges:[newIndexInRow]}
    function slide(row) {
      const nums = row.filter((v) => v);
      const out = [];
      const merges = [];
      let gained = 0;
      for (let i = 0; i < nums.length; i++) {
        if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
          const merged = nums[i] * 2;
          out.push(merged); gained += merged; merges.push(out.length - 1);
          if (merged === 2048) won = true;
          i++;
        } else out.push(nums[i]);
      }
      while (out.length < SIZE) out.push(0);
      const moved = out.some((v, i) => v !== row[i]);
      return { row: out, moved, gained, merges };
    }

    function move(dir) {
      if (over) return;
      // rotate grid so every move is a "left" move, then rotate back
      let g = grid.map((r) => r.slice());
      const rot = { left: 0, up: 3, right: 2, down: 1 }[dir];
      for (let i = 0; i < rot; i++) g = rotateCW(g);
      let moved = false, gained = 0;
      const mergedRC = [];
      g = g.map((row, y) => {
        const s = slide(row);
        if (s.moved) moved = true;
        gained += s.gained;
        s.merges.forEach((x) => mergedRC.push([y, x]));
        return s.row;
      });
      for (let i = 0; i < (4 - rot) % 4; i++) g = rotateCW(g);
      // map merged coords back through the rotations
      mergedCells = new Set(mergedRC.map(([y, x]) => {
        let py = y, px = x;
        for (let i = 0; i < (4 - rot) % 4; i++) { const t = px; px = py; py = SIZE - 1 - t; }
        return py * SIZE + px;
      }));
      if (!moved) return;
      grid = g; score += gained;
      addTile();
      render();
      if (won && !over) { showOverlay("IPO! 🎉", "You took a scrappy idea all the way to the public markets.", true); }
      else if (!empty().length && noMoves()) { over = true; showOverlay("Down round 💀", "No moves left. That's the game — hit “new run”.", false); }
    }

    function noMoves() {
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
        if (x + 1 < SIZE && grid[y][x] === grid[y][x + 1]) return false;
        if (y + 1 < SIZE && grid[y][x] === grid[y + 1][x]) return false;
      }
      return true;
    }
    function showOverlay(title, sub, win) {
      overlay.innerHTML = `<div class="arc__result ${win ? "is-win" : ""}"><h2>${title}</h2><p>${sub}</p><button id="arc-again">${win ? "keep going" : "new run"}</button></div>`;
      overlay.hidden = false;
      overlay.querySelector("#arc-again").addEventListener("click", () => { overlay.hidden = true; if (!win) reset(); });
    }

    // input — only when this window is the active one
    function onKey(e) {
      if (!boardEl.isConnected) { document.removeEventListener("keydown", onKey); return; }
      const win = boardEl.closest(".window");
      if (!win || !win.classList.contains("is-active")) return;
      const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", d: "right", w: "up", s: "down" };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir); }
    }
    document.addEventListener("keydown", onKey);

    // touch swipe
    let sx = 0, sy = 0;
    boardEl.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
    boardEl.addEventListener("pointerup", (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    });

    body.querySelector("#arc-new").addEventListener("click", () => { overlay.hidden = true; reset(); });
    reset();
    setTimeout(() => { const w = boardEl.closest(".window"); if (w) w.focus && w.focus(); }, 40);
  }

  function rotateCW(g) {
    const n = g.length;
    const r = Array.from({ length: n }, () => Array(n).fill(0));
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) r[x][n - 1 - y] = g[y][x];
    return r;
  }
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.min(255, r + pct)); g = Math.max(0, Math.min(255, g + pct)); b = Math.max(0, Math.min(255, b + pct));
    return `rgb(${r},${g},${b})`;
  }

  window.FounderArcade = { mount };
})();
