export interface Partner {
  name: string;
  image?: string;
  imageId?: string;
  description?: string;
  url?: string;
}

export interface TimelineEvent {
  year: number;
  type: 'milestone' | 'event' | 'award' | 'team' | 'other';
  title: string;
  description: string;
  icon?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageId?: string;
  duration: string;
  icon?: string;
}

import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AugmentedUser extends Omit<SupabaseUser, 'user_metadata'> {
  photoURL?: string;
  displayName?: string;
}

export type User = AugmentedUser | null;

export type UserRole = 'admin' | 'user';

export type DocumentaryCategory = 'internationalTours' | 'nationalTours' | 'events' | 'awards';

export interface ImageItem {
  src: string;
  alt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: DocumentaryCategory;
  images: ImageItem[] | string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}
