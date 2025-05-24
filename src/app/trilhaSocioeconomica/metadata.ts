import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Trilha Socioeconômica | Mão Amiga',
  description: 'Informações sobre apoio socioeconômico para imigrantes e refugiados no Brasil, incluindo acesso a benefícios sociais, oportunidades de emprego e educação.',
  keywords: [...(defaultMetadata.keywords as string[]), 'apoio socioeconômico', 'emprego', 'educação', 'benefícios sociais', 'moradia'],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Trilha Socioeconômica | Mão Amiga',
    description: 'Informações sobre apoio socioeconômico para imigrantes e refugiados no Brasil, incluindo acesso a benefícios sociais, oportunidades de emprego e educação.',
    url: 'https://mao-amiga.site/socioeconomico',
    type: 'article',
  }
};
