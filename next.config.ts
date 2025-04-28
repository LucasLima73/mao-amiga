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
              img-src 'self' blob: data: https://www.google-analytics.com;
              font-src 'self';
              object-src 'none';
              connect-src 'self' https://identitytoolkit.googleapis.com https://www.google-analytics.com https://firestore.googleapis.com;
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
