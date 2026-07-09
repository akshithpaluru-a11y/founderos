/* FounderOS — foundersh
 * A real command-line: parses input, runs commands, keeps history.
 * `open <app>` actually launches the matching app window.
 */
(function () {
  "use strict";

  const MANTRAS = [
    "Done beats perfect. Ship it.",
    "Nobody's coming to build it for you.",
    "The best time to start was yesterday. The second best is now.",
    "Talk less, ship more.",
    "Small daily reps compound into companies.",
    "Fall in love with the problem, not your first solution.",
  ];

  const APP_ALIASES = {
    driplyft: "driplyft", drip: "driplyft", dl: "driplyft",
    shieldeye: "shieldeye", shield: "shieldeye", se: "shieldeye",
    sitesmith: "sitesmith", "sitesmith-pm": "sitesmith", sitesmithpm: "sitesmith", site: "sitesmith", ss: "sitesmith",
    ecosewa: "ecosewa", eco: "ecosewa", es: "ecosewa",
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function mount(body) {
    body.classList.add("term-host");
    body.innerHTML = `
      <div class="term" tabindex="0">
        <div class="term__out" aria-live="polite"></div>
        <div class="term__line">
          <span class="term__prompt">founder@os <span class="term__cwd">~/founderos</span> $</span>
          <input class="term__input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="terminal input" />
        </div>
      </div>`;

    const term = body.querySelector(".term");
    const out = body.querySelector(".term__out");
    const input = body.querySelector(".term__input");
    const history = [];
    let hIdx = -1; // -1 = current (empty) line

    function print(html, cls) {
      const div = document.createElement("div");
      div.className = "term__row" + (cls ? " term__row--" + cls : "");
      div.innerHTML = html;
      out.appendChild(div);
      term.scrollTop = term.scrollHeight;
    }
    function printLines(text, cls) {
      text.split("\n").forEach((l) => print(l === "" ? "&nbsp;" : esc(l), cls));
    }

    const commands = {
      help() {
        print(`<span class="k">Available commands</span>`, "accent");
        const rows = [
          ["help", "show this list"],
          ["whoami", "who I am, in one breath"],
          ["projects", "the four things I'm building"],
          ["open &lt;app&gt;", "open an app window (e.g. open driplyft)"],
          ["ls", "list installed apps"],
          ["date", "current date and time"],
          ["neofetch", "FounderOS system info"],
          ["stack", "what this OS is built with"],
          ["hustle", "a founder mantra, at random"],
          ["contact", "where to find me"],
          ["echo &lt;text&gt;", "print text back"],
          ["clear", "clear the screen"],
        ];
        rows.forEach(([c, d]) => print(`  <span class="cmd">${c}</span><span class="desc">${d}</span>`));
        print(`<span class="dim">(there are a couple of easter eggs, too — go poke around)</span>`, "dim");
      },
      whoami() {
        printLines(
          "Akshith Paluru — founder & builder.\n" +
          "I'd rather ship four scrappy products than pitch one perfect deck.\n" +
          "FounderOS is my desktop; the apps on it are the things I'm actually building."
        );
      },
      projects() {
        const list = window.FounderApps.list;
        print(`<span class="k">Currently shipping</span>`, "accent");
        list.forEach((a) => {
          print(`  <span class="proj" style="color:${a.color}">${a.name.padEnd ? a.name : a.name}</span> <span class="desc">${a.tagline_short}</span>`);
        });
        print(`<span class="dim">try: open ${list[0].id}</span>`, "dim");
      },
      ls() {
        const ids = window.FounderApps.list.map((a) => a.id).concat("terminal");
        print(ids.map((i) => `<span class="cmd">${i}</span>`).join("  "));
      },
      open(arg) {
        if (!arg) { print(`open: which app? try <span class="cmd">open driplyft</span>`, "error"); return; }
        const key = APP_ALIASES[arg.toLowerCase()];
        if (arg.toLowerCase() === "terminal") { print("you're already in it. 🙂", "dim"); return; }
        if (!key) { print(`open: unknown app "${esc(arg)}" — run <span class="cmd">ls</span> to see options`, "error"); return; }
        const app = window.FounderApps.byId[key];
        print(`opening <span class="proj" style="color:${app.color}">${app.name}</span>…`);
        window.FounderApps.launch(key);
      },
      date() {
        const d = new Date();
        print(esc(d.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })));
      },
      echo(arg, raw) { print(esc(raw) || "&nbsp;"); },
      clear() { out.innerHTML = ""; },
      neofetch() {
        const art = [
          "     <span class='a'>▲</span>      ",
          "    <span class='a'>▲ ▲</span>     ",
          "   <span class='a'>▲▲▲▲▲</span>    ",
          "  <span class='a'>▲▲▲▲▲▲▲</span>   ",
        ];
        const info = [
          "<span class='k'>founder@founderos</span>",
          "-----------------",
          "OS:      FounderOS 1.0",
          "Shell:   foundersh",
          "Apps:    4 shipping",
          "Stack:   HTML · CSS · vanilla JS",
          "Uptime:  since the last good idea",
          "Motto:   build in public, ship on time",
        ];
        const n = Math.max(art.length, info.length);
        for (let i = 0; i < n; i++) {
          print(`<span class="nf-art">${art[i] || "        "}</span><span class="nf-info">${info[i] || ""}</span>`);
        }
      },
      stack() {
        printLines(
          "FounderOS runs on plain HTML, CSS, and vanilla JavaScript.\n" +
          "No framework. No build step. No backend. Fully public, no login.\n" +
          "The window manager and this terminal are a few hundred lines of JS —\n" +
          "shipped fast on purpose, because that's the whole point."
        );
      },
      hustle() {
        const m = MANTRAS[Math.floor(Math.random() * MANTRAS.length)];
        print(`<span class="a">“${esc(m)}”</span>`, "accent");
      },
      contact() {
        printLines("github   github.com/akshithpaluru-a11y");
        print(`<span class="dim">FounderOS is open source — the code is right there.</span>`, "dim");
      },
      // --- easter eggs ---
      sudo() {
        print(`we don't do that here. FounderOS is <span class="a">fully public</span> — no passwords, no root, no gates. that's the point.`, "accent");
      },
      coffee() {
        printLines("      ( (\n       ) )\n    ........\n    |      |]\n    \\      /\n     `----'");
        print(`<span class="dim">brewing… ☕ ok, back to building.</span>`, "dim");
      },
      whoareyou() { commands.whoami(); },
    };
    const ALIASES = { "?": "help", man: "help", cls: "clear", quit: "clear", about: "whoami", motd: "hustle" };

    function run(raw) {
      const line = raw.trim();
      print(`<span class="term__prompt">founder@os <span class="term__cwd">~/founderos</span> $</span> ${esc(line)}`, "echo");
      if (!line) return;
      history.push(line); hIdx = -1;
      const parts = line.split(/\s+/);
      let cmd = parts[0].toLowerCase();
      const arg = parts[1] || "";
      const rest = line.slice(parts[0].length).trim();
      if (ALIASES[cmd]) cmd = ALIASES[cmd];
      if (commands[cmd]) {
        try { commands[cmd](arg, rest); }
        catch (e) { print(`error: ${esc(e.message)}`, "error"); }
      } else {
        print(`foundersh: command not found: <span class="cmd">${esc(cmd)}</span> — try <span class="cmd">help</span>`, "error");
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = input.value; input.value = ""; run(v);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        if (hIdx === -1) hIdx = history.length;
        hIdx = Math.max(0, hIdx - 1);
        input.value = history[hIdx] || "";
        requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (hIdx === -1) return;
        hIdx += 1;
        if (hIdx >= history.length) { hIdx = -1; input.value = ""; }
        else input.value = history[hIdx];
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault(); out.innerHTML = "";
      }
    });

    // focus input whenever the terminal surface is clicked
    term.addEventListener("mousedown", (e) => {
      if (e.target.tagName !== "INPUT" && !window.getSelection().toString()) {
        setTimeout(() => input.focus(), 0);
      }
    });

    // welcome banner
    print(`<span class="k">FounderOS</span> foundersh · v1.0`, "accent");
    print(`type <span class="cmd">help</span> to get started, or <span class="cmd">projects</span> to see what I'm building.`, "dim");
    print("&nbsp;");
    setTimeout(() => input.focus(), 60);
  }

  window.FounderTerminal = { mount };
})();
