document.documentElement.classList.add("js");

const translations = {
  en: {
    hero_title: "Barber Katia",
    hero_desc: "Personal barber in Warsaw for men who value quality and attention to detail.",
    btn_address: "Address",
    btn_phone: "Phone",
    btn_telegram: "Telegram",
    btn_instagram: "Instagram",
    action_navigate: "Navigate",
    action_call: "Call",
    support_btn: "Donate",
    support_action: "Choose",
    book_btn: "Book Now",
    reviews_title: "Client Reviews",
    rating_caption: "5.0 on Google & Booksy",
    about_title: "About Me",
    about_text: "More than 8 years of experience in men's haircuts and beard grooming. I work in central Warsaw. I guarantee high-quality results. My clients include IT professionals, premium clients, and public figures.",
    wallet_copied: "Copied: {value}",
    wallet_copy_failed: "Unable to copy. Please copy manually: {value}",
  },
  ru: {
    hero_title: "Барбер Катя",
    hero_desc: "Персональный барбер в Варшаве для мужчин, которые ценят качество и внимание к деталям.",
    btn_address: "Адрес",
    btn_phone: "Телефон",
    btn_telegram: "Telegram",
    btn_instagram: "Instagram",
    action_navigate: "Навигация",
    action_call: "Позвонить",
    support_btn: "Поддержать",
    support_action: "Выбрать",
    book_btn: "Записаться сейчас",
    reviews_title: "Отзывы клиентов",
    rating_caption: "5.0 на Google и Booksy",
    about_title: "Обо мне",
    about_text: "Более 8 лет опыта в мужских стрижках и уходе за бородой. Работаю в центре Варшавы. Гарантирую высокое качество результата. Среди моих клиентов — IT-специалисты, премиальные клиенты и публичные личности.",
    wallet_copied: "Скопировано: {value}",
    wallet_copy_failed: "Не удалось скопировать. Скопируйте вручную: {value}",
  },
  pl: {
    hero_title: "Barberka Katia",
    hero_desc: "Personalny barber w Warszawie dla mężczyzn, którzy cenią jakość i dbałość o detale.",
    btn_address: "Adres",
    btn_phone: "Telefon",
    btn_telegram: "Telegram",
    btn_instagram: "Instagram",
    action_navigate: "Nawigacja",
    action_call: "Zadzwoń",
    support_btn: "Wsparcie",
    support_action: "Wybierz",
    book_btn: "Umów teraz",
    reviews_title: "Opinie klientów",
    rating_caption: "5.0 w Google i Booksy",
    about_title: "O mnie",
    about_text: "Ponad 8 lat doświadczenia w strzyżeniu męskim i pielęgnacji brody. Pracuję w centrum Warszawy. Gwarantuję najwyższą jakość usług. Wśród moich klientów są specjaliści IT, klienci premium i osoby publiczne.",
    wallet_copied: "Skopiowano: {value}",
    wallet_copy_failed: "Nie udało się skopiować. Skopiuj ręcznie: {value}",
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

let refreshScrollText = null;

function getCurrentLang() {
  return document.documentElement.lang || localStorage.getItem("ibarber-lang") || "en";
}

function t(key, replacements = {}) {
  const lang = getCurrentLang();
  const dictionary = translations[lang] || translations.en;
  const fallback = translations.en[key] || key;
  const template = dictionary[key] || fallback;

  return template.replace(/\{(\w+)\}/g, (_, token) => {
    if (Object.prototype.hasOwnProperty.call(replacements, token)) {
      return String(replacements[token]);
    }
    return `{${token}}`;
  });
}

function setupCopyToast() {
  const toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <span class="copy-toast__icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <rect x="13" y="9" width="14" height="18"></rect>
        <polyline points="11,23 5,23 5,5 19,5 19,7"></polyline>
      </svg>
    </span>
    <span class="copy-toast__text"></span>
  `;
  document.body.appendChild(toast);
  const textNode = toast.querySelector(".copy-toast__text");

  let hideTimer = null;
  return (message, isError = false) => {
    if (textNode) {
      textNode.textContent = message;
    }
    toast.classList.toggle("is-error", isError);
    toast.classList.add("is-visible");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  };
}

async function copyToClipboard(value) {
  if (!value) return false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      // Fallback to legacy copy flow below.
    }
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  helper.style.pointerEvents = "none";
  document.body.appendChild(helper);
  helper.select();
  helper.setSelectionRange(0, helper.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (_error) {
    copied = false;
  }
  helper.remove();
  return copied;
}

function applyLanguage(lang) {
  const dictionary = translations[lang] || translations.en;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (dictionary[key]) {
      node.setAttribute("aria-label", dictionary[key]);
    }
  });

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  localStorage.setItem("ibarber-lang", lang);

  if (refreshScrollText) refreshScrollText();
}

function setupLanguageToggle() {
  const initialLang = localStorage.getItem("ibarber-lang") || "en";
  applyLanguage(initialLang);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });
}

function setupScrollTextReveal() {
  const el = document.querySelector("[data-scroll-text]");
  if (!el || prefersReducedMotion) return;

  let spans = [];

  const split = () => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    spans = Array.from(el.querySelectorAll(".w"));
    update();
  };

  const update = () => {
    if (!spans.length) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.9;
    const end = vh * 0.45;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const raw = progress * spans.length;
    spans.forEach((span, index) => {
      const t = Math.min(1, Math.max(0, raw - index));
      span.style.opacity = (0.14 + 0.86 * t).toFixed(3);
    });
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );

  refreshScrollText = split;
  split();
}

function setupRevealAnimations() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  nodes.forEach((el) => {
    const delay = Number(el.dataset.delay || "0");
    el.style.setProperty("--reveal-delay", `${delay}s`);
    observer.observe(el);
  });
}

function setupParallax() {
  if (prefersReducedMotion) return;

  const heroSection = document.querySelector(".hero-intro");
  const heroCopy = document.querySelector(".hero-copy");
  const heroPhoto = document.querySelector(".hero-photo");
  const revSection = document.querySelector(".reviews-panel");
  const revLeft = document.querySelector(".reviews-side");
  const revRight = document.querySelector(".reviews-media");
  const aboutSection = document.querySelector(".about-note");
  const aboutMedia = document.querySelector(".about-media");
  if (!heroSection && !revSection && !aboutSection) return;

  // инерционное сглаживание скролла — GSAP-scrub плавность
  let smoothY = window.scrollY;
  let rafId = null;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  const apply = () => {
    const desktop = window.innerWidth > 820;

    if (heroSection && heroCopy && heroPhoto) {
      if (desktop) {
        const limit = Math.max(heroSection.offsetHeight * 0.85, 1);
        const p = clamp01(smoothY / limit);
        const shift = (p * 170).toFixed(2);
        const fade = (1 - p * 0.75).toFixed(3);
        heroCopy.style.transform = `translate3d(-${shift}px, 0, 0)`;
        heroCopy.style.opacity = fade;
        heroPhoto.style.transform = `translate3d(${shift}px, ${(smoothY * -0.08).toFixed(2)}px, 0)`;
        heroPhoto.style.opacity = fade;
      } else {
        heroCopy.style.transform = "";
        heroCopy.style.opacity = "";
        heroPhoto.style.transform = `translate3d(0, ${(smoothY * -0.08).toFixed(2)}px, 0)`;
        heroPhoto.style.opacity = "";
      }
    }

    // «Обо мне»: видео-круг растёт 0.8 → 1, пока долистываем до секции
    if (aboutSection && aboutMedia) {
      const vh = window.innerHeight;
      const top = aboutSection.offsetTop - smoothY;
      const p = clamp01((vh - top) / (vh * 0.6));
      aboutMedia.style.transform = `scale(${(0.6 + 0.4 * p).toFixed(4)})`;
    }

    if (revSection && revLeft && revRight) {
      if (desktop) {
        const vh = window.innerHeight;
        const top = revSection.offsetTop - smoothY;
        const startEdge = vh * 1.0;
        const endEdge = vh * 0.35;
        // у конца страницы прогресс докручивается до 1, чтобы элементы соединились
        const maxScroll = document.documentElement.scrollHeight - vh;
        const endP = maxScroll > 0 ? clamp01(1 - (maxScroll - smoothY) / (vh * 0.35)) : 0;
        const p = Math.max(clamp01((startEdge - top) / (startEdge - endEdge)), endP);
        const shift = ((1 - p) * 170).toFixed(2);
        const fade = (0.15 + 0.85 * p).toFixed(3);
        revLeft.style.transform = `translate3d(-${shift}px, ${((1 - p) * 40).toFixed(2)}px, 0)`;
        revLeft.style.opacity = fade;
        revRight.style.transform = `translate3d(${shift}px, ${((1 - p) * 80).toFixed(2)}px, 0)`;
        revRight.style.opacity = fade;
      } else {
        revLeft.style.transform = "";
        revLeft.style.opacity = "";
        revRight.style.transform = "";
        revRight.style.opacity = "";
      }
    }
  };

  const tick = () => {
    const target = window.scrollY;
    smoothY += (target - smoothY) * 0.12;
    if (Math.abs(target - smoothY) < 0.4) {
      smoothY = target;
      apply();
      rafId = null;
      return;
    }
    apply();
    rafId = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", kick, { passive: true });

  apply();
}

function setupReviewsCarousel() {
  const root = document.getElementById("reviewsCarousel");
  if (!root) return;

  const stack = root.querySelector(".reviews-stack");
  const prevBtn = root.querySelector(".car-prev");
  const nextBtn = root.querySelector(".car-next");
  if (!stack) return;

  let slides = Array.from(stack.children);
  if (slides.length < 2) return;

  const autoDelayMs = 5200;
  const leaveMs = 280;
  const enterMs = 750;
  const canAnimate = !prefersReducedMotion;

  // случайный порядок при каждой загрузке (Fisher–Yates)
  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }
  slides.forEach((slide) => stack.appendChild(slide));

  // логотипы источников вместо надписей; лого + звёзды одним рядом сверху
  slides.forEach((card) => {
    const source = card.querySelector(".reviews-section__source");
    if (!source) return;
    const label = source.textContent.trim();
    source.setAttribute("aria-label", label);
    const icon = /google/i.test(label) ? "i-google" : "i-booksy";
    source.innerHTML = `<svg class="src-logo" viewBox="0 0 24 24" aria-hidden="true"><use href="/sprite.svg#${icon}"></use></svg>`;
    const row = document.createElement("div");
    row.className = "reviews-src-row";
    row.append(source);
    const rating = card.querySelector(".reviews-section__rating");
    if (rating) row.append(rating);
    card.prepend(row);
  });

  let index = 0;
  let busy = false;
  let timer = null;

  slides[0].classList.add("is-current");

  const show = (nextIndex, dir) => {
    if (busy || nextIndex === index) return;
    busy = true;

    const current = slides[index];
    const next = slides[nextIndex];

    current.classList.remove("is-current");
    index = nextIndex;

    if (!canAnimate) {
      next.classList.add("is-current");
      busy = false;
      return;
    }

    // старый улетает влево...
    current.style.transform = `translateX(${dir > 0 ? -70 : 70}px)`;
    setTimeout(() => {
      current.style.transform = "";
      // ...затем новый выезжает слева
      next.style.transition = "none";
      next.style.transform = "translateX(-90px)";
      void next.offsetWidth;
      next.style.transition = "";
      next.classList.add("is-current");
      next.style.transform = "";
      setTimeout(() => {
        busy = false;
      }, enterMs);
    }, leaveMs);
  };

  const go = (dir) => {
    const nextIndex = (index + dir + slides.length) % slides.length;
    show(nextIndex, dir);
  };

  const startAutoplay = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => go(1), autoDelayMs);
  };

  const stopAutoplay = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  if (prevBtn) prevBtn.addEventListener("click", () => { go(-1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { go(1); startAutoplay(); });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  startAutoplay();

  window.addEventListener("beforeunload", stopAutoplay);
}

function setupSupportDropdown() {
  const toggle = document.getElementById("supportToggle");
  const menu = document.getElementById("supportMenu");
  if (!toggle || !menu) return;
  const dropdown = toggle.closest(".support-dropdown");
  if (!dropdown) return;
  const showToast = setupCopyToast();

  menu.hidden = false;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    dropdown.classList.remove("is-open");
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    dropdown.classList.add("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      close();
      return;
    }
    open();
  });

  document.addEventListener("click", (event) => {
    if (dropdown.classList.contains("is-open") && !event.target.closest(".support-dropdown")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dropdown.classList.contains("is-open")) {
      close();
    }
  });

  menu.querySelectorAll(".support-item").forEach((item) => {
    item.addEventListener("click", async (event) => {
      event.preventDefault();
      const walletValue = item.dataset.wallet || "";
      const copied = await copyToClipboard(walletValue);

      if (copied) {
        showToast(t("wallet_copied", { value: walletValue }));
      } else {
        showToast(t("wallet_copy_failed", { value: walletValue }), true);
      }
    });
  });
}

function setupBackgroundVideos() {
  document.querySelectorAll(".vibe-video").forEach((video) => {
    if (prefersReducedMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    video.muted = true;
    const tryPlay = () => {
      const promise = video.play();
      if (promise) promise.catch(() => {});
    };
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      video.load();
    }
  });
}

function init() {
  setupLanguageToggle();
  setupBackgroundVideos();
  setupScrollTextReveal();
  setupRevealAnimations();
  setupParallax();
  setupReviewsCarousel();
  setupSupportDropdown();
}

document.addEventListener("DOMContentLoaded", init);
