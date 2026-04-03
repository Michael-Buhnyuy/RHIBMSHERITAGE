

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

