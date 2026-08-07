(function () {
  document.body.classList.add("is-loading");
  const menu = document.getElementById("lang-menu");
  const langBtn = document.getElementById("lang-btn");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");
  const langCloud = document.getElementById("lang-cloud");
  const nav = document.getElementById("site-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  });

  window.RABE3_LANG_META.forEach(({ code, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-option";
    btn.dataset.lang = code;
    btn.setAttribute("role", "option");
    btn.textContent = label;
    btn.addEventListener("click", () => selectLanguage(code));
    menu.appendChild(btn);

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "lang-pill";
    pill.dataset.lang = code;
    pill.setAttribute("role", "listitem");
    pill.textContent = label;
    pill.addEventListener("click", () => selectLanguage(code));
    langCloud.appendChild(pill);
  });

  function selectLanguage(code) {
    window.applyLanguage(code);
    menu.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  }

  window.syncLangPills = (lang) => {
    document.querySelectorAll(".lang-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.lang === lang);
    });
  };

  const origApply = window.applyLanguage;
  window.applyLanguage = (lang) => {
    origApply(lang);
    window.syncLangPills?.(lang);
    updateFaqSchema(lang);
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.classList.remove("open");
      langBtn?.setAttribute("aria-expanded", "false");
      navLinks?.classList.remove("open");
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

  const navSectionIds = new Set(
    navLinks ? [...navLinks.querySelectorAll("a[href^='#']")].map((a) => a.getAttribute("href").slice(1)) : []
  );
  const sections = [...document.querySelectorAll("section[id], header[id]")]
    .filter((el) => el.id && navSectionIds.has(el.id));
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

  const faqItems = [...document.querySelectorAll(".faq-item")];
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const answer = item.querySelector(".faq-answer");
    trigger?.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");
      faqItems.forEach((other) => {
        if (other === item) return;
        other.classList.remove("open");
        const otherTrigger = other.querySelector(".faq-trigger");
        const otherAnswer = other.querySelector(".faq-answer");
        otherTrigger?.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.style.maxHeight = "0";
      });
      item.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (answer) {
        answer.style.maxHeight = willOpen ? `${answer.scrollHeight}px` : "0";
      }
    });
  });

  function updateFaqSchema(lang) {
    const script = document.getElementById("faq-schema");
    if (!script || typeof window.t !== "function") return;
    const questions = [
      ["faq_q1", "faq_a1"],
      ["faq_q2", "faq_a2"],
      ["faq_q3", "faq_a3"],
      ["faq_q4", "faq_a4"],
    ];
    const mainEntity = questions.map(([q, a]) => ({
      "@type": "Question",
      name: window.t(lang, q),
      acceptedAnswer: { "@type": "Answer", text: window.t(lang, a) },
    }));
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    });
  }

  if (!reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const tiltTarget = document.querySelector(".device-frame");
    const heroVisual = document.getElementById("hero-device");
    if (tiltTarget && heroVisual) {
      let scrollY = 0;
      let tiltX = 0;
      let tiltY = 0;

      const applyTilt = () => {
        tiltTarget.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        heroVisual.style.setProperty("--hero-scroll-y", `${scrollY * 0.06}px`);
      };

      window.addEventListener("scroll", () => {
        scrollY = Math.min(window.scrollY, 600);
        applyTilt();
      }, { passive: true });

      heroVisual.addEventListener("mousemove", (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        tiltY = ((e.clientX - cx) / rect.width) * 5;
        tiltX = -((e.clientY - cy) / rect.height) * 3;
        applyTilt();
      });

      heroVisual.addEventListener("mouseleave", () => {
        tiltX = 0;
        tiltY = 0;
        applyTilt();
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  window.initI18n();
  updateFaqSchema(document.documentElement.lang || "ar");
})();
