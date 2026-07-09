/* FounderOS — Traction. An animated founder dashboard.
 * Numbers are illustrative sample data (no backend) — labeled as such.
 */
(function () {
  "use strict";

  const STATS = [
    { k: "days_building", label: "Days building", value: 214, suffix: "" },
    { k: "shipping", label: "Products shipping", value: 4, suffix: "" },
    { k: "commits", label: "Commits this week", value: 37, suffix: "" },
    { k: "coffee", label: "Coffees", value: 189, suffix: " ☕" },
  ];

  // momentum series (0..100), one smooth-ish upward curve
  const SERIES = [8, 14, 12, 22, 30, 27, 38, 46, 44, 58, 66, 72, 70, 84, 92];

  const BARS = [
    { name: "DripLyft", color: "#38bdf8", pct: 62, note: "prototype" },
    { name: "ShieldEye", color: "#a78bfa", pct: 45, note: "in training" },
    { name: "SiteSmith PM", color: "#f59e0b", pct: 78, note: "taking clients" },
    { name: "EcoSewa", color: "#34d399", pct: 40, note: "piloting" },
  ];

  function areaPath(series, w, h, pad) {
    const max = 100;
    const n = series.length;
    const x = (i) => pad + (i / (n - 1)) * (w - pad * 2);
    const y = (v) => h - pad - (v / max) * (h - pad * 2);
    let d = `M ${x(0).toFixed(1)} ${y(series[0]).toFixed(1)}`;
    for (let i = 1; i < n; i++) {
      const xc = (x(i - 1) + x(i)) / 2;
      d += ` Q ${xc.toFixed(1)} ${y(series[i - 1]).toFixed(1)} ${x(i).toFixed(1)} ${y(series[i]).toFixed(1)}`;
    }
    const line = d;
    const area = d + ` L ${x(n - 1).toFixed(1)} ${(h - pad).toFixed(1)} L ${x(0).toFixed(1)} ${(h - pad).toFixed(1)} Z`;
    return { line, area, lastX: x(n - 1), lastY: y(series[n - 1]) };
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function mount(body, rec) {
    const W = 560, H = 190, PAD = 14;
    const p = areaPath(SERIES, W, H, PAD);

    body.innerHTML = `
      <div class="dash">
        <header class="dash__head">
          <div>
            <h1>Traction</h1>
            <p>A founder's-eye view of the build. <span class="dash__note">illustrative sample data</span></p>
          </div>
          <span class="dash__live"><span class="dot"></span>live</span>
        </header>

        <div class="dash__stats">
          ${STATS.map((s) => `
            <div class="dstat">
              <b class="dstat__num" data-to="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</b>
              <span class="dstat__label">${s.label}</span>
            </div>`).join("")}
        </div>

        <section class="dash__chart">
          <div class="dash__chart-head"><h2>Momentum</h2><span>last 15 weeks</span></div>
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="spark">
            <defs>
              <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                <stop class="spark__stop-a" offset="0%" stop-opacity="0.35"/>
                <stop class="spark__stop-b" offset="100%" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path class="spark__area" d="${p.area}" fill="url(#dashFill)" opacity="0"/>
            <path class="spark__line" d="${p.line}" fill="none" stroke-width="2.5" stroke-linecap="round"/>
            <circle class="spark__dot" cx="${p.lastX.toFixed(1)}" cy="${p.lastY.toFixed(1)}" r="4"/>
          </svg>
        </section>

        <section class="dash__bars">
          <div class="dash__chart-head"><h2>Per-project progress</h2><span>toward next milestone</span></div>
          ${BARS.map((b) => `
            <div class="dbar" style="--c:${b.color}">
              <span class="dbar__name">${b.name}</span>
              <span class="dbar__track"><span class="dbar__fill" data-pct="${b.pct}"></span></span>
              <span class="dbar__val">${b.pct}%<small>${b.note}</small></span>
            </div>`).join("")}
        </section>
      </div>`;

    // animate the line draw
    const line = body.querySelector(".spark__line");
    if (line && line.getTotalLength) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      requestAnimationFrame(() => {
        line.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)";
        line.style.strokeDashoffset = "0";
      });
    }
    const area = body.querySelector(".spark__area");
    if (area) { requestAnimationFrame(() => { area.style.transition = "opacity .9s ease .3s"; area.style.opacity = "1"; }); }

    // animate counters
    const nums = body.querySelectorAll(".dstat__num");
    const start = performance.now();
    const DUR = 900;
    function step(now) {
      const t = Math.min(1, (now - start) / DUR);
      const e = easeOut(t);
      nums.forEach((el) => {
        const to = +el.dataset.to;
        const suf = el.dataset.suffix || "";
        el.textContent = Math.round(to * e) + suf;
      });
      if (t < 1 && document.body.contains(body)) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // animate bars
    setTimeout(() => {
      body.querySelectorAll(".dbar__fill").forEach((f, i) => {
        setTimeout(() => { f.style.width = f.dataset.pct + "%"; }, i * 90);
      });
    }, 250);
  }

  window.FounderDashboard = { mount };
})();
