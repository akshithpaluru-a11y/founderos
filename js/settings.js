/* FounderOS — Settings app: appearance (accent + wallpaper), persisted via FounderOS. */
(function () {
  "use strict";

  function mount(body) {
    const OS = window.FounderOS;

    function draw() {
      const s = OS.get();
      body.innerHTML = `
        <div class="settings">
          <header class="settings__head">
            <h1>Appearance</h1>
            <p>Make FounderOS yours. Everything here saves automatically.</p>
          </header>

          <section class="settings__group">
            <h2>Accent</h2>
            <div class="swatches">
              ${OS.accents.map((a) => `
                <button class="swatch ${s.accent === a.id ? "is-on" : ""}" data-accent="${a.id}" title="${a.name}"
                        style="--sw:${a.a};--sw2:${a.b}">
                  <span class="swatch__dot"></span>
                  <span class="swatch__name">${a.name}</span>
                </button>`).join("")}
            </div>
          </section>

          <section class="settings__group">
            <h2>Wallpaper</h2>
            <div class="wallgrid">
              ${OS.wallpapers.map((w) => `
                <button class="wall ${s.wallpaper === w.id ? "is-on" : ""}" data-wall="${w.id}">
                  <span class="wall__preview wall__preview--${w.id}"></span>
                  <span class="wall__name">${w.name}</span>
                </button>`).join("")}
            </div>
          </section>

          <section class="settings__group">
            <label class="toggle">
              <input type="checkbox" id="rm" ${s.reduceMotion ? "checked" : ""} />
              <span class="toggle__track"><span class="toggle__thumb"></span></span>
              <span class="toggle__label">Reduce motion<small>Calm the window and boot animations</small></span>
            </label>
          </section>

          <footer class="settings__foot">
            <span class="settings__badge">FounderOS 1.0</span>
            <span>accent: <b>${OS.accentName()}</b></span>
          </footer>
        </div>`;

      body.querySelectorAll("[data-accent]").forEach((b) =>
        b.addEventListener("click", () => { OS.setAccent(b.dataset.accent); draw(); }));
      body.querySelectorAll("[data-wall]").forEach((b) =>
        b.addEventListener("click", () => { OS.setWallpaper(b.dataset.wall); draw(); }));
      const rm = body.querySelector("#rm");
      rm.addEventListener("change", () => OS.setReduceMotion(rm.checked));
    }
    draw();
  }

  window.FounderSettings = { mount };
})();
