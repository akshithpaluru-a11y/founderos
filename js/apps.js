/* FounderOS — app registry
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  WANT TO ADD A PROJECT?  It's one step.                                    │
 * │  Copy the template block below, paste it into the PROJECTS array, and      │
 * │  fill in the fields. That's it — it automatically becomes a desktop icon,  │
 * │  a window, a Start-menu entry, a command-palette result, and an            │
 * │  `open <id>` terminal command. No other file needs to change.              │
 * │                                                                            │
 * │  TEMPLATE — paste this and edit:                                           │
 * │  {                                                                          │
 * │    id: "myproject",              // lowercase, no spaces (used in URLs/cli) │
 * │    name: "My Project",                                                      │
 * │    badge: "MP",                 // 2 chars shown on the icon tile           │
 * │    color: "#38bdf8",            // the project's signature color            │
 * │    category: "Category · Tag",                                             │
 * │    status: "Prototype",         // small pill, top-right of the window      │
 * │    tagline: "One punchy line about what it is.",                            │
 * │    stats: [                      // exactly three                           │
 * │      { k: "3×", v: "some proof point" },                                    │
 * │      { k: "0",  v: "another proof point" },                                 │
 * │      { k: "∞",  v: "a third proof point" },                                 │
 * │    ],                                                                        │
 * │    problem: "The pain you're solving, in 1–2 sentences.",                   │
 * │    what: "How your thing solves it, in 2–3 sentences.",                     │
 * │    points: [ "key point", "key point", "key point", "key point" ],          │
 * │  },                                                                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════════════════════
  //  YOUR PROJECTS  — add / edit / reorder freely
  // ═══════════════════════════════════════════════════════════════════════
  const PROJECTS = [
    {
      id: "driplyft",
      name: "DripLyft",
      badge: "DL",
      color: "#38bdf8",
      category: "Robotics · Proptech",
      status: "Prototype",
      tagline: "Autonomous drones that clean high-rise glass — no rope, no rig, no one at height.",
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
    },
    {
      id: "shieldeye",
      name: "ShieldEye",
      badge: "SE",
      color: "#a78bfa",
      category: "Applied AI · Retail",
      status: "In training",
      tagline: "Real-time shrink detection that flags theft as it happens — not in the after-report.",
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
    },
    {
      id: "sitesmith",
      name: "SiteSmith PM",
      badge: "SS",
      color: "#f59e0b",
      category: "Studio · Services",
      status: "Taking clients",
      tagline: "Fast, honest websites for small businesses that got quoted $8k and then ghosted.",
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
    },
    {
      id: "ecosewa",
      name: "EcoSewa",
      badge: "ES",
      color: "#34d399",
      category: "Nonprofit · Sustainability",
      status: "Piloting",
      tagline: "A reusable-dishware library for community events — borrow, wash, return, skip the landfill.",
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
    },
  ];
  // ═══════════════════════════════════════════════════════════════════════

  // hex -> soft rgba for glows/tints (auto-derived so projects only set `color`)
  function soft(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function onePager(a) {
    const stats = a.stats.map((s) => `<div class="stat"><b>${s.k}</b><span>${s.v}</span></div>`).join("");
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
        <section class="op__block"><h2>The problem</h2><p>${a.problem}</p></section>
        <section class="op__block"><h2>What it does</h2><p>${a.what}</p></section>
        <ul class="op__points">${points}</ul>
        <footer class="op__foot">
          <span class="op__chip">${a.category}</span>
          <span class="op__by">a project by Akshith Paluru</span>
        </footer>
      </article>`;
  }

  // normalise each project into a full app record
  const PROJECT_APPS = PROJECTS.map((p) => {
    const a = {
      ...p,
      colorSoft: p.colorSoft || soft(p.color, 0.14),
      tagline_short: p.tagline_short || p.category,
      width: p.width || 620,
      height: p.height || 560,
    };
    a.render = (body) => { body.innerHTML = onePager(a); };
    return a;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  SYSTEM APPS  — the OS's own tools (terminal, dashboard, notes, etc.)
  // ═══════════════════════════════════════════════════════════════════════
  const SYSTEM_APPS = [
    {
      id: "terminal", name: "Terminal", badge: ">_",
      color: "#ff7a45", colorSoft: "rgba(255,122,69,0.16)",
      category: "System", tagline: "foundersh — a real command line for FounderOS.",
      tagline_short: "foundersh — the real CLI", status: "System",
      width: 640, height: 440, custom: true,
      render(body) { window.FounderTerminal.mount(body); },
    },
    {
      id: "traction", name: "Traction", badge: "▤",
      color: "#f5a524", colorSoft: "rgba(245,165,36,0.15)",
      category: "Dashboard", tagline: "A founder's-eye view of the build.",
      tagline_short: "animated build metrics", status: "Live",
      width: 640, height: 620, custom: true,
      render(body, rec) { window.FounderDashboard.mount(body, rec); },
    },
    {
      id: "notes", name: "Idea Pad", badge: "✎",
      color: "#fcd34d", colorSoft: "rgba(252,211,77,0.14)",
      category: "Utility", tagline: "Quick-capture notes that autosave.",
      tagline_short: "autosaving scratchpad", status: "Utility",
      width: 520, height: 460, custom: true, desktop: false,
      render(body) { window.FounderNotes.mount(body); },
    },
    {
      id: "settings", name: "Settings", badge: "◐",
      color: "#94a3b8", colorSoft: "rgba(148,163,184,0.16)",
      category: "System", tagline: "Recolor the OS and swap the wallpaper.",
      tagline_short: "accent + wallpaper", status: "System",
      width: 560, height: 560, custom: true, desktop: false,
      render(body) { window.FounderSettings.mount(body); },
    },
    {
      id: "about", name: "About Me", badge: "AP",
      color: "#ff7a45", colorSoft: "rgba(255,122,69,0.16)",
      category: "Profile", tagline: "Who's behind FounderOS.",
      tagline_short: "the founder behind it", status: "Profile",
      width: 560, height: 560, custom: true, desktop: false,
      render(body) {
        body.innerHTML = `
          <div class="about">
            <div class="about__hero">
              <div class="about__avatar">AP</div>
              <div>
                <h1>Akshith Paluru</h1>
                <p class="about__role">founder &amp; builder</p>
              </div>
            </div>
            <p class="about__bio">
              I'd rather ship four scrappy products than pitch one perfect deck. FounderOS is
              my desktop — and instead of generic apps, the icons are the things I'm actually
              building right now.
            </p>
            <h2 class="about__h2">What I'm building</h2>
            <ul class="about__vents">
              <li style="--c:#38bdf8"><b>DripLyft</b> autonomous drone window cleaning</li>
              <li style="--c:#a78bfa"><b>ShieldEye</b> privacy-first retail theft detection</li>
              <li style="--c:#f59e0b"><b>SiteSmith PM</b> honest websites for small businesses</li>
              <li style="--c:#34d399"><b>EcoSewa</b> nonprofit reusable-dishware lending</li>
            </ul>
            <h2 class="about__h2">About this OS</h2>
            <p class="about__bio">
              Built from scratch in plain HTML, CSS, and vanilla JavaScript — no framework, no
              backend, no login. Draggable windows, a real terminal, a command palette (⌘K),
              live theming, and this profile are all hand-rolled. Fully public by design.
            </p>
            <a class="about__link" href="https://github.com/akshithpaluru-a11y/founderos" target="_blank" rel="noopener">
              View the source on GitHub →
            </a>
          </div>`;
      },
    },
  ];

  const APPS = PROJECT_APPS.concat(SYSTEM_APPS);

  const byId = {};
  APPS.forEach((a) => { byId[a.id] = a; });

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

  window.FounderApps = { list: APPS, projects: PROJECT_APPS, byId, launch };
})();
