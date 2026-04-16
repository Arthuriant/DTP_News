/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '8000',
        pathname: '/**', // 👈 TAMBAHKAN INI
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        pathname: '/**', 
      }
    ],
  },
};

module.exports = nextConfig;