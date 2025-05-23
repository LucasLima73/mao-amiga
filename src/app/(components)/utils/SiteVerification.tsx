'use client';

import React from 'react';
import Head from 'next/head';

/**
 * Componente para gerenciar tags de verificação de propriedade do site
 * Necessário para serviços como Google Search Console, Bing Webmaster Tools, etc.
 */
const SiteVerification: React.FC = () => {
  return (
    <Head>
      {/* Google Search Console */}
      <meta 
        name="google-site-verification" 
        content="ADICIONE_SEU_CÓDIGO_DE_VERIFICAÇÃO_AQUI" 
      />
      
      {/* Bing Webmaster Tools */}
      <meta 
        name="msvalidate.01" 
        content="ADICIONE_SEU_CÓDIGO_DE_VERIFICAÇÃO_AQUI" 
      />
      
      {/* Yandex Webmaster */}
      <meta 
        name="yandex-verification" 
        content="ADICIONE_SEU_CÓDIGO_DE_VERIFICAÇÃO_AQUI" 
      />
      
      {/* Pinterest */}
      <meta 
        name="p:domain_verify" 
        content="ADICIONE_SEU_CÓDIGO_DE_VERIFICAÇÃO_AQUI" 
      />
    </Head>
  );
};

export default SiteVerification;
