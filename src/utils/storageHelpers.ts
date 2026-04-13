import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';


/**
 * Generic file upload to app-files bucket with user-specific path
 * Structure: ${uid}/${feature}/${itemId}/${uuid}.${ext}
 */
export const uploadFile = async (
  file: File, 
  featureName: string, 
  itemId: string = uuidv4()
): Promise<string | null> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('User not authenticated:', authError);
    return null;
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const filePath = `${user.id}/${featureName}/${itemId}/${uuidv4()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from('app-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  console.log(`✅ Uploaded: ${filePath}`);
  return filePath;
};

/**
 * Delete file from storage
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from('app-files')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error.message);
    return false;
  }

  console.log(`✅ Deleted: ${filePath}`);
  return true;
};

/**
 * Get signed URL (3600s = 1hr)
 */
export const getSignedUrl = async (filePath: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('app-files')
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error('Signed URL error:', error.message);
    return null;
  }

  return data.signedUrl;
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (
  files: File[], 
  featureName: string, 
  itemId: string = uuidv4()
): Promise<string[]> => {
  const paths: string[] = [];
  for (const file of files) {
    const path = await uploadFile(file, featureName, itemId);
    if (path) paths.push(path);
  }
  return paths;
};

/**
 * Delete multiple files
 */
export const deleteFiles = async (filePaths: string[]): Promise<boolean> => {
  if (filePaths.length === 0) return true;
  
  const { error } = await supabase.storage
    .from('app-files')
    .remove(filePaths);

  if (error) {
    console.error('Multi-delete error:', error.message);
    return false;
  }

  console.log(`✅ Deleted ${filePaths.length} files`);
  return true;
};

