export interface ImageItem {
  src: string;
  alt: string;
}

export interface GalleryItem {
  title: string;
  description: string;
  images: ImageItem[];
  categoryIcon: React.ReactNode;
}

export const normalize = (name: string) =>
  name.replace(/[\s-]+/g, '_');

export const groupImages = (modules: Record<string, string>): Omit<GalleryItem, 'categoryIcon'>[] => {
  const grouped: Record<string, string[]> = {};

  Object.entries(modules).forEach(([path, src]) => {
    let folder = path.split('/').slice(-2)[0];
    folder = normalize(folder);

    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push(src as string);
  });

  return Object.entries(grouped).map(([folder, images]) => ({
    title: folder.replace(/_/g, ' '),
    description: `Gallery for ${folder.replace(/_/g, ' ')}`,
    images: images.map((src, i) => ({
      src,
      alt: `${folder} image ${i + 1}`
    }))
  }));
};

// Production-safe image maps using Vite glob importer
// Maps filename (without ext) -> build-time resolved URL
// Vite automatically optimizes, hashes, and serves via /assets/ in production (Vercel-safe)
const programGlob = import.meta.glob('/src/assets/images/programs/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });
export const programImages: Record<string, string> = Object.fromEntries(
  Object.entries(programGlob).map(([key, url]) => {
    const filename = key.split('/').pop()?.replace(/\.[^/.]+$/, "") || "fallback";
    return [filename, url as string];
  })
);

const partnerGlob = import.meta.glob('/src/assets/images/partners/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });
export const partnerImages: Record<string, string> = Object.fromEntries(
  Object.entries(partnerGlob).map(([key, url]) => {
    const filename = key.split('/').pop()?.replace(/\.[^/.]+$/, "") || "fallback";
    return [filename, url as string];
  })
);

