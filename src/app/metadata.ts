import { Metadata } from 'next';

// Default metadata for the entire site
export const defaultMetadata: Metadata = {
  title: {
    default: 'Mão Amiga | Apoio a Imigrantes e Refugiados',
    template: '%s | Mão Amiga'
  },
  description: 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil, oferecendo trilhas de acesso à saúde, direitos humanos, documentação e apoio socioeconômico.',
  keywords: ['imigrantes', 'refugiados', 'apoio', 'brasil', 'documentação', 'saúde', 'direitos humanos', 'inclusão'],
  authors: [{ name: 'Equipe Mão Amiga' }],
  creator: 'Mão Amiga',
  publisher: 'Mão Amiga',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://maoamiga.org'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt',
      'en-US': '/en',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'ar-SA': '/ar',
    },
  },
  openGraph: {
    title: 'Mão Amiga | Apoio a Imigrantes e Refugiados',
    description: 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil, oferecendo trilhas de acesso à saúde, direitos humanos, documentação e apoio socioeconômico.',
    url: 'https://maoamiga.org',
    siteName: 'Mão Amiga',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mão Amiga - Apoio a Imigrantes e Refugiados',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mão Amiga | Apoio a Imigrantes e Refugiados',
    description: 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil',
    images: ['/assets/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};
