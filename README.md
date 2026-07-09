# FounderOS

**A personal WebOS desktop where the apps *are* the things I'm building.** Instead of a generic OS with a calculator and a notepad, every icon on FounderOS opens a one-pager for a real project of mine — and there's a working command line to tie it all together.

Built for Hack Club **Stardance — "WebOS 1"**.

> ### ▶︎ [**Live demo — akshithpaluru-a11y.github.io/founderos**](https://akshithpaluru-a11y.github.io/founderos/)
> **Source:** [github.com/akshithpaluru-a11y/founderos](https://github.com/akshithpaluru-a11y/founderos) · fully public, no login

---

## The four project-apps

Each desktop icon opens a small product one-pager, styled with its own signature color:

| App | Signature | What it is |
|-----|-----------|-----------|
| **DripLyft** | cyan | Autonomous drones that clean high-rise glass — no rope, no rig, no one at height. |
| **ShieldEye** | violet | Real-time, privacy-first retail theft detection that alerts staff as it happens. |
| **SiteSmith PM** | amber | Fast, honest websites for small businesses, at transparent flat pricing. |
| **EcoSewa** | emerald | A nonprofit reusable-dishware lending library for community events. |

The OS chrome itself uses a warm signal-orange system accent, so each app keeps its own identity while the desktop stays coherent.

## The terminal — `foundersh` (the "beyond the guide" feature)

Open the **Terminal** app for a genuinely working command line, not a decorative one:

- `help` — list every command
- `whoami` — who I am, in one breath
- `projects` — the four things I'm building
- `open <app>` — **actually opens** that app's window (e.g. `open driplyft`)
- `ls` — list installed apps
- `date` — current date and time
- `neofetch` — FounderOS system info, with ASCII logo
- `stack`, `contact`, `echo <text>`, `clear`
- easter eggs: `hustle`, `sudo`, `coffee` (go poke around)

It has **command history** (↑/↓ to cycle previous commands), aliases, and click-to-focus, all in JetBrains Mono to match the rest of the OS.

## Core WebOS mechanics

- **Draggable** windows (title-bar drag, mouse **and** touch via Pointer Events)
- **Resizable** from any edge or corner (8 handles)
- **Minimize / maximize / close** controls that all work
- **Focus & z-index** — clicking any window brings it to front
- **Desktop icons** open apps on double-click
- **Taskbar/dock** with open + minimized windows, a live clock, and a start-menu launcher
- **Boot screen** on load

## Run it locally

No build step, no dependencies — it's plain HTML/CSS/JS. Serve the folder with any static server:

```bash
# from the project root
python3 -m http.server 4321
# then open http://localhost:4321
```

Or just open `index.html` directly in a browser.

## Tech

Plain **HTML + CSS + vanilla JavaScript**. No framework, no bundler, no backend, and **no login or password anywhere** — FounderOS is fully public by design.

- `js/wm.js` — the window manager (drag, resize, focus, min/max/close)
- `js/apps.js` — the app registry and one-pager content
- `js/terminal.js` — the `foundersh` command line
- `js/main.js` — boot, desktop icons, taskbar, launcher
- `css/base.css` — the full FounderOS visual identity

---

_A project by Akshith Paluru · [github.com/akshithpaluru-a11y](https://github.com/akshithpaluru-a11y)_
