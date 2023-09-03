/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf.js-extract'],
      },
}

module.exports = nextConfig;
