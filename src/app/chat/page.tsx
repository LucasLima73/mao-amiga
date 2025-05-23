"use client";

import React from "react";
import Chat from "@/app/(components)/chat/Chat";
import SEOProvider from "../(components)/utils/SEOProvider";
import Breadcrumbs from "../(components)/utils/Breadcrumbs";
import { useTranslation } from "react-i18next";

export default function ChatPage() {
  const { t } = useTranslation();
  
  return (
    <>
      {/* SEO Provider */}
      <SEOProvider
        title={t('chat_title', 'Chat de Atendimento | Mão Amiga')}
        description={t('chat_description', 'Chat de atendimento para imigrantes e refugiados no Brasil. Tire suas dúvidas sobre documentação, direitos, saúde e apoio socioeconômico.')}
        keywords={['chat', 'atendimento', 'dúvidas', 'ajuda online', 'suporte']}
        ogImage="/assets/images/logo.png"
        ogType="website"
        schemaType="WebPage"
      />
      
      {/* Breadcrumbs para navegação e SEO */}
      <Breadcrumbs />
      
      {/* Conteúdo da página */}
      <Chat />
    </>
  );
}
