/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: "dist",
  swcMinify: false, // @Bugfix: Chart.js prevents deployments.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
