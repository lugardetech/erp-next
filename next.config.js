/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'vercel.app'], // Add any other domains you might use for images
  },
  // Add any other Next.js config options here
  output: 'standalone',
}

module.exports = nextConfig

