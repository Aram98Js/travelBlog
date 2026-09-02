import "./AdminSideBar.scss";
  import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom";
import logo from '../../assets/pngicons/putevye-zametki-logo.png'
import Button from "../../Components/Button";
import Armenia from '../../assets/changeLangFlag/Flag_of_Armenia_Flat_Round_Corner-64x64.png'
import Russia from '../../assets/changeLangFlag/Flag_of_Russia_Flat_Round_Corner-64x64.png'
import USA from '../../assets/changeLangFlag/Flag_of_United_States_Flat_Round_Corner-64x64.png'
import { changeLanguage } from "../Interfaces/changeLanguage";
const AdminSidebar = () => {





type SideBarData = {
  logo:string,
  link:string,
  pageName: string

}
const {t} = useTranslation()

const sideBarData:SideBarData[] = [
    {
logo:"../../../src/assets/pngicons/house (2).png",
link:"/admin/dashboard",
pageName: t("dashboard")
    },
    {
logo:"../../../src/assets/pngicons/burger.png",
link:"/admin/food",
pageName: t("adminFood")
    },
    {
logo:"../../../src/assets/pngicons/travel-bag.png",
link:"/admin/travelPage",
pageName: t("adminTravel")
    },
    {
logo:"../../../src/assets/pngicons/relaxation.png",
link:"/admin/relaxPage",
pageName:t("adminRelax")
    },
    {
logo:"../../../src/assets/pngicons/comments.png",
link:"/admin/comments",
pageName:t("adminComment")
    },
    {
logo:"../../../src/assets/pngicons/gear.png",
link:"/admin/settingsPage",
pageName:t("adminSettings")
    },
    {
logo:"../../../src/assets/pngicons/notification.png",
link:"/admin/adminNotification",
pageName:t("notificationAdmin")
    },
 
  ]
  return (

    <aside className="admin-sidebar">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <nav>

        {
          sideBarData.map((item,index)=>(
            
            <NavLink
              key={index}
              to={item.link}
            >
              <img src={item.logo} alt="" />
              {item.pageName}

            </NavLink>

          ))
        }


      </nav>
 <div className="languageBlock">
      <Button onClick={() => changeLanguage("hy")} className='flags'><img src={Armenia} alt="" /></Button>
          <Button onClick={() => changeLanguage("ru")} className='flags'><img src={Russia} alt="" /></Button>
          <Button onClick={() => changeLanguage("en")} className='flags'><img src={USA} alt="" /></Button>
 </div>

    </aside>

  );

};


export default AdminSidebar;