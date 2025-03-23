/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable image optimization if causing issues
  images: {
    domains: ['coffycoin.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // Disable specific optimizations that might be causing issues
  experimental: {
    // Disable critters CSS inlining if it's causing problems
    optimizeCss: false,
    // Other experimental features you might be using
    esmExternals: 'loose',
    scrollRestoration: true,
  },
  
  // Handle specific environment variables if needed
  env: {
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://bsc-dataseed.binance.org/',
  },
  
  // Add custom webpack configuration to resolve potential issues
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performans iyileştirmeleri
  poweredByHeader: false,
  compress: true,
  // Oyun yönlendirmeleri
  async rewrites() {
    return [
      {
        source: '/games/coffy',
        destination: '/coffygame/game.html'
      },
      {
        source: '/coffygame/:path*',
        destination: '/coffygame/:path*'
      },
      {
        source: '/games/hungerium',
        destination: '/hungeriumgame/game.html'
      },
      {
        source: '/hungeriumgame/:path*',
        destination: '/hungeriumgame/:path*'
      }
    ]
  }
}

module.exports = nextConfig
