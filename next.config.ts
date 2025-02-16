import type { NextConfig } from 'next';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://www.google-analytics.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora o ESLint durante o build
  },
  async headers() {
    return [
      {
        // Aplica para todas as rotas
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Remove as quebras de linha para deixar a string em uma única linha
            value: cspHeader.replace(/\n/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
