/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
