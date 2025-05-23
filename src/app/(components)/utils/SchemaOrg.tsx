'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

interface SchemaOrgProps {
  type?: 'Organization' | 'WebPage' | 'Article' | 'FAQPage';
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  articleBody?: string;
  faqItems?: Array<{question: string; answer: string}>;
}

/**
 * Componente para adicionar dados estruturados Schema.org
 * Melhora a compreensão do conteúdo pelos motores de busca
 */
const SchemaOrg: React.FC<SchemaOrgProps> = ({
  type = 'WebPage',
  title,
  description,
  url,
  imageUrl = '/assets/images/og-image.jpg',
  datePublished,
  dateModified,
  authorName = 'Equipe Mão Amiga',
  articleBody,
  faqItems,
}) => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  
  // Valores padrão se não forem fornecidos
  const pageTitle = title || t('site_title', 'Mão Amiga | Apoio a Imigrantes e Refugiados');
  const pageDescription = description || t('site_description', 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil');
  
  // Constrói a URL completa
  const baseUrl = 'https://maoamiga.org';
  const pageUrl = url || `${baseUrl}${pathname}`;
  const fullImageUrl = `${baseUrl}${imageUrl}`;
  
  // Data atual se não for fornecida
  const now = new Date().toISOString();
  const pubDate = datePublished || now;
  const modDate = dateModified || now;

  // Dados da organização (sempre incluídos)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Mão Amiga',
    'url': baseUrl,
    'logo': `${baseUrl}/assets/images/logo.png`,
    'description': t('site_description', 'Plataforma de apoio e informações para imigrantes e refugiados no Brasil'),
    'sameAs': [
      'https://facebook.com/maoamiga',
      'https://instagram.com/maoamiga',
      'https://twitter.com/maoamiga'
    ]
  };

  // Esquema específico com base no tipo
  let specificSchema = {};
  
  switch (type) {
    case 'WebPage':
      specificSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'url': pageUrl,
        'name': pageTitle,
        'description': pageDescription,
        'inLanguage': i18n.language || 'pt',
        'isPartOf': {
          '@type': 'WebSite',
          'url': baseUrl,
          'name': 'Mão Amiga',
          'description': t('site_description')
        },
        'primaryImageOfPage': {
          '@type': 'ImageObject',
          'url': fullImageUrl
        },
        'datePublished': pubDate,
        'dateModified': modDate
      };
      break;
      
    case 'Article':
      specificSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': pageTitle,
        'description': pageDescription,
        'image': fullImageUrl,
        'datePublished': pubDate,
        'dateModified': modDate,
        'author': {
          '@type': 'Person',
          'name': authorName
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Mão Amiga',
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/assets/images/logo.png`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        'articleBody': articleBody
      };
      break;
      
    case 'FAQPage':
      const faqList = faqItems?.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      })) || [];
      
      specificSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqList
      };
      break;
      
    default:
      specificSchema = {};
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(specificSchema) }}
      />
    </>
  );
};

export default SchemaOrg;
