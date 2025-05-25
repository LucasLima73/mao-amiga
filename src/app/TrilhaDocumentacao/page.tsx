"use client";

import React from "react";
import TrilhaDocumentacao from "../(components)/documentacao/page";
import SEOProvider from "../(components)/utils/SEOProvider";
import { useTranslation } from "react-i18next";

export default function TrilhaDocumentacaoPage() {
  const { t } = useTranslation();
  
  return (
    <>
      {/* SEO Provider */}
      <SEOProvider
        title={t('documentacao_button', 'Trilha de Documentação | Mão Amiga')}
        description={t('documentacao_description', 'Guia completo sobre documentação para imigrantes e refugiados no Brasil, incluindo processos de regularização, documentos necessários e onde obtê-los.')}
        keywords={['documentação', 'documentos', 'regularização', 'visto', 'passaporte', 'CPF', 'RNE']}
        ogImage="/assets/images/documentacao.png"
        ogType="article"
        schemaType="Article"
        datePublished="2023-01-01"
        dateModified="2025-05-23"
        authorName="Equipe Mão Amiga"
      />

      {/* Conteúdo da página */}
      <TrilhaDocumentacao />
    </>
  );
}
