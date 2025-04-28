/* eslint-disable @next/next/next-script-for-ga */
'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./(components)/utils/navbar";
import AboutButton from "./(components)/utils/aboutbutton";
import Footer from "./(components)/utils/footer";
import RootClientProviders from "./RootClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JXWD7BCWV"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4JXWD7BCWV');
          `,
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <RootClientProviders>
          <Navbar />
          {children}
          <AboutButton />
          <Footer/>
          </RootClientProviders>
      </body>
    </html>
  );
}
