import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  GraduationCap,
  Trophy
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

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
  const autoRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const [lightbox, setLightbox] = useState<{
    images: ImageItem[];
    index: number;
  } | null>(null);

  /* 🔥 NEW STATES */
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0); // 🎬 animation direction

  const mergedInternationalTours = [...(data?.internationalTours ?? []), ...internationalTours];
  const mergedNationalTours = [...(data?.nationalTours ?? []), ...nationalTours];
  const mergedEvents = [...(data?.events ?? []), ...events];
  const mergedAwards = [...(data?.awards ?? []), ...awards];

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

  const closeLightbox = () => {
    setLightbox(null);
    setZoomed(false);
  };

  const nextLightbox = () => {
    if (!lightbox) return;
    setDirection(1);
    setLightbox({
      ...lightbox,
      index: (lightbox.index + 1) % lightbox.images.length
    });
  };

  const prevLightbox = () => {
    if (!lightbox) return;
    setDirection(-1);
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

      {renderSection('INTERNATIONAL TOURS', mergedInternationalTours)}
      {renderSection('NATIONAL TOURS', mergedNationalTours)}
      {renderSection('EVENTS', mergedEvents)}
      {renderSection('AWARDS', mergedAwards)}

      {/* 🎬 CINEMATIC LIGHTBOX */}
      <AnimatePresence mode="wait">
        {lightbox && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          >

            {/* LEFT */}
            <button
              onClick={prevLightbox}
              className="absolute left-6 text-white bg-black/40 p-3 rounded-full z-50"
            >
              <ChevronLeft size={30} />
            </button>

            {/* IMAGE */}
            <div
              className="overflow-hidden flex items-center justify-center"
              onClick={() => setZoomed(z => !z)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightbox.index}
                  src={lightbox.images[lightbox.index].src}

                  initial={{
                    x: direction > 0 ? 100 : -100,
                    opacity: 0,
                    scale: 0.95
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: zoomed ? 1.5 : 1
                  }}
                  exit={{
                    x: direction > 0 ? -100 : 100,
                    opacity: 0,
                    scale: 0.95
                  }}

                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut'
                  }}

                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 100) prevLightbox();
                    if (info.offset.x < -100) nextLightbox();
                  }}

                  className="max-h-[85vh] object-contain cursor-pointer"
                />
              </AnimatePresence>
            </div>

            {/* RIGHT */}
            <button
              onClick={nextLightbox}
              className="absolute right-6 text-white bg-black/40 p-3 rounded-full z-50"
            >
              <ChevronRight size={30} />
            </button>

            {/* CLOSE */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-3xl z-50"
            >
              ✕
            </button>

            {/* COUNTER */}
            <div className="absolute bottom-6 text-white text-lg z-50">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}