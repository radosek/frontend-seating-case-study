import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import csTranslation from "./locales/cs/translation.json";

const resources = {
	en: { translation: enTranslation },
	cs: { translation: csTranslation },
};

i18next.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem("language") || "en",
	fallbackLng: "en",
	interpolation: { escapeValue: false },
});

export default i18next;
