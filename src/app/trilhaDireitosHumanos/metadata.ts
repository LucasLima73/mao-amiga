import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Trilha de Direitos Humanos | Mão Amiga',
  description: 'Informações sobre direitos humanos para imigrantes e refugiados no Brasil, incluindo direitos básicos, proteção contra discriminação e recursos de apoio.',
  keywords: [...(defaultMetadata.keywords as string[]), 'direitos humanos', 'proteção', 'discriminação', 'direitos básicos'],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Trilha de Direitos Humanos | Mão Amiga',
    description: 'Informações sobre direitos humanos para imigrantes e refugiados no Brasil, incluindo direitos básicos, proteção contra discriminação e recursos de apoio.',
    url: 'https://mao-amiga.site/trilhaDireitosHumanos',
    type: 'article',
  }
};
