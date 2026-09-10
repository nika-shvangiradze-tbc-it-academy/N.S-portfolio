(function () {
  "use strict";

  const projects = window.PORTFOLIO_PROJECTS || [];
  const georgian = window.GEORGIAN_PROJECTS || [];
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
  const sectionIds = ["hero", "upwork", "georgian", "about", "contact"];
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

    const picks = [projects[0], projects[2], projects[6]].filter(Boolean);
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

  /* Work console */
  let activeIndex = 0;

  function setPreview(index, { open = false } = {}) {
    const project = projects[index];
    if (!project) return;
    activeIndex = index;

    const frame = document.querySelector(".work-preview__frame");
    const img = document.getElementById("preview-image");
    const num = document.getElementById("preview-num");
    const name = document.getElementById("preview-name");
    const tags = document.getElementById("preview-tags");
    const link = document.getElementById("preview-link");

    document.querySelectorAll(".work-item").forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
    });

    if (frame) frame.classList.add("is-switching");

    window.setTimeout(() => {
      if (img) {
        img.src = imagePath(project.slug, "hero.jpg");
        img.alt = `Preview of ${project.name}`;
      }
      if (num) num.textContent = project.id;
      if (name) name.textContent = project.name;
      if (tags) {
        tags.textContent = `${project.category} · ${project.country} · ${project.year}`;
      }
      if (link) {
        if (project.url) {
          link.href = project.url;
          link.classList.remove("is-disabled");
          link.setAttribute("aria-disabled", "false");
          link.textContent = "Open live site ↗";
        } else {
          link.href = "#";
          link.classList.add("is-disabled");
          link.setAttribute("aria-disabled", "true");
          link.textContent = "URL soon";
        }
      }
      if (frame) frame.classList.remove("is-switching");
    }, 120);

    if (open && project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  }

  function renderWorkConsole() {
    const list = document.getElementById("work-list");
    if (!list || !projects.length) return;

    list.innerHTML = projects
      .map((p, index) => {
        const disabled = !p.url;
        return `
      <button
        type="button"
        class="work-item${disabled ? " is-disabled" : ""}"
        role="listitem"
        data-index="${index}"
        ${disabled ? "disabled" : ""}
        aria-label="${disabled ? p.name + " — URL coming soon" : "Preview " + p.name}"
      >
        <span class="work-item__num">${p.id}</span>
        <span>
          <span class="work-item__name">${p.name}</span>
          <span class="work-item__meta">${p.country} · ${p.year}</span>
        </span>
        <span class="work-item__open">${disabled ? "Soon" : "Open ↗"}</span>
      </button>`;
      })
      .join("");

    list.querySelectorAll(".work-item").forEach((item) => {
      const index = Number(item.dataset.index);

      if (canHover) {
        item.addEventListener("pointerenter", () => setPreview(index));
      }

      item.addEventListener("focus", () => setPreview(index));

      item.addEventListener("click", () => {
        const project = projects[index];
        setPreview(index);
        if (project && project.url) {
          window.open(project.url, "_blank", "noopener,noreferrer");
        }
      });
    });

    setPreview(0);
  }

  /* Georgian case studies */
  function renderGeorgianCases() {
    const stack = document.getElementById("case-stack");
    if (!stack || !georgian.length) return;

    stack.innerHTML = georgian
      .map((p, index) => {
        const flip = p.layout === "media-right";
        const host = (() => {
          try {
            return new URL(p.url).hostname.replace(/^www\./, "");
          } catch {
            return p.url;
          }
        })();
        const chipA = p.tags[0] || "Client";
        const chipB = p.country || "Georgia";

        return `
      <article
        class="case-card${flip ? " case-card--flip" : ""} reveal"
        data-case-index="${index}"
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
          <p class="case-card__num">Project ${p.id}</p>
          <h3 class="case-card__name">${p.name}</h3>
          <p class="case-card__tags">
            ${p.tags.map((t) => `<span>${t}</span>`).join("")}
          </p>
          <p class="case-card__summary">${p.summary}</p>
          <p class="case-card__meta">
            ${p.meta.map((m) => `<span>${m}</span>`).join("")}
          </p>
          <a
            class="case-card__link"
            href="${p.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>`;
      })
      .join("");

    stack.querySelectorAll(".case-card").forEach((card) => {
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
  renderWorkConsole();
  renderGeorgianCases();
  initPortraitScene();
  initAboutScene();
  initContactScene();
  initMagneticButtons();
  initReveals();
  initCredentialVault();
})();
