import productsJson from "./products.json";

export interface Product {
  /** Unique, stable id — used as the list key and in data-attributes. */
  id: string;
  name: string;
  /** Must match a `Category.id` from categories.ts */
  category: string;
  note: string;
  /**
   * File name of the product photo, e.g. "kundalik-forma.jpg".
   * The file must live in `src/assets/images/products/`.
   * Leave empty to show the "surat kutilmoqda" placeholder box.
   */
  image?: string;
}

/**
 * Product data lives in products.json so the admin panel (`npm run admin`)
 * can read and write it without touching TypeScript. Edit it there, or by
 * hand — this file only adds the type on top.
 */
export const products: Product[] = productsJson;
