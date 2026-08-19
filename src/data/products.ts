export interface Product {
  /** Unique, stable id — used as the React/Astro list key and in data-attributes. */
  id: string;
  name: string;
  /** Must match a `Category.id` from categories.ts */
  category: string;
  note: string;
  /**
   * Optional file name of the product photo, e.g. "kundalik-forma.jpg".
   * The file must live in `src/assets/images/products/`.
   * Leave undefined to show the "surat kutilmoqda" placeholder box.
   */
  image?: string;
}

// Boshqa mahsulotlar vaqtincha olib tashlandi (hozircha faqat real surati
// bor mahsulotlar ko'rsatiladi). Avvalgi to'liq ro'yxat git tarixida bor —
// git show f8d186a:js/script.js orqali qaytarish mumkin.
export const products: Product[] = [
  { id: "kundalik-forma", name: "Kundalik harbiy forma", category: "harbiy", note: "Kamuflyaj, kuchaytirilgan chok", image: "kundalik-forma.png" },
  { id: "qishki-dala-kurtkasi", name: "Qishki dala kurtkasi", category: "harbiy", note: "Kamuflyaj, mo'ynali yoqa, astarli", image: "qishki-dala-kurtkasi.jpg" },
  { id: "tez-yordam", name: "Tez yordam formasi", category: "tibbiy", note: "Nishon va yozuv bilan", image: "tez-yordam.png" },
];
