/* eslint-disable @next/next/next-script-for-ga */
'use client';
import React, { useState } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './(components)/utils/navbar';
import MobileNavbar from './(components)/utils/MobileNavbar';
import MobileMenu from './(components)/utils/MobileMenu';
import Footer from './(components)/utils/footer';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import RootClientProviders from './RootClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // estado para controle do menu mobile em todas as páginas
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JXWD7BCWV"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}  
            gtag('js', new Date());
            gtag('config', 'G-4JXWD7BCWV');
          `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootClientProviders>
          {/* Navbar desktop/topo */}
          <Navbar />

          {/* Mobile bottom menu (aparece em todas as páginas) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <MobileNavbar onOpenMenu={() => setIsMenuOpen(true)} />
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>

          {/* Conteúdo das páginas */}
          <div className="pb-16">{children}</div>

          {/* Footer */}
          <Footer />
        </RootClientProviders>
      </body>
    </html>
  );
}
