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

## Yangi mahsulot qo'shish

`src/data/products.ts` faylini oching va massivga yangi obyekt qo'shing:

```ts
{ id: "yangi-mahsulot", name: "Mahsulot nomi", category: "harbiy", note: "Qisqa izoh" }
```

`category` maydoni `src/data/categories.ts` dagi kategoriyalardan biriga mos kelishi kerak.

## Kontakt ma'lumotlarini yangilash

`src/data/config.ts` faylida Telegram username, WhatsApp raqami, telefon va manzil turadi.

## Build

```bash
npm run build   # dist/ papkasiga statik sayt generatsiya qiladi
npm run preview # build natijasini lokal ko'rish
```
