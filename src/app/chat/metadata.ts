import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Chat de Atendimento | Mão Amiga',
  description: 'Chat de atendimento para imigrantes e refugiados no Brasil. Tire suas dúvidas sobre documentação, direitos, saúde e apoio socioeconômico.',
  keywords: [...(defaultMetadata.keywords as string[]), 'chat', 'atendimento', 'dúvidas', 'ajuda online', 'suporte'],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Chat de Atendimento | Mão Amiga',
    description: 'Chat de atendimento para imigrantes e refugiados no Brasil. Tire suas dúvidas sobre documentação, direitos, saúde e apoio socioeconômico.',
    url: 'https://maoamiga.org/chat',
    type: 'website',
  }
};
