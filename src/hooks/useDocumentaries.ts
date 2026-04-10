import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { GalleryItem, ImageItem, DocumentaryData } from '../types';

interface SupabaseGallery {
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

      galleries?.forEach((item: SupabaseGallery) => {
        const galleryItem: Omit<GalleryItem, 'categoryIcon'> = {
          title: item.title,
          description: item.description,
          images: item.images,
        };
        (grouped as any)[item.category].push({
          ...galleryItem,
          categoryIcon: createIcon(item.category),
        });
      });

      setData(grouped);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch documentaries error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (gallery: Omit<SupabaseGallery, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('documentaries')
      .insert([gallery])
      .select()
      .single();
    if (error) throw error;
    await fetchAll();
    return data;
  };

  const update = async (id: string, updates: Partial<SupabaseGallery>) => {
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

