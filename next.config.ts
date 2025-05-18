
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pickawood.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '3dmodels.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.3dmodels.org', // Ajouté
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
