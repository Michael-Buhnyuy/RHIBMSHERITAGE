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
import { loadDocumentaryData } from '../utils/supabaseQueries';

// Added a reference to the type declaration file
/// <reference path="../utils/supabaseQueries.d.ts" />

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

/* ================= SAFE GUARDS ================= */

const isSafeGallery = (gallery: any): gallery is GalleryItem => {
  if (!gallery || typeof gallery !== 'object') return false;
  const images = gallery.images;
  if (!Array.isArray(images) || images.length === 0) {
    console.warn(`❌ Invalid gallery '${gallery.title || 'unknown'}': images is ${typeof images} length ${images?.length || 0}`);
    return false;
  }
  // Check each image has src
  for (const img of images) {
    if (!img?.src || typeof img.src !== 'string') {
      console.warn(`❌ Gallery '${gallery.title || 'unknown'}' has invalid img:`, img);
      return false;
    }
  }
  return true;
};

const safeLength = (images: ImageItem[] | undefined | null): number => {
  return Array.isArray(images) ? images.length : 0;
};

/* ================= HELPERS ================= */

const normalize = (name: string) =>
  name.replace(/[\s-]+/g, '_');

/* ================= GROUPING FUNCTION ================= */

const groupImages = (modules: Record<string, unknown>) => {
  const grouped: Record<string, string[]> = {};

  Object.entries(modules).forEach(([path, src]) => {
    const parts = path.split('/');
    const folder = parts[parts.length - 2] || normalize(path.split('/').slice(-2)[0]);
    const normalizedFolder = normalize(folder);
    
    if (!grouped[normalizedFolder]) grouped[normalizedFolder] = [];
    grouped[normalizedFolder].push(src as string);
  });

  const partialGalleries = Object.entries(grouped).map(([folder, images]) => ({
    title: folder.replace(/_/g, ' '),
    description: `Gallery for ${folder.replace(/_/g, ' ')}`,
    images: images.map((src, i) => ({
      src: src as string,
      alt: `${folder} image ${i + 1}`
    })) as ImageItem[]
  }));
  return partialGalleries.filter(isSafeGallery as any);
};

/* ================= STATIC GLOBS ================= */

