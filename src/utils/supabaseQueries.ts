import { supabase } from '../supabaseClient';
import { DocumentaryData } from '../pages/Documentary';

export const loadDocumentaryData = async (): Promise<DocumentaryData> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading data:', error);
    throw new Error('Failed to load documentary data');
  }

  // Ensure the data matches the expected structure
  const structuredData: DocumentaryData = {
    internationalTours: data.filter((item: any) => item.category === 'internationalTours'),
    nationalTours: data.filter((item: any) => item.category === 'nationalTours'),
    events: data.filter((item: any) => item.category === 'events'),
    awards: data.filter((item: any) => item.category === 'awards'),
  };

  return structuredData;
};