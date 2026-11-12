
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './adminLogo.scss'
import logo from '../../assets/pngicons/compass.png'
const AdminLogo = () => {
  const { t } = useTranslation();

  return (
    <Link to="/admin/dashboard" className="adminLogo">
          <img
    src={logo}
    alt="Logo"
    className="adminLogoImage"
  />
      <div className="adminLogoText">
        <h4>{t("logo.title")}</h4>
        <span className="line"></span>
      </div>
    </Link>
  );
};

export default AdminLogo;
