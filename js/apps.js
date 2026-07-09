/* FounderOS — app registry
 * Each app is a real product one-pager. `color` is the app's signature accent
 * (the OS chrome uses the system orange; each app carries its own brand color).
 */
(function () {
  "use strict";

  function onePager(a) {
    const stats = a.stats
      .map((s) => `<div class="stat"><b>${s.k}</b><span>${s.v}</span></div>`)
      .join("");
    const points = a.points.map((p) => `<li>${p}</li>`).join("");
    return `
      <article class="op" style="--app:${a.color}; --app-soft:${a.colorSoft};">
        <header class="op__head">
          <div class="op__logo">${a.badge}</div>
          <div class="op__id">
            <h1 class="op__name">${a.name}</h1>
            <p class="op__tag">${a.tagline}</p>
          </div>
          <span class="op__status">${a.status}</span>
        </header>

        <div class="op__stats">${stats}</div>

        <section class="op__block">
          <h2>The problem</h2>
          <p>${a.problem}</p>
        </section>

        <section class="op__block">
          <h2>What it does</h2>
          <p>${a.what}</p>
        </section>

        <ul class="op__points">${points}</ul>

        <footer class="op__foot">
          <span class="op__chip">${a.category}</span>
          <span class="op__by">a project by Akshith Paluru</span>
        </footer>
      </article>`;
  }

  const APPS = [
    {
      id: "driplyft",
      name: "DripLyft",
      badge: "DL",
      color: "#38bdf8",
      colorSoft: "rgba(56,189,248,0.14)",
      category: "Robotics · Proptech",
      tagline: "Autonomous drones that clean high-rise glass — no rope, no rig, no one at height.",
      status: "Prototype",
      width: 620, height: 560,
      stats: [
        { k: "3×", v: "faster than rope-access crews" },
        { k: "0", v: "people working at height" },
        { k: "24/7", v: "self-scheduling from a ground dock" },
      ],
      problem:
        "High-rise window cleaning still means rope-access crews, scaffolding, and serious insurance. It's slow, dangerous, weather-dependent, and one of the last building-maintenance jobs that hasn't been automated.",
      what:
        "DripLyft is a docked drone that maps a facade with computer vision, plans a cleaning path pane-by-pane, and runs a metered water-fed head across the glass. It launches from a ground station, cleans, and returns to charge — keeping every human safely on the ground.",
      points: [
        "Vision-based facade mapping and pane-by-pane path planning",
        "Closed-loop water metering so it never over- or under-sprays",
        "Ground-station docking, charging, and self-scheduling",
        "Targeting mid-rise offices first, then taller towers",
      ],
      tagline_short: "Autonomous drone window cleaning",
    },
    {
      id: "shieldeye",
      name: "ShieldEye",
      badge: "SE",
      color: "#a78bfa",
      colorSoft: "rgba(167,139,250,0.14)",
      category: "Applied AI · Retail",
      tagline: "Real-time shrink detection that flags theft as it happens — not in the after-report.",
      status: "In training",
      width: 620, height: 560,
      stats: [
        { k: "<2s", v: "from behavior to staff alert" },
        { k: "0", v: "facial recognition, ever" },
        { k: "100%", v: "runs on existing CCTV" },
      ],
      problem:
        "Retail shrink costs stores billions a year, and most of it is caught too late. CCTV is reactive — someone reviews the footage after the product is already gone.",
      what:
        "ShieldEye is a vision model that watches existing camera feeds for concealment and theft behaviors — not faces — and pushes a live alert to floor staff the moment it sees one. Inference runs on-site, so raw footage never has to leave the store.",
      points: [
        "Behavior-based detection, not identity — no face database",
        "Drops onto the cameras a store already has",
        "Live alerts to staff phones or the back office",
        "Edge inference keeps footage private and latency low",
      ],
      tagline_short: "AI retail theft detection",
    },
    {
      id: "sitesmith",
      name: "SiteSmith PM",
      badge: "SS",
      color: "#f59e0b",
      colorSoft: "rgba(245,158,11,0.15)",
      category: "Studio · Services",
      tagline: "Fast, honest websites for small businesses that got quoted $8k and then ghosted.",
      status: "Taking clients",
      width: 620, height: 560,
      stats: [
        { k: "Days", v: "to live, not months" },
        { k: "Flat", v: "pricing with no surprises" },
        { k: "∞", v: "small edits included" },
      ],
      problem:
        "Local businesses either overpay a big agency for a slow, bloated site — or get a template dump with no support and no one who picks up the phone afterward.",
      what:
        "SiteSmith is a lean web studio: a real, fast site in days at transparent flat pricing, with ongoing edits included. The 'PM' is the project-management layer that keeps the build honest, on-time, and easy to hand off.",
      points: [
        "Flat, upfront pricing — no scope-creep invoices",
        "Live in days, built to actually rank and convert",
        "Ongoing small edits are part of the deal",
        "Local-first: real support from a real person",
      ],
      tagline_short: "Web design for small businesses",
    },
    {
      id: "ecosewa",
      name: "EcoSewa",
      badge: "ES",
      color: "#34d399",
      colorSoft: "rgba(52,211,153,0.14)",
      category: "Nonprofit · Sustainability",
      tagline: "A reusable-dishware library for community events — borrow, wash, return, skip the landfill.",
      status: "Piloting",
      width: 620, height: 560,
      stats: [
        { k: "0", v: "single-use plates per event" },
        { k: "Deposit", v: "backed, so nothing walks off" },
        { k: "Community", v: "run and community-owned" },
      ],
      problem:
        "Every community event leaves a mountain of single-use plates and cups. Renting real dishware is pricey, buying it is wasteful, and most organizers just default to plastic.",
      what:
        "EcoSewa (\"sewa\" = service) is a nonprofit lending library for reusable place settings. Organizers check out a set for an event, use it, and wash-and-return it against a small refundable deposit — diverting waste and cutting cost at the same time.",
      points: [
        "Free-to-low-cost lending for local events",
        "Refundable deposit keeps the inventory accountable",
        "Wash-and-return logistics handled by volunteers",
        "Tracks waste diverted per event to show real impact",
      ],
      tagline_short: "Reusable dishware lending",
    },
  ];

  const byId = {};
  APPS.forEach((a) => {
    a.tagline = a.tagline; // keep full tagline for one-pager
    a.render = (body) => { body.innerHTML = onePager(a); };
    byId[a.id] = a;
  });

  function launch(id) {
    const app = byId[id];
    if (!app) return null;
    return window.FounderWM.open({
      appId: app.id,
      title: app.name,
      badge: app.badge,
      accent: app.color,
      width: app.width,
      height: app.height,
      render: app.render,
    });
  }

  window.FounderApps = { list: APPS, byId, launch };
})();
