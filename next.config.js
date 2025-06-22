/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "upload.wikimedia.org",
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Your other rewrites here
    ];
  },
};

module.exports = nextConfig;
