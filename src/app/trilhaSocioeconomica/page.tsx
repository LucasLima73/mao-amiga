"use client";

import React from "react";
import TrilhaSocioeconomica from "../(components)/socioeconomico/page";
import SEOProvider from "../(components)/utils/SEOProvider";
import Breadcrumbs from "../(components)/utils/Breadcrumbs";
import { useTranslation } from "react-i18next";

export default function TrilhaSocioeconomicaPage() {
  const { t } = useTranslation();
  
  return (
    <>
      {/* SEO Provider */}
      <SEOProvider
        title={t('apoio_socioeconomico_button', 'Trilha Socioeconômica | Mão Amiga')}
        description={t('socioeconomico_description', 'Informações sobre apoio socioeconômico para imigrantes e refugiados no Brasil, incluindo acesso a benefícios sociais, oportunidades de emprego e educação.')}
        keywords={['apoio socioeconômico', 'emprego', 'educação', 'benefícios sociais', 'moradia']}
        ogImage="/assets/images/apoio-financeiro.png"
        ogType="article"
        schemaType="Article"
        datePublished="2023-01-01"
        dateModified="2025-05-23"
        authorName="Equipe Mão Amiga"
      />
      
      {/* Breadcrumbs para navegação e SEO */}
      <Breadcrumbs />
      
      {/* Conteúdo da página */}
      <TrilhaSocioeconomica />
    </>
  );
}
