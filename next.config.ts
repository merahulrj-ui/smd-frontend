import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Bypass Next.js strict private IP/SSRF blocking for WAMP localhost
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  allowedDevOrigins: ['10.194.242.217', '192.168.0.0/16', '10.0.0.0/8'],
};

export default nextConfig;
