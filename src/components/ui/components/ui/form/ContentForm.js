'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, X } from 'lucide-react';

const ContentForm = ({ type = 'writing' }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    content: '',
    tags: '',
    author: {
      name: '',
      email: ''
    },
    status: 'draft'
  });

  const categories = type === 'writing' 
    ? ['philosophy', 'poem', 'article', 'short story', 'short writings', 'politics', 'cinema', 'letter', 'joke']
    : ['web-development', 'javascript', 'react', 'backend', 'devops', 'cloud'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Convert content based on type
      const contentData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        [type === 'writing' ? 'body' : 'content']: formData.content
      };

      // Remove content field as it's been converted
      delete contentData.content;
      
      submitData.append(type, JSON.stringify(contentData));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const endpoint = type === 'writing' ? '/api/writings' : '/api/tech-blog';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        throw new Error('Failed to create content');
      }

      const result = await response.json();
      router.push(type === 'writing' ? `/quill/${result._id}` : `/tech/${result._id}`);
    } catch (error) {
      console.error('Error creating content:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Create New {type === 'writing' ? 'Writing' : 'Tech Blog'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Subtitle */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({...prev, subtitle: e.target.value}))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Author Info */}
        {type === 'tech-blog' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Author Name *</label>
              <input
                type="text"
                required
                value={formData.author.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, name: e.target.value }
                }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Author Email *</label>
              <input
                type="email"
                required
                value={formData.author.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  author: { ...prev.author, email: e.target.value }
                }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
            rows={10}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-mono"
          />
        </div>

        {/* Tags (for tech blog) */}
        {type === 'tech-blog' && (
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
              placeholder="react, nextjs, typescript"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full h-64">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            `Create ${type === 'writing' ? 'Writing' : 'Tech Blog'}`
          )}
        </button>
      </form>
    </div>
  );
};

export default ContentForm;