/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dp8cn1dj2/**',
      },
    ],
    domains: ['res.cloudinary.com', 'example.com'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
  optimizeFonts: true
}

module.exports = nextConfig
