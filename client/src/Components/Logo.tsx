import { useTranslation } from "react-i18next";
import  "./logo.scss";
import logo from '../assets/pngicons/compass.png'

const Logo = () => {
  const { t } = useTranslation();

  return (
    <div className="logo">
      <img src={logo} className="compass" alt="" />

      <div className="logoText">
        <h4>{t("logo.title")}</h4>
        <span className="line"></span>
      </div>
    </div>
  );
};

export default Logo;