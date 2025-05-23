# Documentação de SEO - Mão Amiga

Este documento descreve a implementação de SEO (Search Engine Optimization) no site Mão Amiga, uma plataforma de apoio a imigrantes e refugiados no Brasil.

## Estrutura de SEO Implementada

### 1. Metadados Estáticos e Dinâmicos

- **Metadados Estáticos**: Implementados através do sistema de metadados do Next.js App Router em `src/app/metadata.ts` e arquivos `metadata.ts` específicos para cada seção.
- **Metadados Dinâmicos**: Implementados através do componente `SEOProvider` para páginas com conteúdo dinâmico.

### 2. Componentes de SEO

Foram criados os seguintes componentes para gerenciar o SEO do site:

- **SEOHead.tsx**: Gerencia metadados básicos e Open Graph para componentes do lado do cliente.
- **SchemaOrg.tsx**: Adiciona dados estruturados Schema.org para melhorar a compreensão do conteúdo pelos motores de busca.
- **HrefLangTags.tsx**: Gerencia tags hreflang para SEO em sites multilíngues.
- **SiteVerification.tsx**: Gerencia tags de verificação de propriedade do site.
- **Breadcrumbs.tsx**: Implementa breadcrumbs para melhorar a navegação e o SEO.
- **SEOProvider.tsx**: Integra todos os componentes de SEO em um único lugar.

### 3. Arquivos de Configuração

- **sitemap.ts**: Gera o sitemap.xml para melhorar a indexação pelos motores de busca.
- **robots.ts**: Controla o acesso dos rastreadores aos motores de busca.
- **site.webmanifest**: Configuração para Progressive Web App (PWA).
- **next.config.ts**: Configurações de otimização para SEO e performance.

### 4. Imagens e Ícones

Foram criados os seguintes arquivos para melhorar o compartilhamento em redes sociais e a experiência de PWA:

- **og-image.jpg**: Imagem para compartilhamento em redes sociais (Open Graph).
- **twitter-image.jpg**: Imagem para compartilhamento no Twitter.
- **Ícones PWA**: Ícones para Progressive Web App em `/public/icons/`.

## Como Usar

### Para Páginas Estáticas

Para páginas com conteúdo estático, crie um arquivo `metadata.ts` na pasta da página com o seguinte formato:

```typescript
import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Título da Página | Mão Amiga',
  description: 'Descrição da página para SEO.',
  // Outras propriedades específicas da página
};
```

### Para Páginas Dinâmicas

Para páginas com conteúdo dinâmico, use o componente `SEOProvider`:

```tsx
import SEOProvider from '../(components)/utils/SEOProvider';

// No componente da página
return (
  <>
    <SEOProvider
      title="Título da Página | Mão Amiga"
      description="Descrição da página para SEO."
      keywords={['palavra-chave1', 'palavra-chave2']}
      ogImage="/caminho/para/imagem.jpg"
      ogType="website" // ou "article"
      schemaType="WebPage" // ou "Article", "FAQPage", etc.
    />
    
    {/* Conteúdo da página */}
  </>
);
```

## Verificação e Monitoramento

Após a implementação, é recomendado verificar o SEO do site usando as seguintes ferramentas:

1. [Google Search Console](https://search.google.com/search-console)
2. [Bing Webmaster Tools](https://www.bing.com/webmasters)
3. [SEO Site Checkup](https://seositecheckup.com/)
4. [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools)

## Manutenção

Para manter o SEO do site atualizado:

1. Atualize os metadados quando o conteúdo das páginas mudar.
2. Mantenha o sitemap.xml atualizado quando novas páginas forem adicionadas.
3. Monitore o desempenho do site no Google Search Console e outras ferramentas.
4. Atualize as imagens de Open Graph quando necessário.

## Internacionalização (i18n)

O site suporta os seguintes idiomas:

- Português (pt-BR) - Idioma padrão
- Inglês (en)
- Espanhol (es)
- Francês (fr)
- Árabe (ar)

As tags hreflang foram configuradas para ajudar os motores de busca a entenderem as versões de idioma disponíveis.
