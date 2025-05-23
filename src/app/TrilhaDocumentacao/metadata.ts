import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Trilha de Documentação | Mão Amiga',
  description: 'Guia completo sobre documentação para imigrantes e refugiados no Brasil, incluindo processos de regularização, documentos necessários e onde obtê-los.',
  keywords: [...(defaultMetadata.keywords as string[]), 'documentação', 'documentos', 'regularização', 'visto', 'passaporte', 'CPF', 'RNE'],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Trilha de Documentação | Mão Amiga',
    description: 'Guia completo sobre documentação para imigrantes e refugiados no Brasil, incluindo processos de regularização, documentos necessários e onde obtê-los.',
    url: 'https://maoamiga.org/trilhaDocumentacao',
    type: 'article',
  }
};
