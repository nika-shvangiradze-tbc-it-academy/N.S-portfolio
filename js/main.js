(function () {
  "use strict";

  const projects = window.PORTFOLIO_PROJECTS || [];
  const georgian = window.GEORGIAN_PROJECTS || [];
  const games = window.GAME_PROJECTS || [];
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function imagePath(slug, file) {
    return `assets/projects/${slug}/${file}`;
  }

  /* Smooth scroll without writing #hash into the URL */
  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    return true;
  }

  function clearHashFromUrl() {
    if (!window.location.hash) return;
    const clean = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", clean);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    if (!id || !document.getElementById(id)) return;

    e.preventDefault();
    scrollToId(id);
    clearHashFromUrl();
    if (isNavOpen()) setNavOpen(false);
  });

  if (window.location.hash) {
    const initialId = window.location.hash.slice(1);
    window.requestAnimationFrame(() => {
      scrollToId(initialId);
      clearHashFromUrl();
    });
  }

  /* Header + mobile nav */
  const header = document.getElementById("site-header");
  const nav = document.getElementById("site-nav");
  const navToggle = document.getElementById("nav-toggle");
  const brandMark = document.getElementById("brand-mark");
  const navLinks = nav ? Array.from(nav.querySelectorAll("[data-nav]")) : [];
  const navWord = navToggle ? navToggle.querySelector(".nav-toggle__word") : null;
  const pageMain = document.querySelector("main.page");
  let lastFocusedBeforeNav = null;

  function isNavOpen() {
    return Boolean(nav && nav.classList.contains("is-open"));
  }

  function syncNavChrome(open) {
    if (header) header.classList.toggle("is-nav-open", open);
    document.body.classList.toggle("is-nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (navWord) {
      navWord.textContent = open
        ? navWord.dataset.close || "Close"
        : navWord.dataset.open || "Menu";
    }
    if (pageMain) {
      if (open) pageMain.setAttribute("inert", "");
      else pageMain.removeAttribute("inert");
    }
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    const next = Boolean(open);
    if (next === isNavOpen()) return;

    nav.classList.toggle("is-open", next);
    syncNavChrome(next);

    if (next) {
      lastFocusedBeforeNav = document.activeElement;
      const first = navLinks[0];
      window.requestAnimationFrame(() => {
        if (first) first.focus();
      });
    } else if (lastFocusedBeforeNav && typeof lastFocusedBeforeNav.focus === "function") {
      lastFocusedBeforeNav.focus();
      lastFocusedBeforeNav = null;
    } else {
      navToggle.focus();
    }
  }

  if (header) {
    const onScroll = () => {
      if (isNavOpen()) return;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      setNavOpen(!isNavOpen());
    });
  }

  if (brandMark) {
    brandMark.addEventListener("click", () => setNavOpen(false));
  }

  /* Close overlay nav when returning to desktop width */
  const navMq = window.matchMedia("(min-width: 901px)");
  const onNavMq = (e) => {
    if (e.matches) setNavOpen(false);
  };
  if (typeof navMq.addEventListener === "function") {
    navMq.addEventListener("change", onNavMq);
  } else if (typeof navMq.addListener === "function") {
    navMq.addListener(onNavMq);
  }

  window.addEventListener("keydown", (e) => {
    if (!isNavOpen()) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setNavOpen(false);
      return;
    }

    if (e.key !== "Tab" || !nav) return;

    const focusables = [brandMark, ...navLinks, navToggle].filter(
      (el) => el && !el.hasAttribute("disabled")
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* Active section indication */
  const sectionIds = ["hero", "upwork", "games", "about", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === id);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveNav(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* Night cosmos stars */
  function renderStars() {
    const root = document.getElementById("cosmos-stars");
    if (!root) return;

    const count = 48;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const star = document.createElement("span");
      star.className = "cosmos-star";
      const size = (Math.random() * 2.2 + 1).toFixed(1);
      star.style.setProperty("--size", `${size}px`);
      star.style.setProperty("--dur", `${(Math.random() * 3 + 2).toFixed(1)}s`);
      star.style.setProperty("--delay", `${(Math.random() * 4).toFixed(1)}s`);
      star.style.left = `${(Math.random() * 96 + 2).toFixed(2)}%`;
      star.style.top = `${(Math.random() * 96 + 2).toFixed(2)}%`;
      frag.appendChild(star);
    }
    root.appendChild(frag);
  }

  /* Hero portrait parallax / tilt */
  function initPortraitScene() {
    const scene = document.getElementById("portrait-scene");
    const card = document.getElementById("portrait-card");
    if (!scene || !card || reduceMotion || !canHover) return;

    const layers = scene.querySelectorAll("[data-depth]");
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function render() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const rotY = currentX * 7;
      const rotX = -currentY * 5;

      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      layers.forEach((el) => {
        const depth = Number(el.dataset.depth) || 20;
        const tx = currentX * depth * 0.18;
        const ty = currentY * depth * 0.14;
        const base =
          el.classList.contains("portrait-scene__glass--back")
            ? "rotateY(14deg) translateZ(-30px) "
            : el.classList.contains("portrait-scene__glass--side")
              ? "rotateY(-16deg) translateZ(-20px) "
              : "";
        el.style.transform = `${base}translate3d(${tx}px, ${ty}px, 0)`;
      });

      raf = window.requestAnimationFrame(render);
    }

    scene.addEventListener(
      "pointermove",
      (e) => {
        const rect = scene.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      },
      { passive: true }
    );

    scene.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
    });

    raf = window.requestAnimationFrame(render);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else {
        raf = window.requestAnimationFrame(render);
      }
    });
  }

  /* Magnetic CTAs */
  function initMagneticButtons() {
    if (reduceMotion || !canHover) return;

    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });

      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Reveal on scroll */
  function initReveals() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      observer.observe(el);
    });
  }

  /* Archive 3D deck */
  function renderArchiveStack() {
    const stack = document.getElementById("archive-stack");
    if (!stack || !projects.length) return;

    const picks = projects.slice(0, 3);
    stack.innerHTML = picks
      .map(
        (p) => `
      <div class="scene-card">
        <img
          src="${imagePath(p.slug, "hero.jpg")}"
          alt=""
          width="840"
          height="525"
          loading="lazy"
          decoding="async"
        />
      </div>`
      )
      .join("");
  }

  /* Selected work — featured duo (matches case-card language) */
  function projectHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url || "";
    }
  }

  function buildFeatureCard(p, { flip = false, prefix = "Project", linkLabel = "Open live site" } = {}) {
    const tags = p.tags || [];
    const meta = p.meta || [];
    const chipA = tags[0] || p.category || "Client";
    const chipB = p.country || "";
    const host = projectHost(p.url);

    return `
      <article
        class="case-card work-feature${flip ? " case-card--flip" : ""} reveal"
        data-case-index="${p.id}"
      >
        <div class="case-card__media">
          <div class="case-stage">
            <div class="case-stage__glow" aria-hidden="true"></div>
            <div class="case-stage__orbit" aria-hidden="true"></div>
            <div class="case-stage__orbit case-stage__orbit--dashed" aria-hidden="true"></div>
            <div class="case-stage__plate case-stage__plate--a" data-case-layer="18" aria-hidden="true"></div>
            <div class="case-stage__plate case-stage__plate--b" data-case-layer="28" aria-hidden="true"></div>
            <div class="case-browser" data-case-layer="40">
              <div class="case-browser__chrome">
                <div class="case-browser__dots" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <div class="case-browser__url">${host}</div>
              </div>
              <div class="case-browser__screen">
                <img
                  src="${imagePath(p.slug, "hero.jpg")}"
                  alt="Screenshot of ${p.name}"
                  width="1440"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div class="case-stage__chip case-stage__chip--a" data-case-layer="52">${chipA}</div>
            <div class="case-stage__chip case-stage__chip--b" data-case-layer="46">${chipB}</div>
          </div>
        </div>
        <div class="case-card__body">
          <p class="case-card__num">${prefix} ${p.id}</p>
          <h3 class="case-card__name">${p.name}</h3>
          <p class="case-card__tags">
            ${tags.map((t) => `<span>${t}</span>`).join("")}
          </p>
          <p class="case-card__summary">${p.summary || p.overview || ""}</p>
          <p class="case-card__meta">
            ${meta.map((m) => `<span>${m}</span>`).join("")}
          </p>
          <a
            class="case-card__link"
            href="${p.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${linkLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>`;
  }

  function initCaseCardMotion(root) {
    if (!root) return;
    root.querySelectorAll(".case-card").forEach((card) => {
      if (!canHover || reduceMotion) {
        card.classList.add("is-open");
        return;
      }

      const stage = card.querySelector(".case-stage");
      const browser = card.querySelector(".case-browser");
      const layers = card.querySelectorAll("[data-case-layer]");
      if (!stage || !browser) return;

      let raf = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let active = false;

      function tick() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        const rotY = currentX * 9;
        const rotX = -currentY * 7;
        card.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
        card.style.setProperty("--glow-x", `${50 + currentX * 28}%`);
        card.style.setProperty("--glow-y", `${40 + currentY * 22}%`);

        layers.forEach((el) => {
          if (el.classList.contains("case-browser")) return;
          const depth = Number(el.dataset.caseLayer) || 20;
          const tx = currentX * depth * 0.22;
          const ty = currentY * depth * 0.18;
          el.style.setProperty("--lx", `${tx.toFixed(2)}px`);
          el.style.setProperty("--ly", `${ty.toFixed(2)}px`);
        });

        if (active || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
          raf = window.requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      }

      function start() {
        if (!raf) raf = window.requestAnimationFrame(tick);
      }

      stage.addEventListener(
        "pointermove",
        (e) => {
          active = true;
          const rect = stage.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          start();
        },
        { passive: true }
      );

      stage.addEventListener("pointerleave", () => {
        active = false;
        targetX = 0;
        targetY = 0;
        start();
      });
    });
  }

  function renderSelectedWork() {
    const duo = document.getElementById("work-duo");
    if (!duo || !projects.length) return;

    duo.innerHTML = projects
      .map((p) =>
        buildFeatureCard(p, {
          flip: false,
          prefix: "Project",
        })
      )
      .join("");

    initCaseCardMotion(duo);
  }

  /* Georgian case studies */
  function renderGeorgianCases() {
    const stack = document.getElementById("case-stack");
    if (!stack || !georgian.length) return;

    stack.innerHTML = georgian
      .map((p) =>
        buildFeatureCard(p, {
          flip: p.layout === "media-right",
          prefix: "Project",
          linkLabel: "Visit Website",
        })
      )
      .join("");

    initCaseCardMotion(stack);
  }

  /* Games - featured + optional grid */
  const externalLinkIcon = `
    <svg class="game-card__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path d="M5.5 2.5H2.75A1.25 1.25 0 0 0 1.5 3.75v7.5A1.25 1.25 0 0 0 2.75 12.5h7.5A1.25 1.25 0 0 0 11.5 11.25V8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
      <path d="M8 1.5h4.5V6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.5 7.5 12.25 1.75" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
    </svg>`;

  function buildFeaturedGameCard(game) {
    const techs = game.technologies || [];
    const preview = game.previewImage || "";
    const url = game.liveUrl || "#";
    const title = game.title || "Game";

    return `
      <article class="game-card game-card--featured reveal">
        <div class="game-card__visual">
          <div class="game-card__glow" aria-hidden="true"></div>
          <div class="game-card__frame">
            <img
              src="${preview}"
              alt="${title} preview · ${game.category || "interactive game"}"
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div class="game-card__body">
          <p class="game-card__label">Featured Game</p>
          <h3 class="game-card__title">${title}</h3>
          <p class="game-card__category">${game.category || ""}</p>
          <p class="game-card__desc">${game.description || ""}</p>
          <ul class="game-card__tech" aria-label="Technologies">
            ${techs.map((t) => `<li>${t}</li>`).join("")}
          </ul>
          <a
            class="game-card__cta"
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Live
            ${externalLinkIcon}
          </a>
        </div>
      </article>`;
  }

  function buildGameGridCard(game) {
    const techs = game.technologies || [];
    const preview = game.previewImage || "";
    const url = game.liveUrl || "#";
    const title = game.title || "Game";

    return `
      <article class="game-card game-card--grid reveal">
        <div class="game-card__visual">
          <div class="game-card__frame">
            <img
              src="${preview}"
              alt="Preview of ${title}"
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div class="game-card__body">
          <h3 class="game-card__title">${title}</h3>
          <p class="game-card__category">${game.category || ""}</p>
          <ul class="game-card__tech" aria-label="Technologies">
            ${techs.map((t) => `<li>${t}</li>`).join("")}
          </ul>
          <a
            class="game-card__cta"
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Live
            ${externalLinkIcon}
          </a>
        </div>
      </article>`;
  }

  function renderGames() {
    const stage = document.getElementById("games-stage");
    if (!stage || !games.length) return;

    const featured = games.filter((g) => g.featured);
    const rest = games.filter((g) => !g.featured);
    const featuredList = featured.length ? featured : [games[0]];
    const gridGames = featured.length ? rest : games.slice(1);

    let html = featuredList.map((g) => buildFeaturedGameCard(g)).join("");

    if (gridGames.length) {
      html += `<div class="games__grid">${gridGames
        .map((g) => buildGameGridCard(g))
        .join("")}</div>`;
    }

    stage.innerHTML = html;
  }

  /* About 3D scene — tech stack showcase */
  function initAboutScene() {
    const scene = document.getElementById("about-scene");
    if (!scene || reduceMotion || !canHover) return;

    const stage = scene.querySelector(".about__stage");
    const orbit = scene.querySelector(".about-orbit");
    if (!stage) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;

    function tick() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      scene.style.setProperty("--about-rx", `${(-currentY * 7).toFixed(2)}deg`);
      scene.style.setProperty("--about-ry", `${(currentX * 9).toFixed(2)}deg`);

      if (orbit) {
        const tilt = 24 + currentY * -4;
        const spin = currentX * 6;
        orbit.style.setProperty("--orbit-tilt", `${tilt.toFixed(2)}deg`);
        orbit.style.setProperty("--orbit-spin", `${spin.toFixed(2)}deg`);
      }

      if (active || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function start() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    stage.addEventListener(
      "pointermove",
      (e) => {
        active = true;
        const rect = stage.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        start();
      },
      { passive: true }
    );

    stage.addEventListener("pointerleave", () => {
      active = false;
      targetX = 0;
      targetY = 0;
      start();
    });
  }

  /* Contact 3D stack */
  function initContactScene() {
    const scene = document.getElementById("contact-scene");
    if (!scene || reduceMotion || !canHover) return;

    const stage = scene.querySelector(".contact__stage");
    const stack = document.getElementById("contact-stack");
    if (!stage || !stack) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;

    function tick() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      scene.style.setProperty("--contact-rx", `${(-currentY * 6).toFixed(2)}deg`);
      scene.style.setProperty("--contact-ry", `${(currentX * 8).toFixed(2)}deg`);

      if (active || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function start() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    stage.addEventListener(
      "pointermove",
      (e) => {
        active = true;
        const rect = stage.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        start();
      },
      { passive: true }
    );

    stage.addEventListener("pointerleave", () => {
      active = false;
      targetX = 0;
      targetY = 0;
      start();
    });
  }

  /* Certificate vault */
  function initCredentialVault() {
    const dialog = document.getElementById("credential-vault");
    const openBtn = document.getElementById("credential-open");
    const closeBtn = document.getElementById("credential-close");
    if (!dialog || !openBtn) return;

    const open = () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      document.body.classList.add("is-vault-open");
    };

    const close = () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
      document.body.classList.remove("is-vault-open");
      openBtn.focus();
    };

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      close();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("is-vault-open");
    });
  }

  renderStars();
  renderArchiveStack();
  renderSelectedWork();
  renderGeorgianCases();
  renderGames();
  initPortraitScene();
  initAboutScene();
  initContactScene();
  initMagneticButtons();
  initReveals();
  initCredentialVault();
})();
