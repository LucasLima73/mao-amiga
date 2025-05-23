'use client';

import React from 'react';
import SEOHead from './SEOHead';
import SchemaOrg from './SchemaOrg';
import HrefLangTags from './HrefLangTags';
import SiteVerification from './SiteVerification';

interface SEOProviderProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalPath?: string;
  schemaType?: 'Organization' | 'WebPage' | 'Article' | 'FAQPage';
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  articleBody?: string;
  faqItems?: Array<{question: string; answer: string}>;
}

/**
 * Componente que integra todos os componentes de SEO em um único lugar
 * Facilita a implementação de SEO em todas as páginas
 */
const SEOProvider: React.FC<SEOProviderProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  canonicalPath,
  schemaType = 'WebPage',
  datePublished,
  dateModified,
  authorName,
  articleBody,
  faqItems
}) => {
  return (
    <>
      {/* Metadados básicos e Open Graph */}
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType={ogType}
        canonicalPath={canonicalPath}
      />
      
      {/* Dados estruturados Schema.org */}
      <SchemaOrg
        type={schemaType}
        title={title}
        description={description}
        imageUrl={ogImage}
        datePublished={datePublished}
        dateModified={dateModified}
        authorName={authorName}
        articleBody={articleBody}
        faqItems={faqItems}
      />
      
      {/* Tags hreflang para sites multilíngues */}
      <HrefLangTags />
      
      {/* Tags de verificação de propriedade do site */}
      <SiteVerification />
    </>
  );
};

export default SEOProvider;
