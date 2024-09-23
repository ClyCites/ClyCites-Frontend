/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },
};

module.exports = nextConfig;
