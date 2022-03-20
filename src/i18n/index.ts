import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import vi from './vi';

// translation catalog
const resources = {
  en,
  vi,
};

// initialize i18next with catalog and language to use
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
});
