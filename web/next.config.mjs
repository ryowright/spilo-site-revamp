/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle, for the container build in ./Dockerfile.
  // Deliberately gated rather than always-on: Vercel is the host, never sets
  // DOCKER_BUILD, and so keeps exactly the build path it has today.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  images: {
    // Prefer AVIF (smallest), fall back to WebP. The optimizer serves the
    // original format to browsers that support neither.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
