import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import "./settings.scss";
import { Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next"




const Settings = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const moveToSecurityPage = (url:string)=>{
    navigate(url)
  }
  const moveToProfileChangePage = (url:string)=>{
navigate(url)
  }


  const moveToNotificationPage = (url:string)=>{
    navigate(url)
  }

  const deleteUser = async ()=>{
    const token = localStorage.getItem("accessToken")
await fetch ("http://localhost:3000/userDelete",{
  method:"DELETE",
  headers:{
    Authorization: `Bearer ${token}`
  }
})
  }


    const logOut = ()=>{
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user")
    navigate("/login",{replace:true});
  }
  return (

    <Fragment>
      <Helmet> 
        <title>{t("pagesTitle.settingsPage")}</title>
     <meta
name="description"
content="
In this section, the user can change their information and why not also change their password.
"
/>


<meta
property="og:title"
content="Travel Notes | Settings"
/>


<meta
property="og:description"
content="
In this section, the user can change their information and why not also change their password.
"
/>
<meta
property="og:type"
content="website"
/>
      </Helmet>
<section className="settings">

      <div className="settings__header">
        <h1>{t("settingsText.profileText")}</h1>
        <p>{t("settingsText.profileContent")}</p>
      </div>

      <div className="settings__container">

        <div className="settings__card">
          <div className="icon">👤</div>

          <div className="content">
            <h3>{t("settingsText.profileText")}</h3>
            <p>{t("settingsText.profileContent")}</p>
          </div>

          <Button onClick={()=>moveToProfileChangePage("/profile_change")} className="editBtn">{t("settingsText.profileBtnText")}</Button>
        </div>


        <div className="settings__card">
          <div className="icon">🔔</div>

          <div className="content">
            <h3>{t("settingsText.notificationText")}</h3>
            <p>{t("settingsText.notificationContent")}</p>
          </div>

          <Button className="notificationBtn" onClick={()=>moveToNotificationPage("/notification")}>{t("settingsText.notificationBtnText")}</Button>
           
        </div>

        <div className="settings__card">
          <div className="icon">🔒</div>

          <div className="content">
            <h3>{t("settingsText.SecurityText")}</h3>
            <p>{t("settingsText.SecurityContent")}</p>
          </div>

          <Button onClick={()=>moveToSecurityPage("/security")} className="passwordChangeBtn">{t("settingsText.securityBtnText")}</Button>
        </div>

        <div className="settings__card danger">
          <div className="icon">⚠️</div>

          <div className="content">
            <h3>{t("settingsText.DangerZoneText")}</h3>
            <p>{t("settingsText.DangerZoneContext")}</p>
          </div>

          <div className="actions">
            <Button onClick={logOut} className="logout">{t("settingsText.dangerZoneButtonText.logOut")}</Button>
            <Button onClick={deleteUser} className="delete">{t("settingsText.dangerZoneButtonText.deleteAccount")}</Button>
          </div>
        </div>

      </div>

    </section>
    </Fragment>
    
  );
};

export default Settings;