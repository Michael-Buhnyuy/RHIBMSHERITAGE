import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * FIXED uploadFile with COMPLETE DEBUGGING
 * Logs EVERYTHING for debugging
 */
export const uploadFile = async (
  file: File, 
  featureName: string = 'generic',
  itemId: string = uuidv4(),
  usePostsFormat: boolean = false
): Promise<string | null> => {
  try {
    // 1. LOG FILE INFO
    console.log('🔍 UPLOAD DEBUG START');
    console.log('📄 File:', file.name);
    console.log('📏 Size:', file.size, 'bytes');
    console.log('📂 Type:', file.type);
    
    // 2. CHECK AUTH
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 User:', user?.id || 'NULL');
    console.log('🔐 Auth error:', authError);
    
    if (authError || !user) {
      console.error('❌ AUTH FAILED:', authError || 'No user');
      return null;
    }

    // 3. GENERATE PATH
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    let filePath: string;
    if (usePostsFormat) {
      filePath = `posts/${uuidv4()}-${file.name}`;
    } else {
      filePath = `${user.id}/${featureName}/${itemId}/${uuidv4()}.${fileExtension}`;
    }
    console.log('📍 Path:', filePath);

    // 4. UPLOAD
    console.log('🚀 Uploading to app-files...');
    const { data, error } = await supabase.storage
      .from('app-files')  // ✅ CORRECT BUCKET
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    // 5. FULL RESPONSE LOG
    console.log('📡 Response data:', data);
    console.log('❌ Response error:', error);

    if (error) {
      console.error('💥 UPLOAD FAILED:', {
        message: error.message,
        statusCode: error.statusCode || 'N/A',
        details: (error as any).details || 'N/A'
      });
      return null;
    }

    if (!data?.path) {
      console.error('⚠️ No path in response');
      return null;
    }

    console.log('✅ UPLOAD SUCCESS:', data.path);
    return data.path;

  } catch (err: any) {
    console.error('💥 UNCAUGHT ERROR:', err);
    return null;
  }
};

/** Get permanent PUBLIC URL */
export const getPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage.from('app-files').getPublicUrl(filePath);
  console.log('🌐 Public URL:', data.publicUrl);
  return data.publicUrl;
};

/** Signed URL fallback */
export const getSignedUrl = async (filePath: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('app-files')
    .createSignedUrl(filePath, 60 * 60);
  return error ? null : data.signedUrl;
};

// Rest unchanged...
export const deleteFile = async (filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage.from('app-files').remove([filePath]);
  return !error;
};

export const uploadFiles = async (files: File[], featureName: string, itemId: string = uuidv4()): Promise<string[]> => {
  const paths: string[] = [];
  for (const file of files) {
    const path = await uploadFile(file, featureName, itemId);
    if (path) paths.push(path);
  }
  return paths;
};

export const deleteFiles = async (filePaths: string[]): Promise<boolean> => {
  if (filePaths.length === 0) return true;
  const { error } = await supabase.storage.from('app-files').remove(filePaths);
  return !error;
};

