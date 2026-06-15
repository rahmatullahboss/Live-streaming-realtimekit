/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@livestream/shared", "@livestream/overlay-engine"],
};

export default nextConfig;
