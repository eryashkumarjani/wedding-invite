import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Modern formats enable karo
    formats: ["image/avif", "image/webp"],

    // ✅ External images ke liye (Pexels, YouTube, etc)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      // ✅ Agar aur external sources ho to yaha add karo
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/**',
      // },
    ],

    // ✅ Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // ✅ IMPORTANT: Optimization enable rakho
    unoptimized: false,

    // ✅ Cache images for 60 seconds minimum
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
