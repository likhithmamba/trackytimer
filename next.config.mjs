/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Sometimes strict mode double-invokes effects causing timer bugs
};

export default nextConfig;
