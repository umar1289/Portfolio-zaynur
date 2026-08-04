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

export const products: Product[] = [
  { id: "kundalik-forma", name: "Kundalik harbiy forma", category: "harbiy", note: "Kamuflyaj, kuchaytirilgan chok" },
  { id: "bushlat", name: "Bushlat / qishki kurtka", category: "harbiy", note: "Astarli, isitilgan" },
  { id: "shevron", name: "Shevron va nishonlar", category: "harbiy", note: "Kompyuterli vishivka" },
  { id: "signal-kostyum", name: "Signal rangli ishchi kostyum", category: "ishchi", note: "Svetootrajayushchiy lenta bilan" },
  { id: "kombinezon", name: "Kombinezon", category: "ishchi", note: "Zich mato, ko'p kissali" },
  { id: "jilet", name: "Ishchi jileti", category: "ishchi", note: "Logotip bilan, partiyali" },
  { id: "xalat", name: "Xalat va kostyum", category: "tibbiy", note: "Yumshoq mato, tez yuvuvchi" },
  { id: "tez-yordam", name: "Tez yordam formasi", category: "tibbiy", note: "Nishon va yozuv bilan" },
  { id: "maktab-kostyum", name: "Maktab kostyumi", category: "maktab", note: "O'lcham to'plami bo'yicha" },
  { id: "maktab-koylak", name: "Maktab ko'ylagi", category: "maktab", note: "Oq va rangli variant" },
  { id: "sport-forma", name: "Sport shim va futbolka", category: "maktab", note: "Trikotaj, maktab hajmida" },
  { id: "qorovul-forma", name: "Qorovul formasi", category: "ishchi", note: "Yozgi va qishki komplekt" },
];
