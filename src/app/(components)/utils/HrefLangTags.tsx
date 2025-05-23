'use client';

import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

/**
 * Componente para gerenciar tags hreflang para SEO em sites multilíngues
 * Ajuda os motores de busca a entenderem as versões de idioma disponíveis
 */
const HrefLangTags: React.FC = () => {
  const pathname = usePathname();
  
  // Define os idiomas suportados conforme configuração i18n
  const languages = [
    { code: 'pt-BR', hreflang: 'pt' },
    { code: 'en-US', hreflang: 'en' },
    { code: 'es-ES', hreflang: 'es' },
    { code: 'fr-FR', hreflang: 'fr' },
    { code: 'ar-SA', hreflang: 'ar' }
  ];
  
  // Constrói a URL base
  const baseUrl = 'https://mao-amiga.site';
  
  // Remove o prefixo de idioma do caminho atual, se existir
  const langPrefixPattern = /^\/(pt|en|es|fr|ar)(\/|$)/;
  const pathWithoutLang = pathname.replace(langPrefixPattern, '/');
  
  return (
    <Head>
      {/* Tag canônica para a versão padrão (português) */}
      <link rel="canonical" href={`${baseUrl}${pathWithoutLang}`} />
      
      {/* Tags hreflang para cada idioma suportado */}
      {languages.map(lang => (
        <link 
          key={lang.code}
          rel="alternate" 
          hrefLang={lang.hreflang}
          href={`${baseUrl}/${lang.hreflang === 'pt' ? '' : lang.hreflang}${pathWithoutLang}`}
        />
      ))}
      
      {/* Tag x-default para usuários sem preferência de idioma */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={`${baseUrl}${pathWithoutLang}`}
      />
    </Head>
  );
};

export default HrefLangTags;
