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

function basename(path: string): string {
  return path.split("/").pop() ?? path;
}

function toMap(modules: Record<string, ImageModule>): Map<string, ImageMetadata> {
  return new Map(Object.entries(modules).map(([path, mod]) => [basename(path), mod.default]));
}

const productImages = toMap(productImageModules);
const heroImages = toMap(heroImageModules);

/**
 * Look up a product photo by the `image` value set in `src/data/products.json`.
 * Tolerates a bare filename or any path prefix — only the file name matters.
 */
export function findProductImage(filename: string | undefined): ImageMetadata | undefined {
  if (!filename) return undefined;
  return productImages.get(basename(filename));
}

/** Single-slot lookup: drop exactly one file in the folder, any filename. */
export function getHeroImage(): ImageMetadata | undefined {
  return heroImages.values().next().value;
}
