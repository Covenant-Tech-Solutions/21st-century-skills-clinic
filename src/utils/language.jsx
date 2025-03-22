"use client"
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let supportedLanguages = process.env.NEXT_PUBLIC_LANGUAGE_CONFIGURATION;
supportedLanguages = supportedLanguages.substring(1, supportedLanguages.length - 1).split(',').map(lang => lang.trim().replace(/'/g, ''));

let defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE


let resources = {};
supportedLanguages.forEach((element) => {
    resources[element] = {
        translations: require("../locale/" + element + ".json"),
    };
});
i18n.use(initReactI18next).init({
    fallbackLng: defaultLanguage,
    lng: defaultLanguage,
    resources,
    ns: ["translations"],
    defaultNS: "translations",
});

i18n.languages = supportedLanguages;

export default i18n;
