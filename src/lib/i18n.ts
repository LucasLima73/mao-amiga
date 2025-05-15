import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslations from '../locales/pt/translation.json';
import enTranslations from '../locales/en/translation.json';
import esTranslations from '../locales/es/translation.json';
import frTranslations from '../locales/fr/translation.json';
import arTranslations from '../locales/ar/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'pt', // Idioma padrão, o detector irá sobrescrever se houver valor no localStorage
    fallbackLng: 'pt',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      pt: {
        translation: ptTranslations
      },
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      },
      fr: {
        translation: frTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
