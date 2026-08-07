(function () {
  const menu = document.getElementById("lang-menu");
  const langBtn = document.getElementById("lang-btn");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");
  const langCloud = document.getElementById("lang-cloud");
  const nav = document.getElementById("site-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.RABE3_LANG_META.forEach(({ code, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.lang = code;
    btn.textContent = label;
    btn.addEventListener("click", () => {
      window.applyLanguage(code);
      menu.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    });
    menu.appendChild(btn);

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "lang-pill";
    pill.dataset.lang = code;
    pill.textContent = label;
    pill.addEventListener("click", () => window.applyLanguage(code));
    langCloud.appendChild(pill);
  });

  window.syncLangPills = (lang) => {
    document.querySelectorAll(".lang-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.lang === lang);
    });
  };

  const origApply = window.applyLanguage;
  window.applyLanguage = (lang) => {
    origApply(lang);
    window.syncLangPills?.(lang);
  };

  langBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-picker")) {
      menu.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    }
    if (!e.target.closest(".nav") && navLinks?.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("section[id], header[id]")].filter((el) => el.id);
  const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];

  const setActiveNav = () => {
    const y = window.scrollY + nav.offsetHeight + 48;
    let current = sections[0]?.id;
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }
    navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
  };

  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 16);
    setActiveNav();
    document.getElementById("scroll-top")?.classList.toggle("visible", window.scrollY > 640);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("scroll-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger?.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  if (!reducedMotion) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!target || el.dataset.done) return;
          el.dataset.done = "1";
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / 1000, 1);
            const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = target >= 1000 ? val.toLocaleString() : String(val);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    const statsEl = document.getElementById("stats");
    if (statsEl) statsObserver.observe(statsEl);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const heroVisual = document.querySelector(".hero-visual");
    if (heroVisual) {
      window.addEventListener("scroll", () => {
        const y = Math.min(window.scrollY, 600);
        heroVisual.style.transform = `translateY(${y * 0.06}px)`;
      }, { passive: true });
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  window.initI18n();
})();
