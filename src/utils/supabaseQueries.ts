import { supabase } from '../supabaseClient';
import type { DocumentaryData } from '../pages/Documentary';
import type { Post } from '../types';
import { getSignedUrl } from './imageHelpers';

interface ImageItem {
  src: string;
  alt: string;
}

interface GalleryItem {
  title: string;
  description: string;
  images: ImageItem[];
  categoryIcon: any;
}

const getCategoryIcon = (category: string): any => {
  const icons: Record<string, any> = {
    internationalTours: '🌍',
    nationalTours: '📍',
    events: '🎓',
    awards: '🏆',
  };
  return icons[category] || '📁';
};

const processPost = async (post: Post): Promise<GalleryItem> => {
  const imagePromises = post.images.map(async (imgPath: string) => ({
    src: await getSignedUrl(imgPath) || imgPath,
    alt: `${post.title} image`
  }));
  const images = await Promise.all(imagePromises);
  return {
    title: post.title,
    description: post.description,
    images,
    categoryIcon: getCategoryIcon(post.category)
  };
};

export const loadDocumentaryData = async (): Promise<DocumentaryData> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading data:', error);
    return {
      internationalTours: [],
      nationalTours: [],
      events: [],
      awards: [],
    };
  }

  const posts = data as Post[] || [];

  const internationalTours = await Promise.all(
    posts.filter(post => post.category === 'internationalTours').map(processPost)
  );
  const nationalTours = await Promise.all(
    posts.filter(post => post.category === 'nationalTours').map(processPost)
  );
  const events = await Promise.all(
    posts.filter(post => post.category === 'events').map(processPost)
  );
  const awards = await Promise.all(
    posts.filter(post => post.category === 'awards').map(processPost)
  );

  return {
    internationalTours,
    nationalTours,
    events,
    awards
  };
};

