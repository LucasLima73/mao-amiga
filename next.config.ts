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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://www.google-analytics.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com;
              font-src 'self';
              object-src 'none';
              connect-src 'self' https://identitytoolkit.googleapis.com https://www.google-analytics.com https://firestore.googleapis.com https://mao-amiga-api.onrender.com/api/assistant https://newsapi.org;
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\n/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
