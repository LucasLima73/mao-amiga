import { Metadata } from 'next';
import { defaultMetadata } from './metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Mão Amiga | Apoio a Imigrantes e Refugiados no Brasil',
  description: 'Plataforma de acolhimento e informações para imigrantes e refugiados no Brasil, com trilhas de acesso à saúde, direitos humanos, documentação e apoio socioeconômico.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Mão Amiga | Apoio a Imigrantes e Refugiados no Brasil',
    description: 'Plataforma de acolhimento e informações para imigrantes e refugiados no Brasil, com trilhas de acesso à saúde, direitos humanos, documentação e apoio socioeconômico.',
    url: 'https://mao-amiga.site',
  }
};
