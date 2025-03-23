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
  images: {
    domains: ['coffycoin.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
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
