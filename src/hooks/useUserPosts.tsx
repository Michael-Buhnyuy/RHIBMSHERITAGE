import React, { useState, useEffect, useCallback } from 'react';
import { Globe, MapPin, GraduationCap, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Types from Admin/Documentary
export interface ImageItem {
  src: string;
  alt: string;
}

export interface DocumentaryCard {
  title: string;
  description: string;
  images: ImageItem[];
  categoryIcon: React.ReactNode;
}

export type CategoryKey = 'internationalTours' | 'nationalTours' | 'events' | 'awards';

interface SupabasePost {
  id: string;
  category: CategoryKey;
  title: string;
  description?: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface UseUserPostsReturn {
  posts: DocumentaryCard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createPost: (postData: Omit<SupabasePost, 'id' | 'created_at' | 'updated_at'>) => Promise<SupabasePost | null>;
  updatePost: (id: string, updates: Partial<Omit<SupabasePost, 'id'>>) => Promise<SupabasePost | null>;
  deletePost: (id: string) => Promise<void>;
}

export const useUserPosts = (): UseUserPostsReturn => {
  const [posts, setPosts] = useState<DocumentaryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getIconForCategory = (category: CategoryKey): React.ReactNode => {
    const icons: Record<CategoryKey, React.ReactNode> = {
      internationalTours: <Globe className="w-10 h-10 text-blue-600" />,
      nationalTours: <MapPin className="w-10 h-10 text-emerald-600" />,
      events: <GraduationCap className="w-10 h-10 text-purple-600" />,
      awards: <Trophy className="w-10 h-10 text-orange-600" />
    };
    return icons[category];
  };

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      console.error('Refetch error:', error);
    } else {
      const displayPosts: DocumentaryCard[] = (data || []).map((post: SupabasePost) => ({
        title: post.title,
        description: post.description || '',
        images: post.images.map((url, i) => ({
          src: url,
          alt: `${post.title} image ${i + 1}`
        })),
        categoryIcon: getIconForCategory(post.category)
      }));
      setPosts(displayPosts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createPost = async (postData: Omit<SupabasePost, 'id' | 'created_at' | 'updated_at'>): Promise<SupabasePost | null> => {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      setError(error.message);
      console.error('Create error:', error);
      return null;
    }
    await refetch();
    return data;
  };

  const updatePost = async (id: string, updates: Partial<Omit<SupabasePost, 'id'>>): Promise<SupabasePost | null> => {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      console.error('Update error:', error);
      return null;
    }
    await refetch();
    return data;
  };

  const deletePost = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      console.error('Delete error:', error);
    } else {
      await refetch();
    }
  };

  return {
    posts,
    loading,
    error,
    refetch,
    createPost,
    updatePost,
    deletePost
  };
};

