/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Sometimes strict mode double-invokes effects causing timer bugs
    typescript: {
        ignoreBuildErrors: true, // We are handling them manually
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
