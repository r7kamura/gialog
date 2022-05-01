/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "",
  reactStrictMode: true,
};

module.exports = nextConfig;
