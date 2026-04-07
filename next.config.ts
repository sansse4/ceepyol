import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // هذا السطر يسمح بتشغيل المشروع على استضافة تدعم Node.js
  images: {
    unoptimized: true,
  },
};

export default nextConfig;