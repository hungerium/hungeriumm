/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Doğrudan statik dosya erişimi için
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      },
    ]
  },
  // Basit yönlendirmeler
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
