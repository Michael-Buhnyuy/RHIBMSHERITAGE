import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, getPublicUrl } from '../utils/storageHelpers';

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

export interface DocumentaryData {
  internationalTours: DocumentaryCard[];
  nationalTours: DocumentaryCard[]; 
  events: DocumentaryCard[];
  awards: DocumentaryCard[];
}

interface AdminPageProps {
  data: DocumentaryData;
}

const categoryOptions = [
  { value: 'internationalTours', label: 'INTERNATIONAL TOURS' },
  { value: 'nationalTours', label: 'NATIONAL TOURS' },
  { value: 'events', label: 'EVENTS' },
  { value: 'awards', label: 'AWARDS' },
] as const;

type CategoryKey = keyof DocumentaryData;

export default function AdminPage({ data }: AdminPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryKey>('internationalTours');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [previewImages, setPreviewImages] = useState<ImageItem[]>([]);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) {
      setFiles([]);
      setPreviewImages([]);
      return;
    }

    const filesArray = Array.from(selectedFiles);
    setFiles(filesArray);

    const previews: ImageItem[] = filesArray.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
    }));
    setPreviewImages(previews);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('internationalTours');
    setFiles([]);
    setPreviewImages([]);
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || files.length === 0) {
      setError('Please provide a title, description, and at least one image.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const { data } = await supabase.auth.getUser();
console.log("CURRENT USER:", data.user);

      // Upload files using new posts format
      console.log('📤 Uploading images...');
      const uploadedPaths: string[] = [];
      const originalFiles = files; // Keep for alt names

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = await uploadFile(file, 'posts', uuidv4(), true); // true = posts format
        if (path) {
          uploadedPaths.push(path);
        } else {
          console.warn(`⚠️ Failed to upload ${file.name}`);
        }
      }

      if (uploadedPaths.length === 0) {
        throw new Error('No images uploaded successfully');
      }

      // Generate public URLs + ImageItem[]
      console.log('🔗 Generating public URLs...');
      const images: ImageItem[] = uploadedPaths.map((path, index) => ({
        src: getPublicUrl(path),
        alt: originalFiles[index]?.name || `image-${index}`,
      }));

      // Insert to DB with full ImageItem[]
      console.log('💾 Saving to database...');
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        images, // Full ImageItem[] 
        user_id: user.id,
      });

      if (error) throw error;

      console.log('✅ Post created successfully!');
      resetForm();

    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '2rem auto', padding: 16, border: '1px solid #ddd', borderRadius: 10, backgroundColor: '#fff' }}>
      <h1 style={{ marginBottom: 16 }}>AdminPage</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={uploading}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            disabled={uploading}
            style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryKey)}
            disabled={uploading}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Images</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFilesChange} 
            disabled={uploading}
            style={{ width: '100%' }} 
          />
        </div>

        {previewImages.length > 0 && (
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', marginBottom: 12 }}>
            {previewImages.map((img, index) => (
              <div key={`${img.src}-${index}`} style={{ border: '1px solid #ccc', borderRadius: 6, overflow: 'hidden' }}>
                <img src={img.src} alt={img.alt} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <p style={{ margin: 0, padding: '4px', fontSize: 12, textAlign: 'center' }}>{img.alt}</p>
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          style={{ 
            width: '100%', 
            padding: 12, 
            border: 'none', 
            borderRadius: 6, 
            backgroundColor: uploading ? '#94a3b8' : '#2563eb', 
            color: '#fff', 
            fontWeight: 600, 
            cursor: uploading ? 'not-allowed' : 'pointer' 
          }}
        >
          {uploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Current data snapshot</h2>
        <small style={{ color: '#555' }}>Each category is updated in real time and shared with Documentary.</small>
        <pre style={{ marginTop: 12, background: '#f7f7f7', padding: 12, borderRadius: 6, maxHeight: 280, overflowY: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
    </div>
  );
}

