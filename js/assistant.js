/* FounderOS — Foundy, the in-OS assistant.
 *
 * Honest note: Foundy is a fully client-side, rule-based assistant (no server,
 * no LLM API) so FounderOS stays 100% public with no keys. It parses intent
 * from what you type and can actually DRIVE the OS — open apps, recolor the
 * theme, switch wallpaper, launch games, lock the screen — plus talk shop.
 */
(function () {
  "use strict";

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function name() { return window.FounderOS ? window.FounderOS.firstName() : "founder"; }

  const JOKES = [
    "Why did the founder bring a ladder to the pitch? To reach the next round. 🪜",
    "My burn rate and I are in a committed relationship. It's very consuming.",
    "I'd tell you a startup joke, but it only works if you're pre-revenue.",
    "Investor: “What's your moat?” Me: “Vibes and a really good landing page.”",
    "We're not overspending, we're aggressively investing in future regret.",
  ];
  const ADVICE = [
    "Ship the ugly version today. You can't get feedback on a thing that doesn't exist.",
    "Talk to five users before you write five more lines of code.",
    "The riskiest assumption is the one you're avoiding testing. Go poke it.",
    "Distribution beats a slightly better product almost every time. Plan the launch first.",
    "Cut the feature. If you're arguing about it this long, users won't notice it's gone.",
    "Momentum compounds. One honest, shippable thing a day > a perfect thing in a quarter.",
  ];

  // ---- intent engine ----
  function findApp(q) {
    if (!window.FounderApps) return null;
    q = q.toLowerCase();
    return window.FounderApps.list.find(
      (a) => q.includes(a.id) || q.includes(a.name.toLowerCase()) ||
             (a.id === "traction" && /dashboard|metric/.test(q)) ||
             (a.id === "notes" && /note|idea|pad/.test(q)) ||
             (a.id === "terminal" && /terminal|shell|cli|command/.test(q))
    );
  }

  function respond(raw) {
    const q = raw.toLowerCase().trim();
    const OS = window.FounderOS;

    // theme change
    if (/(theme|accent|colou?r)/.test(q) && OS) {
      const m = OS.accents.find((a) => q.includes(a.id) || q.includes(a.name.toLowerCase()));
      if (m) return { text: `Done — repainting the whole OS in ${m.name}. ✨`, act: () => { OS.setAccent(m.id); toastAct(`Accent → ${m.name}`); } };
      return { text: `Sure — which vibe? I've got ${OS.accents.map((a) => a.name).join(", ")}. Say “theme flux”.` };
    }
    // wallpaper
    if (/wallpaper|background/.test(q) && OS) {
      const m = OS.wallpapers.find((w) => q.includes(w.id) || q.includes(w.name.toLowerCase()));
      if (m) return { text: `Switching the wallpaper to ${m.name}. 🖼️`, act: () => { OS.setWallpaper(m.id); toastAct(`Wallpaper → ${m.name}`); } };
      return { text: `I can set ${OS.wallpapers.map((w) => w.name).join(", ")}. Try “wallpaper aurora”.` };
    }
    // play a game
    if (/\b(game|play|bored|fun)\b/.test(q)) {
      return { text: `Say less — spinning up the Arcade. ROUNDS is my favorite; merge funding rounds to IPO. 🎮`, act: () => launch("arcade") };
    }
    // open / launch an app
    if (/\b(open|launch|show|start|go to)\b/.test(q)) {
      const app = findApp(q);
      if (app) return { text: `Opening ${app.name} for you.`, act: () => launch(app.id) };
      return { text: `Which one? I can open ${window.FounderApps.list.map((a) => a.name).slice(0, 6).join(", ")}…` };
    }
    // tell me about a project
    if (/(tell me about|what is|what's|explain|about)\b/.test(q)) {
      const app = findApp(q);
      if (app && app.problem) {
        return { text: `${app.name} — ${app.tagline}\n\n${app.what}`, act: () => launch(app.id), actLabel: `open ${app.name}` };
      }
      if (/you|foundy|yourself/.test(q)) return { text: iam() };
    }
    // list projects
    if (/(projects?|building|ventures?|what are you working)/.test(q)) {
      const list = window.FounderApps.projects.map((p) => `• ${p.name} — ${p.tagline_short}`).join("\n");
      return { text: `Four things in flight right now:\n\n${list}\n\nWant the full pitch on any of them? Just ask.` };
    }
    // advice / what should I build
    if (/(advice|should i|what next|stuck|help me build|tip)/.test(q)) return { text: pick(ADVICE) };
    // joke
    if (/joke|funny|laugh|meme/.test(q)) return { text: pick(JOKES) };
    // time / date
    if (/\btime\b/.test(q)) return { text: `It's ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. Prime building hours. ⏱️` };
    if (/\bdate\b|what day/.test(q)) return { text: new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) };
    // lock
    if (/lock|log ?out|sign ?out/.test(q)) return { text: `Locking up. Come back soon. 👋`, act: () => window.FounderMain && window.FounderMain.relock() };
    // who are you
    if (/who are you|what are you|your name/.test(q)) return { text: iam() };
    // help
    if (/help|what can you|commands|how do/.test(q)) return { text: helpText() };
    // greeting
    if (/^(hi|hey|hello|yo|sup|hola|howdy)\b/.test(q)) return { text: pick([`Hey ${name()}! What are we building today?`, `Yo ${name()} — need me to open something or recolor the place?`, `Hi ${name()} 👋 ask me to open an app, change the theme, or start a game.`]) };
    // thanks
    if (/thank|thanks|ty|cheers/.test(q)) return { text: pick(["Anytime.", "That's what I'm here for. 🙌", "Go ship something."]) };

    // fallback
    return { text: pick([
      `I'm a small on-device brain, so I'm best at *doing* things. Try: “open shieldeye”, “theme flux”, “play a game”, or “tell me about DripLyft”.`,
      `Not sure I caught that — but I can open apps, recolor the OS, launch a game, or brief you on any project. What'll it be?`,
    ]) };
  }

  function iam() {
    return `I'm Foundy — the assistant baked into FounderOS. I run entirely in your browser (no servers, no login), and I can actually drive the place: open apps, recolor the OS, switch wallpaper, start a game, or brief you on ${name() === "Akshith" ? "my" : "Akshith's"} projects. Try me.`;
  }
  function helpText() {
    return `Here's what I can do, ${name()}:\n• “open <app>” — I'll launch it (try “open traction”)\n• “theme flux” / “wallpaper aurora” — recolor the OS\n• “play a game” — into the Arcade\n• “tell me about ShieldEye” — the pitch on any project\n• “what should I build next?” — founder advice\n• ask for the time, a joke, or just say hi`;
  }

  function launch(id) { if (window.FounderApps) window.FounderApps.launch(id); }
  function toastAct(msg) { if (window.FounderMain) window.FounderMain.toast(msg, { badge: "✦", accent: "#ff7a45" }); }

  // ---- chat UI ----
  function mount(body) {
    body.innerHTML = `
      <div class="foundy">
        <div class="foundy__stream" id="foundy-stream"></div>
        <div class="foundy__chips" id="foundy-chips"></div>
        <form class="foundy__form" id="foundy-form" autocomplete="off">
          <input class="foundy__input" id="foundy-input" placeholder="Ask Foundy to open something, recolor the OS, or brief you…" aria-label="Message Foundy" />
          <button class="foundy__send" type="submit" aria-label="Send">→</button>
        </form>
      </div>`;

    const stream = body.querySelector("#foundy-stream");
    const form = body.querySelector("#foundy-form");
    const input = body.querySelector("#foundy-input");
    const chips = body.querySelector("#foundy-chips");

    ["Open Traction", "Theme: flux", "Play a game", "What should I build?"].forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "foundy__chip"; b.textContent = c;
      b.addEventListener("click", () => { input.value = c.replace(/^Theme: /, "theme "); send(); });
      chips.appendChild(b);
    });

    function bubble(who, text) {
      const el = document.createElement("div");
      el.className = "foundy__msg foundy__msg--" + who;
      if (who === "bot") el.innerHTML = `<span class="foundy__ava"></span><span class="foundy__text"></span>`;
      else el.innerHTML = `<span class="foundy__text"></span>`;
      stream.appendChild(el);
      stream.scrollTop = stream.scrollHeight;
      return el.querySelector(".foundy__text");
    }
    function typeInto(node, text, done) {
      const lines = text.split("");
      let i = 0;
      (function step() {
        node.textContent = text.slice(0, i);
        stream.scrollTop = stream.scrollHeight;
        i++;
        if (i <= text.length) setTimeout(step, 9);
        else if (done) done();
      })();
    }
    function thinking() {
      const el = document.createElement("div");
      el.className = "foundy__msg foundy__msg--bot foundy__thinking";
      el.innerHTML = `<span class="foundy__ava"></span><span class="foundy__dots"><i></i><i></i><i></i></span>`;
      stream.appendChild(el); stream.scrollTop = stream.scrollHeight;
      return el;
    }

    function botSay(text, r) {
      const think = thinking();
      const delay = 350 + Math.min(600, text.length * 6);
      setTimeout(() => {
        think.remove();
        const node = bubble("bot");
        typeInto(node, text, () => {
          if (r && r.act) {
            setTimeout(() => {
              r.act();
              if (r.actLabel) {
                const a = document.createElement("button");
                a.className = "foundy__do"; a.textContent = r.actLabel;
                a.addEventListener("click", r.act);
              }
            }, 250);
          }
        });
      }, delay);
    }

    function send() {
      const v = input.value.trim();
      if (!v) return;
      typeInto(bubble("user"), v);
      input.value = "";
      const r = respond(v);
      botSay(r.text, r);
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); send(); });

    // opening line
    botSay(pick([
      `Hey ${name()} — I'm Foundy, your OS copilot. I can open apps, recolor everything, start a game, or brief you on the projects. What do you need?`,
      `Hi ${name()}! Foundy here. Try “open ShieldEye”, “theme signal”, or “play a game”.`,
    ]));
    setTimeout(() => input.focus(), 80);
  }

  // ambient greeting on unlock (toast)
  function greet() {
    if (!window.FounderMain) return;
    window.FounderMain.toast(pick([
      `Foundy: hey ${name()} — press ⌘K, or open me anytime for a hand.`,
      `Foundy: welcome back. Want me to recolor the place or open a project?`,
    ]), { badge: "✦", accent: "#ff7a45", ms: 4200 });
  }

  window.FounderAssistant = { mount, greet, respond };
})();
