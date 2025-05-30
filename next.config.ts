
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
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.3dmodels.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      { // Added for Supabase Storage
        protocol: 'https',
        hostname: 'fuefhogrzjkhzuqzdrtx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      { // Added for IKEA SVG logo
        protocol: 'https',
        hostname: 'www.ikea.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'talent-marjane.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.emploi.ma',
        port: '',
        pathname: '/**',
      },
      { // For new IKEA logo
        protocol: 'https',
        hostname: 'static.dezeen.com',
        port: '',
        pathname: '/**',
      },
      { // For Herman Miller logo
        protocol: 'https',
        hostname: 'imjustcreative.com',
        port: '',
        pathname: '/**',
      },
      { // For JYSK logo
        protocol: 'https',
        hostname: 'jyskblueline.com',
        port: '',
        pathname: '/**',
      },
      { // For Kinnarps and Höffner logos
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
