/**
 * Build-time image lookup helpers.
 *
 * `import.meta.glob` is resolved by Vite at build time, so any file that
 * matches these patterns is picked up automatically — nothing to register
 * by hand. Restart `npm run dev` (or re-run `npm run build`) after adding a
 * new file so Vite re-scans the directory.
 */

type ImageModule = { default: ImageMetadata };

const productImageModules = import.meta.glob<ImageModule>(
  "/src/assets/images/products/*.{jpeg,jpg,png,webp,avif}",
  { eager: true },
);

const heroImageModules = import.meta.glob<ImageModule>(
  "/src/assets/images/hero/*.{jpeg,jpg,png,webp,avif}",
  { eager: true },
);

const processImageModules = import.meta.glob<ImageModule>(
  "/src/assets/images/process/*.{jpeg,jpg,png,webp,avif}",
  { eager: true },
);

function basename(path: string): string {
  return path.split("/").pop() ?? path;
}

function toMap(modules: Record<string, ImageModule>): Map<string, ImageMetadata> {
  return new Map(Object.entries(modules).map(([path, mod]) => [basename(path), mod.default]));
}

const productImages = toMap(productImageModules);
const heroImages = toMap(heroImageModules);
const processImages = toMap(processImageModules);

/** Look up a product photo by the `image` filename set in `src/data/products.ts`. */
export function findProductImage(filename: string | undefined): ImageMetadata | undefined {
  return filename ? productImages.get(filename) : undefined;
}

/** Single-slot lookups: drop exactly one file in the folder, any filename. */
export function getHeroImage(): ImageMetadata | undefined {
  return heroImages.values().next().value;
}

export function getProcessImage(): ImageMetadata | undefined {
  return processImages.values().next().value;
}
