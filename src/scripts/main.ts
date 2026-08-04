// Progressive-enhancement behavior for the portfolio filter, lightbox and FAQ
// accordion. All markup is server-rendered by Astro; this only toggles
// classes/attributes on top of it.
//
// NOTE: this currently ports the original behavior 1:1 (open/close + Esc).
// Keyboard arrow navigation and swipe support land in a later phase.

function initGalleryFilter(): void {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
  const productCards = document.querySelectorAll<HTMLButtonElement>(".product-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter ?? "all";
      filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      productCards.forEach((card) => {
        const show = filter === "all" || card.dataset.cat === filter;
        card.hidden = !show;
      });
    });
  });
}

function initLightbox(): void {
  const lightbox = document.getElementById("lightbox");
  const overlay = document.getElementById("lightboxOverlay");
  const box = document.getElementById("lightboxBox");
  const closeBtn = document.getElementById("lightboxClose");
  const nameEl = document.getElementById("lightboxName");
  const noteEl = document.getElementById("lightboxNote");
  const productCards = document.querySelectorAll<HTMLButtonElement>(".product-card");

  if (!lightbox || !overlay || !box || !closeBtn || !nameEl || !noteEl) return;

  box.addEventListener("click", (e) => e.stopPropagation());

  const open = (card: HTMLButtonElement) => {
    nameEl.textContent = card.dataset.name ?? "";
    noteEl.textContent = card.dataset.note ?? "";
    lightbox.hidden = false;
  };

  const close = () => {
    lightbox.hidden = true;
  };

  productCards.forEach((card) => card.addEventListener("click", () => open(card)));
  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
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
