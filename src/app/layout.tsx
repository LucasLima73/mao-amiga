import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./(components)/utils/navbar";
import AboutButton from "./(components)/utils/aboutbutton";
import Ballon from "./(components)/utils/ballon";
import Footer from "./(components)/utils/footer"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mão Amiga",
  description: "Plataforma de apoio a refugiados no Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main> 
        <AboutButton />
        <Ballon />
        <Footer /> 
      </body>
    </html>
  );
}
