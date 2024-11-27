// src/lib/validateConfig.js
export const validateCloudinaryConfig = () => {
    const requiredVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];
  
    const missingVars = requiredVars.filter(
      varName => !process.env[varName]
    );
  
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required Cloudinary environment variables: ${missingVars.join(', ')}`
      );
    }
  };