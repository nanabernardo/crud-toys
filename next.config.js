/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite carregar imagens de domínios externos além do local
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
