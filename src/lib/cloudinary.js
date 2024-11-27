// src/lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

export const uploadGeneratedImage = async (buffer, options = {}) => {
  try {
    if (!buffer) {
      throw new Error('No image data provided');
    }

    // Create upload stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'writings',
          resource_type: 'auto',
          transformation: [
            { width: 200, height: 200, crop: "fill", quality: "auto" },
            { width: 600, height: 600, crop: "fill", quality: "auto" },
            { width: 1200, height: 1200, crop: "fill", quality: "auto" }
          ],
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image'));
            return;
          }

          resolve({
            small: result.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto/'),
            medium: result.secure_url.replace('/upload/', '/upload/w_600,h_600,c_fill,q_auto/'),
            large: result.secure_url.replace('/upload/', '/upload/w_1200,h_1200,c_fill,q_auto/')
          });
        }
      );

      bufferToStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'writings',
      transformation: [
        { width: 200, height: 200, crop: "fill", quality: "auto" },
        { width: 600, height: 600, crop: "fill", quality: "auto" },
        { width: 1200, height: 1200, crop: "fill", quality: "auto" }
      ]
    });

    return {
      small: result.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto/'),
      medium: result.secure_url.replace('/upload/', '/upload/w_600,h_600,c_fill,q_auto/'),
      large: result.secure_url.replace('/upload/', '/upload/w_1200,h_1200,c_fill,q_auto/')
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (imageUrl) => {
    try {
      if (!imageUrl) return;
      
      // Extract public_id from the URL
      const publicId = imageUrl
        .split('/')
        .slice(-1)[0]
        .split('.')[0];
        
      await cloudinary.uploader.destroy(`writings/${publicId}`);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // We don't throw here as this is cleanup operation
    }
  };