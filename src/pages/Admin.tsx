import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { uploadFile } from '../utils/storageHelpers';
import { v4 as uuidv4 } from 'uuid';
import { Globe, MapPin, GraduationCap, Trophy } from 'lucide-react';

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

interface AdminProps {
  setData: React.Dispatch<React.SetStateAction<DocumentaryData>>;
}

const categories: { key: keyof DocumentaryData; label: string }[] = [
  { key: 'internationalTours', label: 'International Tour' },
  { key: 'nationalTours', label: 'National Tour' },
  { key: 'events', label: 'Events' },
  { key: 'awards', label: 'Awards' },
];

const getIcon = (key: keyof DocumentaryData) => {
  switch (key) {
    case 'internationalTours':
      return <Globe className="w-6 h-6" />;
    case 'nationalTours':
      return <MapPin className="w-6 h-6" />;
    case 'events':
      return <GraduationCap className="w-6 h-6" />;
    case 'awards':
      return <Trophy className="w-6 h-6" />;
    default:
      return null;
  }
};

export default function Admin({ setData }: AdminProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<keyof DocumentaryData>('internationalTours');
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState('');

const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) {
      setFiles([]);
      setPreviewImages([]);
      return;
    }

    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);

    const previews: ImageItem[] = fileArray.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
    }));
    setPreviewImages(previews);

    // Upload to Supabase
    const uploadedPaths: string[] = [];
    for (const file of fileArray) {
      const path = await uploadFile(file, 'posts', uuidv4());
      if (path) uploadedPaths.push(path);
    }
    console.log('Uploaded paths:', uploadedPaths);
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
      setError('Title, description, and at least one image are required.');
      return;
    }

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        images: files.map(f => f.name), // paths saved via uploadFile
        user_id: user.id,
      });

      if (error) throw error;

      const newPost: DocumentaryCard = {
        title: title.trim(),
        description: description.trim(),
        images: previewImages,
        categoryIcon: getIcon(category),
      };

      setData((prev) => ({
        ...prev,
        [category]: [newPost, ...prev[category]],
      }));

      resetForm();
      setError('');
    } catch (error: any) {
      setError('Failed to save post: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 8px 18px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>Admin Panel</h1>

      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as keyof DocumentaryData)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          >
            {categories.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', minHeight: 120 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </div>

        {previewImages.length > 0 && (
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', marginBottom: 16 }}>
            {previewImages.map((img, index) => (
              <div key={index} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                <img src={img.src} alt={img.alt} style={{ width: '100%', height: 80, objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: '#f00', marginBottom: 16 }}>{error}</p>}

        <button
          type="submit"
          style={{ width: '100%', padding: 12, border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Create Post
        </button>
      </form>

    </div>
  );
}
