/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'http://127.0.0.1:8000/storage/:path*',
      },
    ];
  },
  images: {
    domains: ['127.0.0.1'], // ← tambah ini
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