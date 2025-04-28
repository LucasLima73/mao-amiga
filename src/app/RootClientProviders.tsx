'use client';
import I18nProviderClient from '@/lib/I18nProviderClient';

export default function RootClientProviders({ children }: { children: React.ReactNode }) {
  return <I18nProviderClient>{children}</I18nProviderClient>;
}