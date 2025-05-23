import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Página Não Encontrada | Mão Amiga',
  description: 'A página que você está procurando não foi encontrada. Volte para a página inicial para continuar navegando.',
  robots: {
    index: false,
    follow: true,
  },
};
