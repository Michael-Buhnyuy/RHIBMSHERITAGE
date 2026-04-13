import { supabase } from '../supabaseClient';
import type { DocumentaryData } from '../pages/Documentary';
import type { Post, ImageItem } from '../types';
import { getSignedUrl } from './imageHelpers';

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

const processPostImages = async (images: Post['images']): Promise<ImageItem[]> => {
  // Handle both new format (ImageItem[]) and legacy (string[])
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'object' && 'src' in images[0]) {
    // Already ImageItem[] - direct use (public URLs)
    return images as ImageItem[];
  }
  
  // Legacy: string[] paths → signed URLs
  const imagePromises = (images as string[]).map(async (imgPath: string) => ({
    src: await getSignedUrl(imgPath) || imgPath,
    alt: `Post image`
  }));
  return Promise.all(imagePromises);
};

const processPost = async (post: Post): Promise<GalleryItem> => {
  const images = await processPostImages(post.images);
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

