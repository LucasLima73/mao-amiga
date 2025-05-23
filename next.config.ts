// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["pt-BR", "en", "es", "fr", "ar"],
    defaultLocale: "pt-BR",
    localeDetection: false,
  },
  // Otimizações para SEO e performance
  poweredByHeader: false, // Remove o header X-Powered-By para segurança
  compress: true, // Compressão gzip para melhor performance
  reactStrictMode: true, // Modo estrito do React para melhor qualidade de código
  images: {
    domains: ['maoamiga.org'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true, // Otimização de CSS
    optimizeServerReact: true, // Otimização do React no servidor
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 
                'self' 
                'unsafe-inline' 
                'unsafe-eval' 
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://maps.googleapis.com 
                https://maps.gstatic.com;
              style-src 'self' 'unsafe-inline';
              img-src 
                'self' 
                data: 
                blob: 
                https://www.google-analytics.com 
                https://identitytoolkit.googleapis.com 
                https://maps.googleapis.com 
                https://maps.gstatic.com;
              connect-src 
                'self' 
                https://identitytoolkit.googleapis.com 
                https://www.google-analytics.com 
                https://firestore.googleapis.com 
                https://maps.googleapis.com 
                https://maps.gstatic.com 
                https://api.thenewsapi.com 
                https://mao-amiga-api.onrender.com/api/assistant 
                https://newsapi.org;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `
              .replace(/\n/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
