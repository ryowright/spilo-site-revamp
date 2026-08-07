/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Prefer AVIF (smallest), fall back to WebP. The optimizer serves the
    // original format to browsers that support neither.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
