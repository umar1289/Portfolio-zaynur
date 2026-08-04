# Mahsulot rasmlari

Rasm faylini shu papkaga tashlang. Fayl nomi `src/data/products.ts` dagi
o'sha mahsulotning `image` maydoniga aynan mos kelishi kerak:

```ts
// src/data/products.ts
{ id: "kundalik-forma", name: "Kundalik harbiy forma", category: "harbiy",
  note: "...", image: "kundalik-forma.jpg" }
```

```
src/assets/images/products/kundalik-forma.jpg   ← shu fayl
```

Qo'llab-quvvatlanadigan formatlar: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
Build vaqtida avtomatik WebP/AVIF'ga o'giriladi, bir necha o'lchamda
(`srcset`) generatsiya qilinadi va lazy-load qilinadi — qo'lda hech narsa
qilish shart emas.

Rasm qo'shgandan keyin `npm run dev` serverini qayta ishga tushiring
(yoki `npm run build` qiling) — Vite yangi faylni shunda payqaydi.
