# FounderOS

**A personal WebOS desktop where the apps *are* the things I'm building.** Instead of a generic OS with a calculator and a notepad, every icon on FounderOS opens a one-pager for a real project of mine — and there's a working command line to tie it all together.

Built for Hack Club **Stardance — "WebOS 1"**.

> ### ▶︎ [**Live demo — akshithpaluru-a11y.github.io/founderos**](https://akshithpaluru-a11y.github.io/founderos/)
> **Source:** [github.com/akshithpaluru-a11y/founderos](https://github.com/akshithpaluru-a11y/founderos) · fully public, no login

---

## Add your own project in ~30 seconds

All the projects live in one array at the top of [`js/apps.js`](js/apps.js), under a big `WANT TO ADD A PROJECT?` banner. Copy the template block, fill in the fields (id, name, badge, color, tagline, stats, problem, what, points), and save. It automatically becomes a desktop icon, a window, a Start-menu entry, a command-palette result, and an `open <id>` terminal command — no other file needs to change.

## Highlights

- **Foundy — an in-OS AI assistant that actually controls the desktop.** Ask it in plain English to open apps, recolor the whole OS, switch wallpaper, start a game, or brief you on any project — and it does it. It's a fully client-side, rule-based brain (no server, no API keys) so the OS stays 100% public.
- **A real game — ROUNDS.** A 2048-style puzzle themed as funding rounds: merge Idea → Seed → Series A → … all the way to **IPO**. Keyboard or swipe, with a persistent best score.
- **Cinematic boot → lock → desktop.** A typed boot log, then a lock screen with a live clock and profile — but **no password**. Type your name to personalize the whole session (avatar, greeting, Foundy), or just hit Enter. Fully public by design.
- **Ambient motion** — drifting accent-colored particles behind the desktop, plus film grain and wallpaper parallax.
- **Command palette (⌘K / Ctrl+K)** — fuzzy-search every app and action, keyboard-driven, just like a real pro tool.
- **Live theming** — a Settings app to recolor the whole OS (6 accents) and swap the wallpaper (4 options). Saves to your browser and persists across reloads.
- **Window snapping** — drag a window to a screen edge to snap it to half-screen or maximize, with a live preview.
- **A real terminal, a live dashboard, an autosaving notepad** — see below.
- **Right-click the desktop** for a context menu; every window drags, resizes, and stacks.
- **Hand-crafted details** — a typed boot log, film-grain texture over the whole UI, subtle wallpaper parallax, genie minimize-to-dock, and a **draggable sticky note** in a handwriting font that remembers whatever you scribble on it.

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
- `theme <name>` — **recolor the whole OS from the CLI** (e.g. `theme flux`)
- `stack`, `contact`, `echo <text>`, `clear`
- easter eggs: `hustle`, `sudo`, `coffee` (go poke around)

It has **command history** (↑/↓ to cycle previous commands), aliases, and click-to-focus, all in JetBrains Mono to match the rest of the OS.

## More apps

- **Foundy** — the AI copilot (above). Type-to-chat with a thinking indicator; it drives the OS for you.
- **Arcade → ROUNDS** — the funding-round merge game (above).
- **Traction** — a founder's-eye dashboard with count-up stats, an animated momentum chart, and per-project progress bars (illustrative sample data — there's no backend).
- **Idea Pad** — a scratchpad that autosaves to your browser as you type.
- **Settings** — the appearance switcher (accent + wallpaper), described above.
- **About Me** — who's behind FounderOS and how it was built.

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

- `js/os.js` — theming + persisted settings (loads first, no flash)
- `js/wm.js` — the window manager (drag, resize, focus, min/max/close, edge-snapping)
- `js/apps.js` — the app registry and one-pager content
- `js/terminal.js` — the `foundersh` command line
- `js/lock.js` — the no-password lock screen
- `js/palette.js` — the ⌘K command palette
- `js/dashboard.js` · `js/notes.js` · `js/settings.js` — the Traction, Idea Pad and Settings apps
- `js/main.js` — boot → lock → desktop, icons, taskbar, launcher, context menu, shortcuts
- `css/base.css` · `css/os.css` — the full FounderOS visual identity

---

_A project by Akshith Paluru · [github.com/akshithpaluru-a11y](https://github.com/akshithpaluru-a11y)_
