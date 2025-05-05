// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["pt-BR", "en"],
    defaultLocale: "pt-BR",
    localeDetection: false,
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
