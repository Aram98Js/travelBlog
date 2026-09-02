import i18n from "i18next";

export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};