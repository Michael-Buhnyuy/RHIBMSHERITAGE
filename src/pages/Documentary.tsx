import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  GraduationCap,
  Trophy
} from 'lucide-react';

/* ================= TYPES ================= */

interface ImageItem {
  src: string;
  alt: string;
}

interface GalleryItem {
  title: string;
  description: string;
  images: ImageItem[];
  categoryIcon: React.ReactNode;
}

export interface DocumentaryData {
  internationalTours: GalleryItem[];
  nationalTours: GalleryItem[];
  events: GalleryItem[];
  awards: GalleryItem[];
}

interface DocumentaryProps {
  data?: DocumentaryData;
}

/* ================= HELPERS ================= */

const normalize = (name: string) =>
  name.replace(/[\s-]+/g, '_');

/* ================= GROUPING FUNCTION ================= */

const groupImages = (modules: Record<string, string>) => {
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

/* ================= STATIC GLOBS ================= */

// ✅ MUST be static paths (Vite requirement)

const intlModules = import.meta.glob(
  '/src/assets/images/Intenational_Tour/*/*.{jpg,jpeg,png}',
  { eager: true, as: 'url' }
);

const natModules = import.meta.glob(
  '/src/assets/images/national_Tour/*/*.{jpg,jpeg,png}',
  { eager: true, as: 'url' }
);

const eventModules = import.meta.glob(
  '/src/assets/images/events/*/*.{jpg,jpeg,png}',
  { eager: true, as: 'url' }
);

const awardModules = import.meta.glob(
  '/src/assets/images/awards/*/*.{jpg,jpeg,png}',
  { eager: true, as: 'url' }
);

/* ================= DATA ================= */

const internationalTours = groupImages(intlModules).map(g => ({
  ...g,
  categoryIcon: <Globe className="w-10 h-10 text-blue-600" />
}));

const nationalTours = groupImages(natModules).map(g => ({
  ...g,
  categoryIcon: <MapPin className="w-10 h-10 text-emerald-600" />
}));

const events = groupImages(eventModules).map(g => ({
  ...g,
  categoryIcon: <GraduationCap className="w-10 h-10 text-purple-600" />
}));

const awards = groupImages(awardModules).map(g => ({
  ...g,
  categoryIcon: <Trophy className="w-10 h-10 text-orange-600" />
}));

/* ================= COMPONENT ================= */

export default function Documentary({ data }: DocumentaryProps) {
  const [sliderIndex, setSliderIndex] = useState<Record<string, number>>({});

  const mergedInternationalTours = [
    ...(data?.internationalTours ?? []),
    ...internationalTours,
  ];

  const mergedNationalTours = [
    ...(data?.nationalTours ?? []),
    ...nationalTours,
  ];

  const mergedEvents = [
    ...(data?.events ?? []),
    ...events,
  ];

  const mergedAwards = [
    ...(data?.awards ?? []),
    ...awards,
  ];
  const [lightbox, setLightbox] = useState<{
    images: ImageItem[];
    index: number;
  } | null>(null);

  const [activeFilter] = useState<'all' | 'international' | 'national' | 'awards-events'>('all');

  const autoRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const getIndex = (key: string) => sliderIndex[key] || 0;

  const next = (key: string, max: number) => {
    setSliderIndex(p => ({
      ...p,
      [key]: (getIndex(key) + 1) % max
    }));
  };

  const prev = (key: string, max: number) => {
    setSliderIndex(p => ({
      ...p,
      [key]: (getIndex(key) - 1 + max) % max
    }));
  };

  const startAuto = (key: string, max: number) => {
    if (autoRef.current[key]) return;
    autoRef.current[key] = setInterval(() => {
      next(key, max);
    }, 4000);
  };

  const stopAuto = (key: string) => {
    clearInterval(autoRef.current[key]);
    delete autoRef.current[key];
  };

  const closeLightbox = () => setLightbox(null);

  const nextLightbox = () => {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      index: (lightbox.index + 1) % lightbox.images.length
    });
  };

  const prevLightbox = () => {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      index:
        (lightbox.index - 1 + lightbox.images.length) %
        lightbox.images.length
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox]);

  /* ================= SECTION ================= */

  const renderSection = (title: string, data: GalleryItem[]) => (
    <section className="space-y-16">
      <h2 className="text-4xl font-black text-center">{title}</h2>

      {data.map((gallery, index) => {
        const current = getIndex(gallery.title);

        return (
          <div
            key={gallery.title}
            className={`group flex flex-col lg:flex-row gap-10 p-8 rounded-3xl 
            bg-white shadow-xl ${
              index % 2 ? 'lg:flex-row-reverse' : ''
            }`}
          >

            <div className="lg:w-2/5 space-y-4">
              <div className="flex items-center gap-3">
                {gallery.categoryIcon}
                <h3 className="text-2xl font-bold">{gallery.title}</h3>
              </div>
              <p>{gallery.description}</p>
            </div>

            <div
              className="lg:w-3/5 relative h-96 overflow-hidden rounded-2xl"
              onMouseEnter={() =>
                startAuto(gallery.title, gallery.images.length)
              }
              onMouseLeave={() => stopAuto(gallery.title)}
            >

              <div
                className="flex h-full transition-transform duration-700"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {gallery.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    onClick={() =>
                      setLightbox({ images: gallery.images, index: i })
                    }
                    className="w-full h-full object-cover flex-shrink-0 cursor-pointer"
                  />
                ))}
              </div>

              <button
                onClick={() => prev(gallery.title, gallery.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={() => next(gallery.title, gallery.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-20">

      <h1 className="text-5xl font-black text-center">
        DOCUMENTARY ARCHIVE
      </h1>

      {(activeFilter === 'all' || activeFilter === 'international') &&
        renderSection('INTERNATIONAL TOURS', mergedInternationalTours)}

      {(activeFilter === 'all' || activeFilter === 'national') &&
        renderSection('NATIONAL TOURS', mergedNationalTours)}

      {(activeFilter === 'all' || activeFilter === 'awards-events') &&
        renderSection('EVENTS', mergedEvents)}

      {(activeFilter === 'all' || activeFilter === 'awards-events') &&
        renderSection('AWARDS', mergedAwards)}

      {lightbox && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <img src={lightbox.images[lightbox.index].src} />
        </div>
      )}
    </div>
  );
}