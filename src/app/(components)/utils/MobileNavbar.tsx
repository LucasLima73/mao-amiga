'use client';
import React from 'react';
import Link from 'next/link';
import { FileText, Heart, MessageSquare, MapPin, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileNavbarProps {
  onOpenMenu: () => void;
}

export default function MobileNavbar({ onOpenMenu }: MobileNavbarProps) {
  const { t } = useTranslation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-500/20 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        <NavButton href="/trilhaDocumentacao" icon={<FileText size={20} />} label={t('navbar.docs_short')} />
        <NavButton href="/trilhaSaude"      icon={<Heart       size={20} />} label={t('navbar.health_short')} />
        <NavButton href="/chat"             icon={<MessageSquare size={20} />} label={t('navbar.chat')} />
        <NavButton href="/mapa"             icon={<MapPin       size={20} />} label={t('navbar.map')} />
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center text-yellow-500 hover:bg-yellow-500/10 transition-colors"
        >
          <Menu size={20} />
          <span className="text-xs mt-1">{t('menu.menu')}</span>
        </button>
      </div>
    </div>
  );
}

interface NavButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavButton = ({ href, icon, label }: NavButtonProps) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center text-yellow-500 hover:bg-yellow-500/10 transition-colors"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);
