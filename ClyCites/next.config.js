/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },
};

module.exports = nextConfig;