const intlModules = import.meta.glob(
  '../assets/images/Intenational_Tour/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

const natModules = import.meta.glob(
  '../assets/images/national_Tour/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

const eventModules = import.meta.glob(
  '../assets/images/events/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

const awardModules = import.meta.glob(
  '../assets/images/awards/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

/* ================= SAFE STATIC DATA ================= */

const internationalTours: GalleryItem[] = groupImages(intlModules).map(g => ({
  ...g,
  categoryIcon: <Globe className="w-10 h-10 text-blue-600" />
}));

const nationalTours: GalleryItem[] = groupImages(natModules).map(g => ({
  ...g,
  categoryIcon: <MapPin className="w-10 h-10 text-emerald-600" />
}));

const events: GalleryItem[] = groupImages(eventModules).map(g => ({
  ...g,
  categoryIcon: <GraduationCap className="w-10 h-10 text-purple-600" />
}));

const awards: GalleryItem[] = groupImages(awardModules).map(g => ({
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
    galleryTitle: string;  // for logging
  } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);

  const [documentaryData, setDocumentaryData] = useState<DocumentaryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDocumentaryData();
        setDocumentaryData(data);
      } catch (error) {
        console.error('Failed to fetch documentary data:', error);
      }
    };

    fetchData();
  }, []);

  // 🛡️ Defensive merge with filtering
  const safeData = {
    internationalTours: ((documentaryData?.internationalTours || []) as GalleryItem[]).filter(isSafeGallery),
    nationalTours: ((documentaryData?.nationalTours || []) as GalleryItem[]).filter(isSafeGallery),
    events: ((documentaryData?.events || []) as GalleryItem[]).filter(isSafeGallery),
    awards: ((documentaryData?.awards || []) as GalleryItem[]).filter(isSafeGallery),
  };

  const mergedInternationalTours = [...safeData.internationalTours, ...internationalTours];
  const mergedNationalTours = [...safeData.nationalTours, ...nationalTours].filter(isSafeGallery);
  const mergedEvents = [...safeData.events, ...events];
  const mergedAwards = [...safeData.awards, ...awards];

  // Debug log
  useEffect(() => {
    console.log('🔍 Documentary loaded:');
    console.log('- Prop data keys:', Object.keys(data || {}));
    console.log('- Dynamic galleries:', safeData);
    console.log('- Static intl tours:', internationalTours.length);
    console.log('- Merged intl:', mergedInternationalTours.length);
    console.log('All galleries safe: ✅');
  }, [data]);

const getIndex = (key: string): number => {
    const idx = sliderIndex[key] ?? 0;
    return Number.isInteger(idx) ? idx : 0;
  };

  const next = (key: string, max: number) => {
    if (max <= 0) {
      console.warn(`⚠️ Skip next on ${key}, max=${max}`);
      return;
    }
    setSliderIndex(prev => ({
      ...prev,
      [key]: (getIndex(key) + 1) % max
    }));
  };

  const prev = (key: string, max: number) => {
    if (max <= 0) {
      console.warn(`⚠️ Skip prev on ${key}, max=${max}`);
      return;
    }
    setSliderIndex(prev => ({
      ...prev,
      [key]: (getIndex(key) - 1 + max) % max
    }));
  };

  const startAuto = (key: string, max: number) => {
    if (max <= 0 || autoRef.current[key]) return;
    console.log(`▶️ Auto start ${key}`);
    autoRef.current[key] = setInterval(() => next(key, max), 4000);
  };

  const stopAuto = (key: string) => {
    if (autoRef.current[key]) {
      console.log(`⏹️ Auto stop ${key}`);
      clearInterval(autoRef.current[key]);
      delete autoRef.current[key];
    }
  };

  const closeLightbox = () => {
    setLightbox(null);
    setZoomed(false);
  };

  const safeLightboxIndex = (currIndex: number, imagesLength: number): number => {
    return Math.max(0, Math.min(currIndex, Math.max(0, imagesLength - 1)));
  };

  const nextLightbox = () => {
    if (!lightbox) return;
    const newIndex = safeLightboxIndex(lightbox.index + 1, lightbox.images.length);
    setDirection(1);
    setLightbox({ ...lightbox, index: newIndex });
  };

  const prevLightbox = () => {
    if (!lightbox) return;
    const newIndex = safeLightboxIndex(lightbox.index - 1, lightbox.images.length);
    setDirection(-1);
    setLightbox({ ...lightbox, index: newIndex });
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

  /* ================= SAFE SECTION RENDER ================= */

  const renderSection = (title: string, galleries: GalleryItem[]) => {
    const safeGalleries = galleries.filter(isSafeGallery);
    
    if (safeGalleries.length === 0) {
      console.log(`ℹ️ Skip section '${title}': no safe galleries`);
      return (
        <section className="space-y-16">
          <h2 className="text-4xl font-black text-center">{title}</h2>
          <div className="text-center py-12 text-gray-500">
            No galleries available
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-16">
        <h2 className="text-4xl font-black text-center">{title}</h2>

        {safeGalleries.map((gallery, index) => {
          const safeImages = gallery.images.filter(img => img?.src);
          const maxIndex = safeLength(safeImages);
          
          if (maxIndex === 0) {
            console.warn(`⚠️ Skip gallery '${gallery.title}': no valid images`);
            return null;
          }

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
                onMouseEnter={() => startAuto(gallery.title, maxIndex)}
                onMouseLeave={() => stopAuto(gallery.title)}
              >

                <div
                  className="flex h-full transition-transform duration-700"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {safeImages.map((img, i) => (
                    <img
                      key={`${gallery.title}-${i}`}
                      src={img.src}
                      alt={img.alt || 'Gallery image'}
                      onClick={() => setLightbox({ 
                        images: safeImages, 
                        index: i, 
                        galleryTitle: gallery.title 
                      })}
                      className="w-full h-full object-cover flex-shrink-0 cursor-pointer"
onError={(e) => {
  console.warn(`❌ Image load failed: ${img.src}`);
  e.currentTarget.style.display = 'none';
}}
                    />
                  ))}
                </div>

                <button
                  onClick={() => prev(gallery.title, maxIndex)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={maxIndex <= 1}
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() => next(gallery.title, maxIndex)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={maxIndex <= 1}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    );
  };

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

      {/* 🛡️ CRASH-PROOF LIGHTBOX */}
      <AnimatePresence mode="wait">
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          >

            <button
              onClick={prevLightbox}
              className="absolute left-6 text-white bg-black/40 p-3 rounded-full z-50 hover:bg-black/60 transition-colors"
              disabled={lightbox.images.length <= 1}
            >
              <ChevronLeft size={30} />
            </button>

            <div
              className="overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => setZoomed(z => !z)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${lightbox.galleryTitle}-${lightbox.index}`}
                  src={lightbox.images[lightbox.index]?.src || ''}
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
                  onDragEnd={(_e, info) => {
                    if (info.offset.x > 100) prevLightbox();
                    if (info.offset.x < -100) nextLightbox();
                  }}
                  className="max-h-[85vh] object-contain cursor-pointer"
                  onError={(e) => {
                    console.error('Lightbox img error:', lightbox.images[lightbox.index]);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </AnimatePresence>
            </div>

            <button
              onClick={nextLightbox}
              className="absolute right-6 text-white bg-black/40 p-3 rounded-full z-50 hover:bg-black/60 transition-colors"
              disabled={lightbox.images.length <= 1}
            >
              <ChevronRight size={30} />
            </button>

            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-3xl z-50 hover:text-gray-300"
            >
              ✕
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg z-50 bg-black/30 px-4 py-2 rounded-full">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
