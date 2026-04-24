import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import mg from './locales/mg.json';
import wo from './locales/wo.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'mg', label: 'Malagasy',  flag: '🇲🇬' },
  { code: 'wo', label: 'Wolof',     flag: '🇸🇳' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code'];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      mg: { translation: mg },
      wo: { translation: wo },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'aina-lang',
    },
  });

export default i18n;
