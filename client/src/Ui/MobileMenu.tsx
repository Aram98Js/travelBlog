import { useTranslation } from 'react-i18next'
import './mobileMenu.scss'

import { Link } from 'react-router-dom'
import socialData from '../socialData'
type MobileMenuToggle = {
    hamburgerToggle: boolean
}
const MobileMenu = ({hamburgerToggle}:MobileMenuToggle) => {
    const {t} = useTranslation()
  return (
        <div className={`mobile-menu ${hamburgerToggle ? "active" : ""}`}>                                                                                                                          
      
    <div className="logoBlock">

    </div>

      <nav className="mobile-menu__nav">

        <Link to="/">{t("home")}</Link>
        <Link to="/about">{t("about")}</Link>
        <Link to="/travel">{t("travel")}</Link>
        <Link to="/food">{t("food")}</Link>
        <Link to="/relax">{t("relax")}</Link>
      </nav>
   <div className="socialBlock">
    {socialData.map((item, index)=>{
      return(
        <Link key={index} to={item.href}>
          <img src={item.imgUrl} alt={item.name} />
          <span>{item.name}</span>
        </Link>
      )
    })}
   </div>
    </div>
  )
}

export default MobileMenu