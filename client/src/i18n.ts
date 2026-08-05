import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru/common.json";
import en from "./locales/en/common.json";
import hy from "./locales/hy/common.json";

i18n
.use(initReactI18next)
.init({
    resources:{
        ru:{translation:ru},
        en:{translation:en},
        hy:{translation:hy}
    },
  lng: localStorage.getItem("lang") || "ru",
    fallbackLng:"ru",

    interpolation:{
        escapeValue:false
    }
})

export default i18n;