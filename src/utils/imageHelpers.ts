

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

import { getSignedUrl as storageGetSignedUrl } from './storageHelpers';

export const getSignedUrl = storageGetSignedUrl;

export const groupImages = async (modules: Record<string, string>): Promise<Omit<GalleryItem, 'categoryIcon'>[]> => {
  const grouped: Record<string, string[]> = {};

  Object.entries(modules).forEach(([path, src]) => {
    let folder = path.split('/').slice(-2)[0];
    folder = normalize(folder);

    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push(src as string);
  });

  const galleries = await Promise.all(
    Object.entries(grouped).map(async ([folder, images]) => {
      const signedImages = await Promise.all(
        images.map(async (src) => {
          const signedUrl = await getSignedUrl(src);
          return { src: signedUrl || src, alt: `${folder} image` };
        })
      );

      return {
        title: folder.replace(/_/g, ' '),
        description: `Gallery for ${folder.replace(/_/g, ' ')}`,
        images: signedImages,
      };
    })
  );

  return galleries;
};

// Production-safe image maps using Vite glob importer
// Maps filename (without ext) -> build-time resolved URL
// Vite automatically optimizes, hashes, and serves via /assets/ in production (Vercel-safe)
const programGlob = import.meta.glob('../assets/images/programs/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
export const programImages: Record<string, string> = Object.fromEntries(
  Object.entries(programGlob).map(([key, url]) => {
    const filename = key.split('/').pop()?.replace(/\.[^/.]+$/, "") || "fallback";
    return [filename, url as string];
  })
);

const partnerGlob = import.meta.glob('../assets/images/partners/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
export const partnerImages: Record<string, string> = Object.fromEntries(
  Object.entries(partnerGlob).map(([key, url]) => {
    const filename = key.split('/').pop()?.replace(/\.[^/.]+$/, "") || "fallback";
    return [filename, url as string];
  })
);

// Founder image - Vite deprecated `as: 'url'` fix
const founderGlob = import.meta.glob('../assets/images/founda.jpg?raw', { eager: true });
export const founderImages: Record<string, string> = {
  founda: founderGlob['../assets/images/founda.jpg?raw'] as string
};

// Production fallbacks (inline SVG - no files needed)
export const fallbackImages: Record<string, string> = {
  program: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTBCOTgxIiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UHJvZ3JhbTwvdGV4dD4KPC9zdmc+',
  partner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjM0I4MkY1IiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UGFydG5lcjwvdGV4dD4KPC9zdmc+',
  founder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjA4IiByeD0iMTAiLz4KPHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Rm91bmRlcjwvdGV4dD4KPC9zdmc+'
};

