
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
    book_title: "Book an Appointment",
    book_desc: "Book your appointment on Booksy right now!",
    book_btn: "Book Now",
    reviews_title: "Client Reviews",
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
    book_title: "Забронировать время",
    book_desc: "Запишись на Booksy прямо сейчас!",
    book_btn: "Записаться сейчас",
    reviews_title: "Отзывы клиентов",
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
    book_title: "Umów wizytę",
    book_desc: "Zarezerwuj wizytę na Booksy już teraz!",
    book_btn: "Umów teraz",
    reviews_title: "Opinie klientów",
    wallet_copied: "Skopiowano: {value}",
    wallet_copy_failed: "Nie udało się skopiować. Skopiuj ręcznie: {value}",
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

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

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  localStorage.setItem("ibarber-lang", lang);
}

function setupLanguageToggle() {
  const initialLang = localStorage.getItem("ibarber-lang") || "en";
  applyLanguage(initialLang);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });
}

function setupBeforeAfterSliders() {
  document.querySelectorAll(".ba-slider").forEach((slider) => {
    const range = slider.querySelector(".ba-range");
    if (!range) return;

    const update = () => {
      const val = Number(range.value);
      slider.style.setProperty("--pos", `${val}%`);
    };

    update();

    range.addEventListener("input", update, { passive: true });
    range.addEventListener("pointerdown", () => slider.classList.add("dragging"));
    range.addEventListener("pointerup", () => slider.classList.remove("dragging"));
    range.addEventListener("pointercancel", () => slider.classList.remove("dragging"));
  });
}

function setupRevealAnimations() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const delay = Number(el.dataset.delay || "0");
    el.style.setProperty("--reveal-delay", `${delay}s`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupTiltCards() {
  // Intentionally disabled: no 3D hover tilt interactions.
  return;
}

function setupParallax() {
  if (prefersReducedMotion) return;

  const nodes = document.querySelectorAll(".parallax");
  const update = () => {
    const y = window.scrollY;
    nodes.forEach((node) => {
      const speed = Number(node.dataset.speed || "0.1");
      const moveY = y * speed;
      node.style.transform = `translate3d(0, ${moveY.toFixed(2)}px, 0)`;
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

  update();
}

function setupHeroReviewsRotator() {
  const rotator = document.getElementById("reviewsRotator");
  if (!rotator) return;

  const viewport = rotator.querySelector(".reviews-section__cards");
  const prevButton = rotator.querySelector(".reviews-btn");
  if (!viewport) return;

  const originalSlides = Array.from(viewport.querySelectorAll(".reviews-section__card"));
  if (!originalSlides.length) return;

  const autoRotateDelayMs = 3800;
  const transitionDurationMs = 1400;
  const canAnimate = !prefersReducedMotion;
  const slidesCount = originalSlides.length;

  const track = document.createElement("div");
  track.className = "reviews-section__track";

  if (slidesCount > 1) {
    const cloneLast = originalSlides[slidesCount - 1].cloneNode(true);
    const cloneFirst = originalSlides[0].cloneNode(true);
    cloneLast.setAttribute("aria-hidden", "true");
    cloneFirst.setAttribute("aria-hidden", "true");
    track.append(cloneLast, ...originalSlides, cloneFirst);
  } else {
    track.append(...originalSlides);
  }

  viewport.innerHTML = "";
  viewport.append(track);

  let currentIndex = slidesCount > 1 ? 1 : 0;
  let timer = null;
  let isTransitioning = false;
  let slideHeights = [];
  let slideOffsets = [];
  let uniformSlideHeight = 1;
  let viewportVerticalPadding = 0;
  let resizeRaf = null;

  const recalculateMetrics = () => {
    const trackSlides = Array.from(track.children);
    slideHeights = [];
    slideOffsets = [];
    uniformSlideHeight = 1;

    trackSlides.forEach((slide) => {
      const h = Math.max(slide.offsetHeight, 1);
      if (h > uniformSlideHeight) uniformSlideHeight = h;
    });

    viewport.style.setProperty("--reviews-slide-height", `${uniformSlideHeight}px`);

    const viewportStyles = getComputedStyle(viewport);
    const paddingTop = parseFloat(viewportStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(viewportStyles.paddingBottom) || 0;
    viewportVerticalPadding = paddingTop + paddingBottom;

    trackSlides.forEach((slide, index) => {
      const h = uniformSlideHeight;
      slideHeights[index] = h;
      slideOffsets[index] = slide.offsetTop;
    });
  };

  const updateViewportHeight = () => {
    const currentHeight = slideHeights[currentIndex] || uniformSlideHeight || 1;
    viewport.style.height = `${currentHeight + viewportVerticalPadding}px`;
  };

  const applyPosition = (animated) => {
    if (canAnimate && animated) {
      track.style.transitionDuration = `${transitionDurationMs}ms`;
      track.style.transitionTimingFunction = "var(--reviews-slider-ease, var(--ease-premium))";
    } else {
      track.style.transitionDuration = "0ms";
    }
    const currentOffset = slideOffsets[currentIndex] || 0;
    track.style.transform = `translate3d(0, ${-currentOffset}px, 0)`;
  };

  const jumpIfNeeded = () => {
    if (slidesCount < 2) return;

    if (currentIndex === 0) {
      currentIndex = slidesCount;
      applyPosition(false);
      updateViewportHeight();
    } else if (currentIndex === slidesCount + 1) {
      currentIndex = 1;
      applyPosition(false);
      updateViewportHeight();
    }
  };

  const move = (step) => {
    if (slidesCount < 2) return;
    if (isTransitioning) return;

    currentIndex += step;
    isTransitioning = canAnimate;

    applyPosition(canAnimate);
    updateViewportHeight();

    if (!canAnimate) {
      jumpIfNeeded();
      isTransitioning = false;
    }
  };

  const startAutoplay = () => {
    if (slidesCount < 2) return;
    if (timer) clearInterval(timer);
    timer = setInterval(() => move(1), autoRotateDelayMs);
  };

  const stopAutoplay = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  recalculateMetrics();
  applyPosition(false);
  updateViewportHeight();
  startAutoplay();

  if (prevButton) {
    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      move(-1);
      startAutoplay();
    });
  }

  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);
  rotator.addEventListener("focusin", stopAutoplay);
  rotator.addEventListener("focusout", startAutoplay);

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    jumpIfNeeded();
    isTransitioning = false;
  });

  window.addEventListener(
    "resize",
    () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        recalculateMetrics();
        applyPosition(false);
        updateViewportHeight();
      });
    },
    { passive: true }
  );

  window.addEventListener("beforeunload", () => {
    stopAutoplay();
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
  });
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

function init() {
  setupLanguageToggle();
  setupBeforeAfterSliders();
  setupRevealAnimations();
  setupTiltCards();
  setupParallax();
  setupHeroReviewsRotator();
  setupSupportDropdown();
}

document.addEventListener("DOMContentLoaded", init);
