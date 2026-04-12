import React, { useState, useEffect, useCallback } from 'react';
import { Globe, MapPin, GraduationCap, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';


// Local types (exported from Admin.tsx patterns)
export interface ImageItem {
  src: string;
  alt: string;
}

export type UserPost = DocumentaryCard;

export interface DocumentaryCard {
  title: string;
  description: string;
  images: ImageItem[];
  categoryIcon: React.ReactNode;
}


export type CategoryKey = 'internationalTours' | 'nationalTours' | 'events' | 'awards';


// Raw Supabase post type
interface SupabasePost {
  id: string;
  user_id: string;
  category: CategoryKey;
  title: string;
  description: string;
  images: string[];
  created_at: string;
  updated_at: string;
}


export const useUserPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsRef = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });


    if (error) {
      setError(error.message);
      console.error('Load error:', error);
    } else {
      // Transform to DocumentaryCard for UI
      const displayPosts: DocumentaryCard[] = (data || []).map((post: any) => ({
        title: post.title,
        description: post.description || '',
        images: (post.images || []).map((url: string, i: number) => ({
          src: url,
          alt: `${post.title} image ${i + 1}`
        })),
        categoryIcon: getIconForCategory(post.category as CategoryKey)
      }));
      setPosts(displayPosts);
    }
    setLoading(false);
  }, [user?.id]);

  // Load user's posts
  useEffect(() => {
    if (!user?.id) return;
    fetchPostsRef();
  }, [user?.id, fetchPostsRef]);


  const createPost = async (post: Omit<SupabasePost, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) throw new Error('No user');

    const { data, error } = await supabase
      .from('posts')
      .insert({ ...post, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updatePost = async (id: string, updates: Partial<Omit<SupabasePost, 'id' | 'user_id'>>) => {
    if (!user?.id) throw new Error('No user');

    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deletePost = async (id: string) => {
    if (!user?.id) throw new Error('No user');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  // Icon helper (copied from components)
  const getIconForCategory = useCallback((category: CategoryKey): React.ReactNode => {
    const icons: Record<CategoryKey, React.ReactNode> = {
      internationalTours: React.createElement(Globe, { className: "w-10 h-10 text-blue-600" }),
      nationalTours: React.createElement(MapPin, { className: "w-10 h-10 text-emerald-600" }),
      events: React.createElement(GraduationCap, { className: "w-10 h-10 text-purple-600" }),
      awards: React.createElement(Trophy, { className: "w-10 h-10 text-orange-600" })
    };
    return icons[category];
  }, []);

  const refetch = useCallback(() => {
    if (user?.id) {
      fetchPostsRef();
    }
  }, [user?.id, fetchPostsRef]);


  return {
    posts: posts as DocumentaryCard[],
    loading,
    error,
    refetch,
    createPost,
    updatePost,
    deletePost
  };
};


