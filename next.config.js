/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' }
    ]
  },
  async redirects() {
    return [
      { source: '/svc/:slug*', destination: '/services/:slug*', permanent: true }
    ];
  }
};
module.exports = nextConfig;
