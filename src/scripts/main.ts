// Progressive-enhancement behavior for the portfolio filter, lightbox and FAQ
// accordion. All markup is server-rendered by Astro; this only toggles
// classes/attributes on top of it.

function initGalleryFilter(): void {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
  const productCards = document.querySelectorAll<HTMLButtonElement>(".product-card");
  const emptyMessage = document.getElementById("portfolioEmpty");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter ?? "all";
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));

      let visibleCount = 0;
      productCards.forEach((card) => {
        const show = filter === "all" || card.dataset.cat === filter;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    });
  });
}

function initLightbox(): void {
  const lightbox = document.getElementById("lightbox");
  const overlay = document.getElementById("lightboxOverlay");
  const box = document.getElementById("lightboxBox");
  const photo = document.getElementById("lightboxPhoto");
  const img = document.getElementById("lightboxImg") as HTMLImageElement | null;
  const closeBtn = document.getElementById("lightboxClose");
  const nameEl = document.getElementById("lightboxName");
  const noteEl = document.getElementById("lightboxNote");
  const productCards = document.querySelectorAll<HTMLButtonElement>(".product-card");

  if (!lightbox || !overlay || !box || !photo || !img || !closeBtn || !nameEl || !noteEl) return;

  box.addEventListener("click", (e) => e.stopPropagation());

  // Navigation walks only the currently *visible* (filtered) cards.
  const visibleCards = () => Array.from(productCards).filter((c) => !c.hidden);
  let currentIndex = 0;

  const show = (card: HTMLButtonElement) => {
    nameEl.textContent = card.dataset.name ?? "";
    noteEl.textContent = card.dataset.note ?? "";

    const src = card.dataset.lightboxSrc;
    if (src) {
      img.src = src;
      img.width = Number(card.dataset.lightboxWidth) || 0;
      img.height = Number(card.dataset.lightboxHeight) || 0;
      img.alt = card.dataset.name ?? "";
      img.hidden = false;
      photo.classList.add("has-image");
    } else {
      img.hidden = true;
      img.removeAttribute("src");
      photo.classList.remove("has-image");
    }
  };

  const open = (card: HTMLButtonElement) => {
    const cards = visibleCards();
    currentIndex = cards.indexOf(card);
    show(card);
    lightbox.hidden = false;
  };

  const close = () => {
    lightbox.hidden = true;
  };

  const step = (delta: number) => {
    const cards = visibleCards();
    if (cards.length === 0) return;
    currentIndex = (currentIndex + delta + cards.length) % cards.length;
    show(cards[currentIndex]);
  };

  productCards.forEach((card) => card.addEventListener("click", () => open(card)));
  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  // Swipe left/right on touch devices.
  let touchStartX = 0;
  overlay.addEventListener(
    "touchstart",
    (e: TouchEvent) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );
  overlay.addEventListener(
    "touchend",
    (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) < 40) return; // ignore taps / tiny jitter
      step(delta > 0 ? -1 : 1);
    },
    { passive: true },
  );
}

function initFaqAccordion(): void {
  const items = document.querySelectorAll<HTMLElement>(".faq-item");

  items.forEach((item) => {
    const question = item.querySelector<HTMLButtonElement>(".faq-question");
    const sign = item.querySelector<HTMLElement>(".faq-sign");
    if (!question || !sign) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      items.forEach((i) => {
        i.classList.remove("is-open");
        const s = i.querySelector<HTMLElement>(".faq-sign");
        const q = i.querySelector<HTMLButtonElement>(".faq-question");
        if (s) s.textContent = "+";
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        sign.textContent = "—";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

initGalleryFilter();
initLightbox();
initFaqAccordion();
