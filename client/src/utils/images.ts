/**
 * Normalises an image value from either format the backend may return:
 *   • string  → "/shahi_guluband.jpg"   (local product seed)
 *   • object  → { url: "/shahi_guluband.jpg", alt: "...", isPrimary: true }
 *
 * Returns an absolute-ish URL usable directly in <img src={}>.
 */
export type ImageValue = string | { url: string; alt?: string; isPrimary?: boolean };

export function getImageUrl(image: ImageValue | undefined, fallback = '/placeholder.jpg'): string {
  if (!image) return fallback;
  if (typeof image === 'string') return image;
  return image.url || fallback;
}

/**
 * Gets the first image URL from an array of mixed ImageValue entries.
 */
export function getFirstImage(images: ImageValue[] | undefined, fallback = '/placeholder.jpg'): string {
  if (!images || images.length === 0) return fallback;
  return getImageUrl(images[0], fallback);
}

/**
 * Maps a mixed images array to plain string URLs.
 */
export function normaliseImages(images: ImageValue[] | undefined): string[] {
  if (!images) return [];
  return images.map(img => getImageUrl(img));
}
