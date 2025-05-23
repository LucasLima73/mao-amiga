'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const languages = [
    { code: 'pt', name: 'Português', flag: '/assets/flags/brazil.svg' },
    { code: 'en', name: 'English', flag: '/assets/flags/usa.svg' },
    { code: 'es', name: 'Español', flag: '/assets/flags/spain.svg' },
    { code: 'fr', name: 'Français', flag: '/assets/flags/france.svg' },
    { code: 'ar', name: 'العربية', flag: '/assets/flags/arabic.svg' },
  ];

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language-selected', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-black border-2 border-yellow-400 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg shadow-yellow-400/20">
        <h2 className="text-2xl font-bold mb-2 text-center text-yellow-400">{t('languageModal.title')}</h2>
        <h3 className="text-md mb-5 text-center text-gray-400">{t('languageModal.subtitle')}</h3>
        
        <div className="grid grid-cols-1 gap-3 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex items-center w-full p-3 border border-yellow-400 rounded-lg bg-black hover:bg-yellow-400 transition-colors group"
            >
              <div className="w-10 h-8 relative overflow-hidden mr-3">
                <Image
                  src={lang.flag}
                  alt={`${lang.name} flag`}
                  width={40}
                  height={30}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="text-sm font-medium text-white group-hover:text-black transition-colors">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
