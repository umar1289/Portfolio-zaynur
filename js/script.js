(() => {
  const CATEGORIES = [
    { id: "all", label: "Barchasi" },
    { id: "harbiy", label: "Harbiy kiyim" },
    { id: "ishchi", label: "Maxsus ishchi formasi" },
    { id: "tibbiy", label: "Tibbiy" },
    { id: "maktab", label: "Maktab formasi" }
  ];

  const ITEMS = [
    { name: "Kundalik harbiy forma", cat: "harbiy", note: "Kamuflyaj, kuchaytirilgan chok" },
    { name: "Bushlat / qishki kurtka", cat: "harbiy", note: "Astarli, isitilgan" },
    { name: "Shevron va nishonlar", cat: "harbiy", note: "Kompyuterli vishivka" },
    { name: "Signal rangli ishchi kostyum", cat: "ishchi", note: "Svetootrajayushchiy lenta bilan" },
    { name: "Kombinezon", cat: "ishchi", note: "Zich mato, ko'p kissali" },
    { name: "Ishchi jileti", cat: "ishchi", note: "Logotip bilan, partiyali" },
    { name: "Xalat va kostyum", cat: "tibbiy", note: "Yumshoq mato, tez yuvuvchi" },
    { name: "Tez yordam formasi", cat: "tibbiy", note: "Nishon va yozuv bilan" },
    { name: "Maktab kostyumi", cat: "maktab", note: "O'lcham to'plami bo'yicha" },
    { name: "Maktab ko'ylagi", cat: "maktab", note: "Oq va rangli variant" },
    { name: "Sport shim va futbolka", cat: "maktab", note: "Trikotaj, maktab hajmida" },
    { name: "Qorovul formasi", cat: "ishchi", note: "Yozgi va qishki komplekt" }
  ];

  const FAQS = [
    { q: "Minimal buyurtma hajmi qancha?", a: "Kelishuv asosida. Mahsulot turi, mato va muddatga qarab belgilanadi — namunali kichik partiyalar ham ko'riladi." },
    { q: "Matoni siz topasizmi yoki men beramanmi?", a: "Ikkisi ham bo'ladi. Doimiy mato yetkazib beruvchilarimiz bor; buyurtmachi o'z matosini bersa ham ishlaymiz (davaljniy usulda)." },
    { q: "Muddat qancha bo'ladi?", a: "O'rtacha 10 000 dona forma uchun 20–30 kun. Aniq muddat namuna tasdiqlangandan keyin yozma belgilanadi." },
    { q: "Namuna tikib berasizmi?", a: "Ha. Katta partiyadan oldin tasdiq uchun namuna tikiladi va etalon sifatida sexda saqlanadi." },
    { q: "Davlat tenderlari bilan ishlaysizmi?", a: "Ha, 18 yildan beri. Mudofaa Vazirligi, IIB, FVV va tez tibbiy yordam xizmati buyurtmalarini bajarib kelmoqdamiz." },
    { q: "Logotip va yozuv qo'yish mumkinmi?", a: "Mumkin — kompyuterli vishivka va shevron. Namunani Telegramga tashlasangiz yetarli." }
  ];

  const catLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || "";

  let activeCat = "all";
  let openFaqIndex = 0;

  const filterList = document.getElementById("filterList");
  const portfolioGrid = document.getElementById("portfolioGrid");
  const faqList = document.getElementById("faqList");
  const lightbox = document.getElementById("lightbox");
  const lightboxOverlay = document.getElementById("lightboxOverlay");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxName = document.getElementById("lightboxName");
  const lightboxNote = document.getElementById("lightboxNote");

  function renderFilters() {
    filterList.innerHTML = "";
    CATEGORIES.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-btn" + (c.id === activeCat ? " is-active" : "");
      btn.textContent = c.label;
      btn.addEventListener("click", () => {
        activeCat = c.id;
        renderFilters();
        renderGrid();
      });
      filterList.appendChild(btn);
    });
  }

  function renderGrid() {
    portfolioGrid.innerHTML = "";
    ITEMS.filter((i) => activeCat === "all" || i.cat === activeCat).forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-photo placeholder">
          <div class="placeholder-stripes"></div>
          <div class="placeholder-label">surat 1200×1600</div>
        </div>
        <div class="product-meta">
          <div class="product-name"></div>
          <div class="product-cat"></div>
        </div>
        <div class="product-note"></div>
      `;
      card.querySelector(".product-name").textContent = item.name;
      card.querySelector(".product-cat").textContent = catLabel(item.cat);
      card.querySelector(".product-note").textContent = item.note;
      card.addEventListener("click", () => openLightbox(item));
      portfolioGrid.appendChild(card);
    });
  }

  function renderFaqs() {
    faqList.innerHTML = "";
    FAQS.forEach((faq, idx) => {
      const isOpen = openFaqIndex === idx;
      const item = document.createElement("div");
      item.className = "faq-item" + (isOpen ? " is-open" : "");
      item.innerHTML = `
        <button type="button" class="faq-question">
          <span class="faq-sign">${isOpen ? "—" : "+"}</span>
          <span class="faq-q"></span>
        </button>
        <div class="faq-answer"></div>
      `;
      item.querySelector(".faq-q").textContent = faq.q;
      item.querySelector(".faq-answer").textContent = faq.a;
      item.querySelector(".faq-question").addEventListener("click", () => {
        openFaqIndex = isOpen ? -1 : idx;
        renderFaqs();
      });
      faqList.appendChild(item);
    });
  }

  function openLightbox(item) {
    lightboxName.textContent = item.name;
    lightboxNote.textContent = item.note + " · " + catLabel(item.cat);
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
  }

  lightboxOverlay.addEventListener("click", closeLightbox);
  lightboxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  renderFilters();
  renderGrid();
  renderFaqs();
})();
