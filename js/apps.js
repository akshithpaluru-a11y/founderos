/* FounderOS — app registry
 * Checkpoint 1: window shells + placeholder content.
 * Real one-pager content and the Terminal arrive in later checkpoints.
 */
(function () {
  "use strict";

  const APPS = [
    {
      id: "driplyft",
      name: "DripLyft",
      badge: "DL",
      tagline: "Autonomous drone window cleaning",
      width: 560, height: 440,
      render(body) {
        body.innerHTML = `
          <div class="pane">
            <h1>DripLyft</h1>
            <p>Autonomous drone window cleaning for high-rise buildings.</p>
            <p class="muted">Placeholder — full one-pager lands in checkpoint 2.</p>
          </div>`;
      },
    },
    {
      id: "shieldeye",
      name: "ShieldEye",
      badge: "SE",
      tagline: "AI retail theft detection",
      width: 560, height: 440,
      render(body) {
        body.innerHTML = `
          <div class="pane">
            <h1>ShieldEye</h1>
            <p>AI-powered retail theft detection.</p>
            <p class="muted">Placeholder — full one-pager lands in checkpoint 2.</p>
          </div>`;
      },
    },
    {
      id: "sitesmith",
      name: "SiteSmith PM",
      badge: "SS",
      tagline: "Web design for small businesses",
      width: 560, height: 440,
      render(body) {
        body.innerHTML = `
          <div class="pane">
            <h1>SiteSmith PM</h1>
            <p>A web design agency for small businesses.</p>
            <p class="muted">Placeholder — full one-pager lands in checkpoint 2.</p>
          </div>`;
      },
    },
    {
      id: "ecosewa",
      name: "EcoSewa",
      badge: "ES",
      tagline: "Reusable dishware lending",
      width: 560, height: 440,
      render(body) {
        body.innerHTML = `
          <div class="pane">
            <h1>EcoSewa</h1>
            <p>Nonprofit reusable dishware lending for events.</p>
            <p class="muted">Placeholder — full one-pager lands in checkpoint 2.</p>
          </div>`;
      },
    },
  ];

  const byId = {};
  APPS.forEach((a) => (byId[a.id] = a));

  function launch(id) {
    const app = byId[id];
    if (!app) return null;
    return window.FounderWM.open({
      appId: app.id,
      title: app.name,
      badge: app.badge,
      width: app.width,
      height: app.height,
      render: app.render,
    });
  }

  window.FounderApps = { list: APPS, byId, launch };
})();
