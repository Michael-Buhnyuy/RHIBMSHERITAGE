import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { GalleryItem, ImageItem, DocumentaryData } from '../types';

interface DBGallery {
  id: string;
  title: string;
  description: string | null;
  category: string;
  images: any;
  created_at: string;
  updated_at: string;
};

interface UIGallery {
  id: string;
  title: string;
  description: string;
  category: 'internationalTours' | 'nationalTours' | 'events' | 'awards';
  images: ImageItem[];
  created_at: string;
  updated_at: string;
}

type CategoryIcon = React.ReactNode;

const createIcon = (cat: string): CategoryIcon => {
  switch (cat) {
    case 'internationalTours':
      return '🌍';
    case 'nationalTours':
      return '🗺️';
    case 'events':
      return '🎓';
    case 'awards':
      return '🏆';
    default:
      return '📸';
  }
};

export const useDocumentaries = () => {
  const [data, setData] = useState<DocumentaryData>({
    internationalTours: [],
    nationalTours: [],
    events: [],
    awards: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data: galleries, error: fetchError } = await supabase
        .from('documentaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const grouped: DocumentaryData = {
        internationalTours: [],
        nationalTours: [],
        events: [],
        awards: [],
      };

      console.log('Raw Supabase galleries:', galleries);

      // Category mapping: DB -> UI
      const categoryMap: Record<string, keyof DocumentaryData> = {
        'international': 'internationalTours',
        'national': 'nationalTours',
        'events': 'events',
        'awards': 'awards'
      };

      (galleries as DBGallery[])?.forEach((item) => {
        const uiCategory = categoryMap[item.category];
        if (!uiCategory) {
          console.warn('Unknown category:', item.category);
          return;
        }

        // Defensive images parsing
        let parsedImages: ImageItem[] = [];
        try {
          if (item.images == null) {
            parsedImages = [];
          } else if (typeof item.images === 'string') {
            parsedImages = JSON.parse(item.images);
          } else if (Array.isArray(item.images)) {
            parsedImages = item.images;
          } else {
            console.warn('Invalid images format:', item.images);
            parsedImages = [];
          }

          // Validate/filter images
          parsedImages = parsedImages.filter((img): img is ImageItem => 
            img && typeof img.src === 'string' && img.src.startsWith('http') && 
            (typeof img.alt === 'string' || typeof img.alt === 'undefined')
          ).map(img => ({
            src: img.src,
            alt: img.alt || 'Gallery image'
          }));

          console.log(`Parsed ${parsedImages.length} images for ${item.title}`);

          const galleryItem: Omit<GalleryItem, 'categoryIcon'> = {
            title: item.title,
            description: item.description || '',
            images: parsedImages,
          };

          (grouped as any)[uiCategory].push({
            ...galleryItem,
            categoryIcon: createIcon(uiCategory as string),
          });
        } catch (parseError) {
          console.error('Images parse error for', item.title, parseError);
        }
      });

      console.log('Final grouped data:', grouped);

      setData(grouped);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch documentaries error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (gallery: Omit<UIGallery, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('documentaries')
      .insert([gallery])
      .select()
      .single();
    if (error) throw error;
    await fetchAll();
    return data;
  };

  const update = async (id: string, updates: Partial<UIGallery>) => {
    const { error } = await supabase
      .from('documentaries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await fetchAll();
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from('documentaries')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, fetchAll, create, update, remove };
};

