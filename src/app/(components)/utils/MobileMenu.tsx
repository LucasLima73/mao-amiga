"use client";
import React from "react";
import Link from "next/link";
import {
  X,
  FileText,
  Heart,
  HandCoins,
  Gavel,
  MessageSquare,
  MapPin,
  Info,
  User,
} from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t, i18n } = useTranslation();

  const baseClasses =
    "fixed inset-0 bg-black/90 z-50 transform transition-transform duration-300";
  const positionClass = isOpen ? "translate-y-0" : "translate-y-full";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <div className={`${baseClasses} ${positionClass}`}>
      <div className="flex flex-col h-full text-yellow-500">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/20">
          <Link href="/" onClick={onClose}>
            <h1 className="text-xl font-bold cursor-pointer">{t('appName')}</h1>
          </Link>
          <button
            onClick={onClose}
            className="hover:bg-yellow-500/10 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          {/* Trilhas */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">{t('menu.trails')}</h2>
            <Link href="/trilhaDocumentacao">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <FileText size={20} /> {t('menu.documentation')}
              </button>
            </Link>
            <Link href="/trilhaSaude">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Heart size={20} /> {t('menu.health')}
              </button>
            </Link>
            <Link href="/socioeconomico">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <HandCoins size={20} /> {t('menu.socioeconomic')}
              </button>
            </Link>
            <Link href="/direitosHumanos">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Gavel size={20} /> {t('menu.rights')}
              </button>
            </Link>
          </div>

          <div className="my-6 border-t border-yellow-500/20" />

          {/* Ferramentas */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">
              {t('menu.tools')}
            </h2>
            <Link href="/chat">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <MessageSquare size={20} /> {t('menu.chatAssistant')}
              </button>
            </Link>
            <Link href="/mapa">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <MapPin size={20} /> {t('menu.serviceMap')}
              </button>
            </Link>
          </div>

          <div className="my-6 border-t border-yellow-500/20" />

          {/* Sobre */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">{t('menu.about')}</h2>
            <Link href="/sobre">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Info size={20} /> {t('menu.aboutUs')}
              </button>
            </Link>
            <button
              onClick={onClose /* aqui você pode disparar seu modal de login */}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
            >
              <User size={20} /> {t('menu.loginRegister')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-yellow-500/20">
          <h2 className="text-gray-400 text-xs font-medium">{t('menu.language')}</h2>
          <div className="flex justify-center gap-4 mt-3">
            {["pt", "en", "es", "fr", "ar"].map((l) => {
              const active = l === i18n.language;
              return (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`h-8 w-12 rounded border text-sm font-medium transition-colors ${
                    active
                      ? "border-yellow-500 bg-yellow-500 text-black"
                      : "border-yellow-500 hover:bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
