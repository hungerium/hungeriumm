/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on node modules in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        // Don't use require.resolve for these as they might not be installed yet
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: false,
        https: false,
        os: false,
        path: false
      };
    }
    
    // Explicitly mark ethers as external during SSR
    if (isServer) {
      config.externals = [...config.externals, 'ethers'];
    }

    // Run SVG file generation script during build
    if (isServer) {
      try {
        require('./utils/createSvgFiles');
      } catch (err) {
        console.warn('Warning: SVG generation script failed:', err.message);
      }
    }
    
    return config;
  },
  // Allow building with warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
