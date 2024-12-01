/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '64.media.tumblr.com',
          pathname: '/**',
        }
      ],
    },
  }
  
  export default nextConfig;
