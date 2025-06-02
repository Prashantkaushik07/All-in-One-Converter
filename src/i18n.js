// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "MY PROFILE": "MY PROFILE",
      "Account": "Account",
      "Security": "Security",
      "Processed Files": "Processed Files",
      "Settings": "Settings",
      "Language": "Language",
      "Current Language": "Current Language",
    },
  },
  hi: {
    translation: {
      "MY PROFILE": "मेरी प्रोफ़ाइल",
      "Account": "खाता",
      "Security": "सुरक्षा",
      "Processed Files": "प्रक्रियात फ़ाइलें",
      "Settings": "सेटिंग्स",
      "Language": "भाषा",
      "Current Language": "वर्तमान भाषा",
    },
  },
  fr: {
    translation: {
      "MY PROFILE": "MON PROFIL",
      "Account": "Compte",
      "Security": "Sécurité",
      "Processed Files": "Fichiers traités",
      "Settings": "Paramètres",
      "Language": "Langue",
      "Current Language": "Langue actuelle",
    },
  },
  de: {
    translation: {
      "MY PROFILE": "MEIN PROFIL",
      "Account": "Konto",
      "Security": "Sicherheit",
      "Processed Files": "Verarbeitete Dateien",
      "Settings": "Einstellungen",
      "Language": "Sprache",
      "Current Language": "Aktuelle Sprache",
    },
  },
  zh: {
    translation: {
      "MY PROFILE": "我的资料",
      "Account": "账户",
      "Security": "安全",
      "Processed Files": "处理的文件",
      "Settings": "设置",
      "Language": "语言",
      "Current Language": "当前语言",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
