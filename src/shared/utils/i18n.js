import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'kz',
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    backend: {
      loadPath : process.env.NODE_ENV === 'production' ?
        `/${process.env.REACT_APP_APP_NAME}/client/locales/{{lng}}/{{ns}}.json` :
        '/locales/{{lng}}/{{ns}}.json'
    },
    lng: 'ru', // 'kz' | 'en' | 'ru'
    // Using simple hardcoded resources for simple example
    ns: ['archiveFund', 'header', 'helpScreen', 'leaderWorkplace', 'readingRoom', 'signUpForm', 'sourcing'],
    defaultNS: 'translations',
    // whitelist: ['en', 'ru', 'kz'], // -> only this lngs are allowed
    // nonExplicitWhitelist: false,
    // language: ['en', 'ru', 'kz'],
    debug: false,
    preload: ['en', 'ru', 'kz'],

    react: {
      wait: false
    }
  });

export default i18n;
