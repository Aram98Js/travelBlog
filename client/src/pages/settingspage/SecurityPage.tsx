import React, { Fragment, useState } from 'react'
import "./SecurityPage.scss"
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface ChangeNewPassword{
    currentPassword:string,
    newPassword: string,
    confirmNewPassword: string,
}
const SecurityPage = () => {
  const {t} = useTranslation();
    const [seePasswords,setSeePasswords] = useState<boolean>(false);
    const togglePasswords = ()=>{
        setSeePasswords(prev=>!prev)
    }
const [passwordFormData,setPasswordFormData] = useState<ChangeNewPassword>({
    currentPassword:"",
    newPassword: "",
    confirmNewPassword:""
    
})
const handleSubmit = async (evt: React.FormEvent)=>{
    evt.preventDefault();

     if (!passwordFormData.currentPassword || 
        !passwordFormData.newPassword || 
        !passwordFormData.confirmNewPassword) return;
     if (passwordFormData.newPassword!== passwordFormData.confirmNewPassword) {
        alert("password don't match ");
        return
     }
     const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3000/profile/changePassword",{
        method:"PATCH",
        headers:{
              "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({
     currentPassword:passwordFormData.currentPassword,
     newPassword:passwordFormData.newPassword,
     confirmNewPassword:passwordFormData.confirmNewPassword,
        })
    })
const data = await response.json();
console.log(data);
setPasswordFormData({
    currentPassword:"",
     newPassword:"",
     confirmNewPassword:""
})
}

const handleChange = (evt: React.ChangeEvent<HTMLInputElement>)=>{
    setPasswordFormData({
    ...passwordFormData,
    [evt.target.name]: evt.target.value
    })
}
  return (


    <Fragment>
      <Helmet>
  <title>{t("pagesTitle.securityPage")}</title>

  <meta
    name="description"
    content="Securely change your Travel Notes account password and keep your account protected."
  />

  <meta
    property="og:title"
    content="Change Password | Travel Notes"
  />

  <meta
    property="og:description"
    content="Securely change your Travel Notes account password and keep your account protected."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>
<section className="security-user-settings">

      <div className="security-settings__header">
        <h2>{t("securitPage.securityHeader")}</h2>
        <p>{t("securitPage.securityParagraph")}</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="input-group">

          <label>{t("securitPage.currentP")}</label>

          <input
            type={`${seePasswords?"text":"password"}`}
            value={passwordFormData.currentPassword}
            onChange={handleChange}
            name='currentPassword'
          />

        </div>

        <div className="input-group">

          <label>{t("securitPage.newP")}</label>

          <input
            type={`${seePasswords?"text":"password"}`}
            value={passwordFormData.newPassword}
            onChange={handleChange}
             name='newPassword'
          />

        </div>

        <div className="input-group">

          <label>{t("securitPage.confirmNewP")}</label>

          <input
            type={`${seePasswords?"text":"password"}`}
            value={passwordFormData.confirmNewPassword}
            onChange={handleChange}
            name='confirmNewPassword'
          />

        </div>

        <button type="submit">
          Save Password
        </button>
        <div className="checkBox">
       <input type="checkbox"  onClick={togglePasswords} />
         <label>{seePasswords?t("hidePassword"):t("showPassword")}</label>
        </div>
  
      </form>

    </section>
    </Fragment>
   
  )
}

export default SecurityPage