# Zaynur Diyor Fayz — portfolio sayti

Statik sayt, [Astro](https://astro.build) bilan qurilgan.

## Ishga tushirish

```bash
npm install
npm run dev
```

`http://localhost:4321` da ochiladi.

## Loyiha tuzilmasi

```
src/
  components/   — har bir bo'lim alohida komponent (Hero, Portfolio, Faq, ...)
  data/         — tahrirlanadigan ma'lumotlar (mahsulotlar, kategoriyalar, savollar, kontakt)
  layouts/      — umumiy sahifa qobig'i (BaseLayout.astro)
  pages/        — marshrutlar (index.astro — bosh sahifa)
  scripts/      — mijoz tomonidagi interaktivlik (filtr, lightbox, FAQ)
  styles/       — global.css (dizayn o'zgarmagan, asl uslublar shu yerda)
```

## Yangi mahsulot qo'shish — admin panel

Finder'da loyiha papkasini oching va **`Katalog admin.command`** faylini ikki
marta bosing. Brauzerda panel ochiladi (`http://localhost:4322`):

1. Nomi, kategoriyasi, qisqa izohi kiritiladi
2. Surat sudrab tashlanadi (JPG / PNG / WebP)
3. **Qo'shish** bosiladi
4. Oxirida **Saytga chiqarish** bosiladi — 1-2 daqiqada sayt yangilanadi

Panel shu bilan birga mahsulotni o'chirish va tartibini o'zgartirish
imkonini ham beradi. Ishni tugatgach, ochilgan Terminal oynasini yopish
kifoya.

Panel ostida oddiy fayllar turadi, ya'ni xohlasangiz qo'lda ham
tahrirlashingiz mumkin:

- ro'yxat — `src/data/products.json`
- suratlar — `src/assets/images/products/` (fayl nomi JSON'dagi `image`
  qiymatiga mos bo'lishi kerak)

Yangi **kategoriya** qo'shish uchun `src/data/categories.ts` tahrirlanadi.

## Kontakt ma'lumotlarini yangilash

`src/data/config.ts` faylida Telegram username, telefon va manzil turadi.

## Build

```bash
npm run build   # dist/ papkasiga statik sayt generatsiya qiladi
npm run preview # build natijasini lokal ko'rish
```
