/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
    async rewrites() {
    return [
      // Your other rewrites here
    ];
  },
};

module.exports = nextConfig;
