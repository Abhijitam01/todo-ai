/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@todoai/ui', '@todoai/types'],
  experimental: {
    typedRoutes: true,
  },
  // Enable standalone output for Docker
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  webpack: (config, { isServer }) => {
    // Ensure react-hook-form is resolved correctly
    // Force it to use the standard build, not react-server build
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-hook-form': require.resolve('react-hook-form'),
    };
    
    // Override export conditions to skip react-server
    if (isServer && config.resolve.conditionNames) {
      config.resolve.conditionNames = config.resolve.conditionNames.filter(
        (name) => name !== 'react-server'
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;

