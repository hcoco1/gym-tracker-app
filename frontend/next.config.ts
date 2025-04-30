/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  output: 'standalone', // For Docker deployment
  // Enable if using static export
  // trailingSlash: true,
  // images: { unoptimized: true }
};

module.exports = nextConfig;
