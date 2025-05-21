/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src'],
  },
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;