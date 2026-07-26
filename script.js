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
    wallet_copied: "Copied",
    wallet_copy_failed: "Unable to copy — copy manually",
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
    book_btn: "Записаться",
    reviews_title: "Отзывы клиентов",
    rating_caption: "5.0 на Google и Booksy",
    about_title: "Обо мне",
    about_text: "Более 8 лет опыта в мужских стрижках и уходе за бородой. Работаю в центре Варшавы. Гарантирую высокое качество результата. Среди моих клиентов — IT-специалисты, премиальные клиенты и публичные личности.",
    wallet_copied: "Скопировано",
    wallet_copy_failed: "Не удалось скопировать — скопируйте вручную",
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
    wallet_copied: "Skopiowano",
    wallet_copy_failed: "Nie udało się skopiować — skopiuj ręcznie",
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

let refreshScrollText = null;
let updateAboutWords = null;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

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
    <span class="copy-toast__label">
      <span class="copy-toast__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" focusable="false">
          <rect x="13" y="9" width="14" height="18"></rect>
          <polyline points="11,23 5,23 5,5 19,5 19,7"></polyline>
        </svg>
      </span>
      <span class="copy-toast__label-text"></span>
    </span>
    <span class="copy-toast__value"></span>
  `;
  document.body.appendChild(toast);
  const labelNode = toast.querySelector(".copy-toast__label-text");
  const valueNode = toast.querySelector(".copy-toast__value");

  let hideTimer = null;
  return (label, value = "", isError = false) => {
    if (labelNode) labelNode.textContent = label;
    if (valueNode) valueNode.textContent = value;
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
  const section = el.closest(".about-note");

  let spans = [];
  let prevOps = [];

  const split = () => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    spans = Array.from(el.querySelectorAll(".w"));
    prevOps = new Array(spans.length).fill("");
    if (updateAboutWords) updateAboutWords(window.scrollY);
  };

  // текст проявляется, пока секция запинена (sticky в CSS); вызывается из
  // lerp-цикла setupParallax — тот же сглаженный скролл, что у остальных анимаций.
  // К 82% пина все слова видимы — остаток пина как пауза перед продолжением
  updateAboutWords = (smoothY) => {
    if (!spans.length || !section) return;
    const runway = Math.max(section.offsetHeight - window.innerHeight, 1);
    const p = clamp01((smoothY - section.offsetTop) / (runway * 0.82));
    const raw = p * spans.length;
    // писать стиль только при изменении: 40 записей/кадр дёргали скролл на iOS
    spans.forEach((span, index) => {
      const t = clamp01(raw - index);
      const o = (0.14 + 0.86 * t).toFixed(2);
      if (prevOps[index] !== o) {
        prevOps[index] = o;
        span.style.opacity = o;
      }
    });
  };

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

  const apply = () => {
    const vh = window.innerHeight;
    const mobile = window.innerWidth <= 820;

    if (heroSection && heroCopy && heroPhoto) {
      const limit = Math.max(heroSection.offsetHeight * 0.85, 1);
      const p = clamp01(smoothY / limit);
      const fade = (1 - p * 0.75).toFixed(3);
      if (mobile) {
        // мобиле: улетают ВВЕРХ (и возвращаются сверху), фото быстрее — параллакс
        heroCopy.style.transform = `translate3d(0, ${(-p * 80).toFixed(2)}px, 0)`;
        heroPhoto.style.transform = `translate3d(0, ${(-p * 140).toFixed(2)}px, 0)`;
      } else {
        const shift = (p * 170).toFixed(2);
        heroCopy.style.transform = `translate3d(-${shift}px, 0, 0)`;
        heroPhoto.style.transform = `translate3d(${shift}px, ${(smoothY * -0.08).toFixed(2)}px, 0)`;
      }
      heroCopy.style.opacity = fade;
      heroPhoto.style.opacity = fade;
    }

    // «Обо мне»: видео-круг растёт 0.6 → 1 на подходе, во время пина медленно всплывает
    if (aboutSection && aboutMedia) {
      const top = aboutSection.offsetTop - smoothY;
      const enterP = clamp01((vh - top) / (vh * 0.85));
      const runway = Math.max(aboutSection.offsetHeight - vh, 1);
      const pinP = clamp01((smoothY - aboutSection.offsetTop) / runway);
      aboutMedia.style.transform = `translate3d(0, ${((1 - enterP) * 70 - pinP * 46).toFixed(2)}px, 0) scale(${(0.6 + 0.4 * enterP).toFixed(4)})`;
    }
    if (updateAboutWords) updateAboutWords(smoothY);

    if (revSection && revLeft && revRight) {
      const top = revSection.offsetTop - smoothY;
      // мобиле: диапазон длиннее — движение растянуто почти на весь экран скролла
      const startEdge = vh * (mobile ? 1.1 : 1.0);
      const endEdge = vh * (mobile ? 0.12 : 0.35);
      // у конца страницы прогресс докручивается до 1, чтобы элементы соединились
      const maxScroll = document.documentElement.scrollHeight - vh;
      const endP = maxScroll > 0 ? clamp01(1 - (maxScroll - smoothY) / (vh * 0.35)) : 0;
      const p = Math.max(clamp01((startEdge - top) / (startEdge - endEdge)), endP);
      const fade = (0.15 + 0.85 * p).toFixed(3);
      if (mobile) {
        // мобиле: наоборот — приходят СНИЗУ, медиа едет дальше (параллакс)
        revLeft.style.transform = `translate3d(0, ${((1 - p) * 90).toFixed(2)}px, 0)`;
        revRight.style.transform = `translate3d(0, ${((1 - p) * 150).toFixed(2)}px, 0)`;
      } else {
        const shift = ((1 - p) * 170).toFixed(2);
        revLeft.style.transform = `translate3d(-${shift}px, ${((1 - p) * 40).toFixed(2)}px, 0)`;
        revRight.style.transform = `translate3d(${shift}px, ${((1 - p) * 80).toFixed(2)}px, 0)`;
      }
      revLeft.style.opacity = fade;
      revRight.style.opacity = fade;
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
  const canAnimate = !prefersReducedMotion && typeof Element.prototype.animate === "function";

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
    source.setAttribute("role", "img");
    source.setAttribute("aria-label", label);
    const icon = /google/i.test(label) ? "i-google" : "i-booksy";
    const mod = icon === "i-booksy" ? " src-logo--booksy" : "";
    source.innerHTML = `<svg class="src-logo${mod}" viewBox="0 0 24 24" aria-hidden="true"><use href="/sprite.svg?v=4#${icon}"></use></svg>`;
    const row = document.createElement("div");
    row.className = "reviews-src-row";
    row.append(source);
    const rating = card.querySelector(".reviews-section__rating");
    if (rating) row.append(rating);
    card.prepend(row);
  });

  let index = 0;
  let timer = null;
  let activeAnims = [];

  slides[0].classList.add("is-current");

  // мгновенно завершить текущий переход: уходящий скрыт, входящий на месте
  const settle = () => {
    activeAnims.forEach((anim) => {
      try {
        anim.finish();
      } catch (_e) {
        anim.cancel();
      }
    });
    activeAnims = [];
  };

  const go = (dir) => {
    settle();

    const from = slides[index];
    index = (index + dir + slides.length) % slides.length;
    const to = slides[index];
    if (from === to) return;

    from.classList.remove("is-current");
    to.classList.add("is-current");

    if (!canAnimate) return;

    // уход: короткий сдвиг в сторону листания с затуханием
    const out = from.animate(
      [
        { transform: "translateX(0)", opacity: 1, visibility: "visible" },
        { transform: `translateX(${dir > 0 ? -70 : 70}px)`, opacity: 0, visibility: "visible" },
      ],
      { duration: 240, easing: "cubic-bezier(0.35, 0, 0.75, 0.5)" }
    );

    // вход: после ухода, выезжает слева с expo.out-торможением
    const inn = to.animate(
      [
        { transform: "translateX(-90px)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 },
      ],
      { duration: 650, delay: 190, fill: "backwards", easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );

    activeAnims = [out, inn];
    inn.onfinish = () => {
      activeAnims = [];
    };
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
}

// бегущее свечение по кромке btn-glass (стиль getlayers.ai):
// блобы движутся по периметру скруглённого прямоугольника, маска
// показывает их только в 1.5px-кольце
function setupBorderGlow() {
  const glows = Array.from(document.querySelectorAll(".btn-glass .border-glow"));
  if (!glows.length || prefersReducedMotion) return;

  const radii = new Map();
  const readRadius = (glow) => {
    const r = parseFloat(getComputedStyle(glow).borderTopLeftRadius) || 0;
    radii.set(glow, r);
    return r;
  };
  window.addEventListener("resize", () => radii.clear(), { passive: true });

  // точка на периметре скруглённого прямоугольника, d — путь по часовой от (r,0)
  const pointAt = (d, w, h, r) => {
    const sw = w - 2 * r;
    const sh = h - 2 * r;
    const arc = (Math.PI * r) / 2;
    let seg = d;
    if (seg < sw) return { x: r + seg, y: 0 };
    seg -= sw;
    if (seg < arc) {
      const a = -Math.PI / 2 + seg / r;
      return { x: w - r + r * Math.cos(a), y: r + r * Math.sin(a) };
    }
    seg -= arc;
    if (seg < sh) return { x: w, y: r + seg };
    seg -= sh;
    if (seg < arc) {
      const a = seg / r;
      return { x: w - r + r * Math.cos(a), y: h - r + r * Math.sin(a) };
    }
    seg -= arc;
    if (seg < sw) return { x: w - r - seg, y: h };
    seg -= sw;
    if (seg < arc) {
      const a = Math.PI / 2 + seg / r;
      return { x: r + r * Math.cos(a), y: h - r + r * Math.sin(a) };
    }
    seg -= arc;
    if (seg < sh) return { x: 0, y: h - r - seg };
    seg -= sh;
    const a = Math.PI + seg / r;
    return { x: r + r * Math.cos(a), y: r + r * Math.sin(a) };
  };

  const speed = 90; // px/с вдоль кромки
  let dist = 0;
  let last = performance.now();

  const frame = (now) => {
    dist += ((now - last) / 1000) * speed;
    last = now;
    glows.forEach((glow) => {
      const w = glow.offsetWidth;
      const h = glow.offsetHeight;
      if (!w || !h) return;
      const r = Math.min(radii.has(glow) ? radii.get(glow) : readRadius(glow), w / 2, h / 2);
      const per = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
      const blobs = glow.children;
      for (let i = 0; i < blobs.length; i++) {
        const d = (dist + (per * i) / blobs.length) % per;
        const pt = pointAt(d, w, h, r);
        blobs[i].style.transform = `translate(-50%, -50%) translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
      }
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function setupSupportDropdown() {
  const showToast = setupCopyToast();

  const heroMenu = document.getElementById("supportMenu");
  if (heroMenu) heroMenu.hidden = false;

  // два дропдауна с одной логикой: Donate в хиро (десктоп) и FAB над доком (мобиле)
  const groups = [document.getElementById("supportToggle"), document.getElementById("donateFabToggle")]
    .filter(Boolean)
    .map((toggle) => ({ toggle, root: toggle.closest(".support-dropdown, .donate-fab") }))
    .filter((group) => group.root);

  const closeAll = () => {
    groups.forEach(({ toggle, root }) => {
      toggle.setAttribute("aria-expanded", "false");
      root.classList.remove("is-open");
    });
  };

  groups.forEach(({ toggle, root }) => {
    toggle.addEventListener("click", () => {
      const wasOpen = root.classList.contains("is-open");
      closeAll();
      if (!wasOpen) {
        toggle.setAttribute("aria-expanded", "true");
        root.classList.add("is-open");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".support-dropdown, .donate-fab")) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  document.querySelectorAll(".support-item").forEach((item) => {
    item.addEventListener("click", async (event) => {
      event.preventDefault();
      const walletValue = item.dataset.wallet || "";
      const copied = await copyToClipboard(walletValue);

      if (copied) {
        showToast(t("wallet_copied"), walletValue);
      } else {
        showToast(t("wallet_copy_failed"), walletValue, true);
      }
    });
  });
}

function setupBackgroundVideos() {
  const videos = Array.from(document.querySelectorAll(".vibe-video"));
  if (!videos.length) return;

  if (prefersReducedMotion) {
    videos.forEach((video) => {
      video.removeAttribute("autoplay");
      video.pause();
    });
    return;
  }

  const tryPlay = (video) => {
    video.muted = true;
    video.playsInline = true;
    const promise = video.play();
    if (promise) promise.catch(() => {});
  };

  videos.forEach((video) => {
    if (video.readyState >= 2) {
      tryPlay(video);
    } else {
      video.addEventListener("canplay", () => tryPlay(video), { once: true });
      video.load();
    }
  });

  // iOS (Low Power Mode и пр.) блокирует автоплей — повторяем на первом жесте
  const retry = () => {
    videos.forEach((video) => {
      if (video.paused) tryPlay(video);
    });
  };
  window.addEventListener("touchstart", retry, { once: true, passive: true });
  window.addEventListener("click", retry, { once: true, passive: true });

  // играть только в кадре: iOS охотнее стартует по появлению, плюс экономия батареи
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.paused) tryPlay(video);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    videos.forEach((video) => io.observe(video));
  }
}

function init() {
  setupLanguageToggle();
  setupBackgroundVideos();
  setupScrollTextReveal();
  setupRevealAnimations();
  setupParallax();
  setupReviewsCarousel();
  setupSupportDropdown();
  setupBorderGlow();
}

document.addEventListener("DOMContentLoaded", init);
