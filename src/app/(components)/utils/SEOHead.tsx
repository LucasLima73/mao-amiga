'use client';

import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalPath?: string;
}

/**
 * Componente para gerenciar SEO em componentes do lado do cliente
 * Usado para páginas que precisam de SEO dinâmico baseado em conteúdo
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = '/assets/images/og-image.jpg',
  ogType = 'website',
  canonicalPath,
}) => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  
  // Valores padrão se não forem fornecidos
  const pageTitle = title || t('site_title', 'Mão Amiga | Apoio a Imigrantes e Refugiados');
  const pageDescription = description || t('site_description', 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil');
  const pageKeywords = keywords?.join(', ') || t('site_keywords', 'imigrantes, refugiados, apoio, brasil, documentação');
  
  // Determina o idioma atual
  const currentLang = i18n.language || 'pt';
  
  // Constrói a URL canônica
  const baseUrl = 'https://mao-amiga.site';
  const canonical = canonicalPath 
    ? `${baseUrl}${canonicalPath}` 
    : `${baseUrl}${pathname}`;

  return (
    <Head>
      {/* Metadados básicos */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Metadados Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:locale" content={`${currentLang}_${currentLang.toUpperCase()}`} />
      
      {/* Metadados Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Link canônico */}
      <link rel="canonical" href={canonical} />
      
      {/* Alternativas de idioma */}
      <link rel="alternate" href={`${baseUrl}/pt${pathname}`} hrefLang="pt" />
      <link rel="alternate" href={`${baseUrl}/en${pathname}`} hrefLang="en" />
      <link rel="alternate" href={`${baseUrl}/es${pathname}`} hrefLang="es" />
      <link rel="alternate" href={`${baseUrl}/fr${pathname}`} hrefLang="fr" />
      <link rel="alternate" href={`${baseUrl}/ar${pathname}`} hrefLang="ar" />
      <link rel="alternate" href={`${baseUrl}${pathname}`} hrefLang="x-default" />
    </Head>
  );
};

export default SEOHead;
