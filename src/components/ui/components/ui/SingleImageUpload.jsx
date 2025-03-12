// src/components/ui/SingleImageUpload.jsx
'use client';

import React, { useState } from 'react';

const SingleImageUpload = ({ currentImage, onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    
    // Start upload
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        // Pass all three URLs to the parent component
        onImageUploaded(data.imageUrls);
        
        // Show the medium version in the preview
        setPreviewUrl(data.imageUrls.medium);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
      // Reset the preview if upload failed
      setPreviewUrl(currentImage || "");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="border rounded-md p-3">
      <label className="block text-sm font-medium mb-2">Featured Image</label>
      {previewUrl ? (
        <div className="relative mb-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded-md" 
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl("");
              onImageUploaded({small: "", medium: "", large: ""});
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
          >
            ✕
          </button>
        </div>
      ) : null}
      
      <div className="flex items-center justify-center">
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors py-2 px-4 rounded-md text-sm flex items-center justify-center w-full">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageSelect}
            disabled={isUploading}
          />
          {isUploading ? "Uploading..." : (previewUrl ? "Change Image" : "Upload Image")}
        </label>
      </div>
    </div>
  );
};

export default SingleImageUpload;