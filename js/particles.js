/* FounderOS — ambient desktop FX: slow-drifting glowing motes in the accent color.
 * Purely atmospheric, sits behind icons and windows. Pauses on reduce-motion / hidden tab.
 */
(function () {
  "use strict";

  function accentRGB() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
    return v || "255,122,69";
  }

  function init() {
    const canvas = document.getElementById("fx");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let motes = [];
    let raf = null;
    let running = false;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(46, (W * H) / 42000));
      motes = [];
      for (let i = 0; i < count; i++) motes.push(spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 20,
        r: 0.8 + Math.random() * 2.6,
        vy: 0.15 + Math.random() * 0.55,
        vx: (Math.random() - 0.5) * 0.25,
        a: 0.06 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2, // twinkle phase
        tws: 0.008 + Math.random() * 0.02,
      };
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const rgb = accentRGB();
      for (const m of motes) {
        m.y -= m.vy;
        m.x += m.vx;
        m.tw += m.tws;
        if (m.y < -20 || m.x < -30 || m.x > W + 30) Object.assign(m, spawn(false));
        const a = m.a * (0.6 + 0.4 * Math.sin(m.tw));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      if (document.documentElement.hasAttribute("data-reduce-motion")) { ctx.clearRect(0, 0, W, H); return; }
      running = true; raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
    if (window.FounderOS) window.FounderOS.onChange(() => { /* accent picked up live each frame */ });

    resize();
    start();
    window.FounderParticles = { start, stop, resize };
  }

  window.FounderFX = { init };
})();
