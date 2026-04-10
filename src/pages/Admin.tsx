import { useState, FormEvent } from 'react';
import { Plus, Trash2, Globe, MapPin, GraduationCap, Trophy } from 'lucide-react';
import type { ImageItem, DocumentaryData, GalleryItem } from '../types';
import { useDocumentaries } from '../hooks/useDocumentaries';

export default function Admin() {
  const { create, data, loading } = useDocumentaries();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'internationalTours' | 'nationalTours' | 'events' | 'awards'>('internationalTours');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const categories = [
    { key: 'internationalTours' as const, label: '🌍 International Tours' },
    { key: 'nationalTours' as const, label: '🗺️ National Tours' },
    { key: 'events' as const, label: '🎓 Events' },
    { key: 'awards' as const, label: '🏆 Awards' },
  ];

  type CategoryKey = typeof categories[number]['key'];

  const getCategoryIcon = (key: CategoryKey): React.ReactNode => {
    switch (key) {
      case 'internationalTours': return <Globe className="w-5 h-5 text-blue-600" />;
      case 'nationalTours': return <MapPin className="w-5 h-5 text-emerald-600" />;
      case 'events': return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'awards': return <Trophy className="w-5 h-5 text-orange-600" />;
      default: return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || imageUrls.length === 0) {
      setFormError('All fields required');
      return;
    }

    const gallery = {
      title: title.trim(),
      description: description.trim(),
      category,
      images: imageUrls.map((src, i) => ({
        src,
        alt: imageAlts[i] || `${title} image ${i + 1}`
      })) as ImageItem[]
    };

    try {
      await create(gallery);
      setTitle('');
      setDescription('');
      setImageUrls([]);
      setImageAlts([]);
      setFormError('');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const addImage = () => {
    setImageUrls([...imageUrls, '']);
    setImageAlts([...imageAlts, '']);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newAlts = [...imageAlts];
    newAlts[index] = alt;
    setImageAlts(newAlts);
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImageAlts(imageAlts.filter((_, i) => i !== index));
  };

  const totalGalleries = Object.values(data as DocumentaryData).reduce((sum, cat: any[]) => sum + cat.length, 0);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Documentary Admin
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create galleries → Saved to Supabase → Live on /documentary instantly
        </p>
        <div className="mt-6 text-lg font-semibold text-green-700 bg-green-100 px-6 py-3 rounded-2xl inline-flex items-center gap-3 shadow-lg">
          🟢 Live: {totalGalleries} galleries
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl ring-1 ring-white/20">
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">Event Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg shadow-inner"
              placeholder="e.g. Graduation Ceremony 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg shadow-inner appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-sm font-semibold mb-3 text-gray-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 min-h-[150px] resize-vertical text-lg shadow-inner"
            placeholder="Brief description of the event..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-5 text-gray-800">
            Images (paste full URLs)
            <span className="block text-xs text-gray-500 mt-1 font-normal">
              Examples: <code>/src/assets/images/events/1.jpg</code> or Supabase storage URLs
            </span>
          </label>
          <div className="space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors group hover:shadow-md">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase tracking-wide">Image {index + 1} URL</label>
                  <input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm shadow-sm"
                    placeholder="/src/assets/images/events/graduation1.jpg"
                  />
                </div>
                <div className="w-32 shrink-0">
                  <label className="block text-xs font-medium mb-2 text-gray-600 uppercase tracking-wide">Alt Text</label>
                  <input
                    value={imageAlts[index] || ''}
                    onChange={(e) => updateImageAlt(index, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm shadow-sm"
                    placeholder={`Photo ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="self-end p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl group-hover:scale-110 transition-all shadow-sm hover:shadow-md border hover:border-red-300"
                  title="Remove image"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {imageUrls.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-b from-gray-50 to-white">
                <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 font-medium">No images yet</p>
                <p className="text-sm text-gray-400">Add your first gallery image</p>
              </div>
            )}
            <button
              type="button"
              onClick={addImage}
              className="w-full p-8 border-2 border-dashed border-indigo-300 rounded-3xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:border-indigo-400 hover:from-indigo-100 hover:shadow-xl transition-all text-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl"
            >
              <Plus size={28} />
              Add Image Slot
            </button>
          </div>
        </div>

        {formError && (
          <div className="p-6 bg-red-50 border-2 border-red-200 text-red-900 rounded-3xl shadow-lg flex items-start gap-3">
            <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              !
            </div>
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={!title.trim() || !description.trim() || imageUrls.length === 0 || loading}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 text-white py-8 px-12 rounded-4xl font-black text-2xl shadow-2xl hover:shadow-4xl transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
        >
          {loading ? (
            <>
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving to Supabase...
              </div>
            </>
          ) : (
            <span className="flex items-center gap-3">
              🚀 Publish Gallery Live
            </span>
          )}
        </button>
      </form>

      {/* Live Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-4xl shadow-2xl border border-indigo-200/50 backdrop-blur-sm">
          <h3 className="text-3xl font-bold mb-8 text-indigo-900 flex items-center gap-3">
            📊
            {' '}
            Live Galleries (
            {totalGalleries}
            )
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
            {Object.entries(data).map(([catKey, items]: [string, GalleryItem[]]) => 
              items.length > 0 && (
                <div key={catKey} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                      {getCategoryIcon(catKey as CategoryKey)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl capitalize">
                        {catKey.replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {items.length} galleries
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex-shrink-0" />
                        <span className="font-medium text-gray-900 flex-1">
                          {item.title}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {item.images.length} images
                        </span>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        +{items.length - 4} more...
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            {totalGalleries === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-2xl">📸</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-600 mb-2">No galleries yet</h4>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first gallery above - it will appear here and on the live documentary page instantly
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-10 rounded-4xl border border-emerald-200 shadow-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-6 text-emerald-900 flex items-center gap-3">
              ✨ Instant Sync Magic
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-100 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h4 className="font-bold text-lg mb-2">Form Submit</h4>
                <p className="text-sm text-gray-700">→ Supabase create()</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h4 className="font-bold text-lg mb-2">Hook Refresh</h4>
                <p className="text-sm text-gray-700">→ useDocumentaries refetch</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h4 className="font-bold text-lg mb-2">Live Update</h4>
                <p className="text-sm text-gray-700">→ /documentary re-renders</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 p-8 rounded-3xl border border-indigo-200 shadow-xl">
            <h4 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center gap-3">
              💡 Quick Start URLs
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-2xl shadow-sm border">
                <code className="block font-mono bg-indigo-50 p-3 rounded-xl text-indigo-900 mb-2">
                  /src/assets/images/events/grad1.jpg
                </code>
                <span className="text-xs text-gray-600">Your local assets</span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border">
                <code className="block font-mono bg-indigo-50 p-3 rounded-xl text-indigo-900 mb-2 break-all">
                  https://your-project.supabase.co/storage/v1/object/public/gallery/event1.jpg
                </code>
                <span className="text-xs text-gray-600">Supabase Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

