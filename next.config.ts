import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn1.gstatic.com']
  }
};

export default nextConfig;
