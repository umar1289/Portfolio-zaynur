export interface Category {
  id: string;
  label: string;
}

export const categories: Category[] = [
  { id: "all", label: "Barchasi" },
  { id: "harbiy", label: "Harbiy kiyim" },
  { id: "ishchi", label: "Maxsus ishchi formasi" },
  { id: "tibbiy", label: "Tibbiy" },
  { id: "maktab", label: "Maktab formasi" },
];

export function categoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? "";
}
