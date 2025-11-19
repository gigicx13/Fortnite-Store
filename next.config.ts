/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    legacyBrowsers: false,
    serverActions: {
      allowedOrigins: ["*"]
    },
    // Isso força o Next a usar o servidor antigo (Webpack)
    // sem tentar usar o Turbopack
    useWebpackDevMiddleware: true
  }
};

module.exports = nextConfig;
