/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@todoai/ui', '@todoai/types'],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;

