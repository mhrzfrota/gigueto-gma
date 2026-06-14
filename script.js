const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll("[data-nav] a");
const progress = document.querySelector("[data-progress]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Menu mobile ---------- */
const closeMenu = () => {
  document.body.classList.remove("menu-open");
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
    return;
  }

  document.body.classList.add("menu-open");
  nav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

/* ---------- Header + barra de progresso ---------- */
const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${Math.min(ratio, 1)})`;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Reveal ao rolar ---------- */
const revealItems = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
}

/* ---------- Contadores animados ---------- */
const counters = document.querySelectorAll("[data-count]");

const formatNumber = (value) => value.toLocaleString("pt-BR");

const animateCounter = (el) => {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || "";

  if (prefersReducedMotion) {
    el.textContent = formatNumber(target) + suffix;
    return;
  }

  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3); // easeOutCubic
    el.textContent = formatNumber(Math.round(target * eased)) + suffix;

    if (elapsed < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }
}

/* ---------- Ano no rodapé ---------- */
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = new Date().getFullYear();
