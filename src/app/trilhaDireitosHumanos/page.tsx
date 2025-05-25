"use client";

import React from "react";
import TrilhaDireitosHumanos from "../(components)/direitosHumanos/page";
import SEOProvider from "../(components)/utils/SEOProvider";
import { useTranslation } from "react-i18next";

export default function TrilhaDireitosHumanosPage() {
  const { t } = useTranslation();
  
  return (
    <>
      {/* SEO Provider */}
      <SEOProvider
        title={t('direitos_humanos_button', 'Trilha de Direitos Humanos | Mão Amiga')}
        description={t('direitos_humanos_description', 'Informações sobre direitos humanos para imigrantes e refugiados no Brasil, incluindo direitos básicos, proteção contra discriminação e recursos de apoio.')}
        keywords={['direitos humanos', 'proteção', 'discriminação', 'direitos básicos', 'apoio legal']}
        ogImage="/assets/images/direitoshumanos.jpg"
        ogType="article"
        schemaType="Article"
        datePublished="2023-01-01"
        dateModified="2025-05-23"
        authorName="Equipe Mão Amiga"
      />
      
      {/* Conteúdo da página */}
      <TrilhaDireitosHumanos />
    </>
  );
}
