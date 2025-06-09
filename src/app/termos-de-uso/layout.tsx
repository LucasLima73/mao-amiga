import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Mão Amiga',
  description: 'Termos de uso da plataforma Mão Amiga para refugiados e imigrantes no Brasil.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
