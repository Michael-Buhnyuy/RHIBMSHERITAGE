import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

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

const uploadFileToSupabase = async (file: File, featureName: string, itemId: string): Promise<string | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const fileExtension = file.name.split('.').pop();
  const filePath = `${user.id}/${featureName}/${itemId}/${uuidv4()}.${fileExtension}`;

  const { error } = await supabase.storage.from('app-files').upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error.message);
    return null;
  }

  return filePath;
};

export default function AdminPage({ data }: AdminPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryKey>('internationalTours');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const [previewImages, setPreviewImages] = useState<ImageItem[]>([]);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) {
      setFiles([]);
      setPreviewImages([]);
      return;
    }

    const filesArray = Array.from(selectedFiles); // allow multi
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

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const uploadedFilePaths: string[] = [];

    for (const file of files) {
      const filePath = await uploadFileToSupabase(file, 'posts', uuidv4());
      if (filePath) {
        uploadedFilePaths.push(filePath);
      }
    }

    const { error } = await supabase.from('posts').insert({
      title: title.trim(),
      description: description.trim(),
      category,
      images: uploadedFilePaths,
      user_id: user.id,
    });

    if (error) {
      console.error('Error saving post to database:', error.message);
      setError('Failed to save post. Please try again.');
      return;
    }

    resetForm();
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
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryKey)}
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
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} style={{ width: '100%' }} />
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
          style={{ width: '100%', padding: 12, border: 'none', borderRadius: 6, backgroundColor: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Create Post
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
