'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface BreadcrumbsProps {
  homeLabel?: string;
  className?: string;
}

/**
 * Componente de Breadcrumbs para melhorar a navegação e o SEO
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  homeLabel, 
  className = 'flex items-center text-sm text-gray-600 py-2'
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  
  // Não mostrar breadcrumbs na página inicial
  if (pathname === '/') return null;
  
  // Mapeamento de caminhos para nomes legíveis
  const pathMap: Record<string, string> = {
    'trilhaDireitosHumanos': t('direitos_humanos_button', 'Direitos Humanos'),
    'trilhaDocumentacao': t('documentacao_button', 'Documentação'),
    'trilhaSocioeconomica': t('apoio_socioeconomico_button', 'Apoio Socioeconômico'),
    'chat': t('chat', 'Chat de Atendimento'),
  };
  
  // Divide o caminho e cria os itens do breadcrumb
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Prepara os itens do breadcrumb
  const breadcrumbItems = [
    { label: homeLabel || t('home', 'Início'), path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        label: pathMap[segment] || segment,
        path
      };
    })
  ];
  
  // Dados estruturados para breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `https://maoamiga.org${item.path}`
    }))
  };
  
  return (
    <>
      {/* Breadcrumbs visíveis */}
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center space-x-1 md:space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <span className="mx-1 text-gray-400">/</span>
              )}
              
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-yellow-500" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.path}
                  className="hover:text-yellow-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Dados estruturados para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default Breadcrumbs;
