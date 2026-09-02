import React, { useState } from 'react'
import './securitySettings.scss'
import { useTranslation } from 'react-i18next'
type AdminPasswordChange = {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
}

const SecuritySettings = () => {
    const [passwordData,setPasswordData] = useState<AdminPasswordChange>({
        currentPassword:"",
        newPassword:"",
        confirmNewPassword:""
    })
    const [error,setError] = useState<string>("")
    const [success,setSuccess] = useState<string>("");
    const [saving,setSaving] = useState<boolean>(false)
const {t} = useTranslation()



    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>)=>{
        setPasswordData({
            ...passwordData,
            [evt.target.name]: evt.target.value
        })
    }

    const changePassword = async(evt:React.FormEvent<HTMLFormElement>)=>{
evt.preventDefault();
setError("");
setSuccess("");


if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
    setError("All fields are required")
    return
}
if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    setError("password does not match")
    return
}
if (passwordData.newPassword.length <8) {
          setError("Password must be at least 8 characters");
      return;
}

setSaving(true)
    try {
        const token = localStorage.getItem("data_token")
        const response = await fetch("http://localhost:3000/admin/profile/changePassword",{
            method:"PATCH",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmNewPassword: passwordData.confirmNewPassword
            })
        })

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            setError(data.msg);
            return
        }
        setSuccess(data.msg);

        setPasswordData({
            currentPassword:"",
            newPassword:"",
            confirmNewPassword:""
        })
    } catch (error) {
        console.log(error);
        
    }finally{
        setSaving(false)
    }
    }
  return (
       <section className="security-settings">

      {/* Header */}

      <div className="security-settings__header">

        <h2>{t("adminSecurity")}</h2>

        <p>
         {t("securityPageParagraph")}
        </p>

      </div>


      {/* Security Form */}

      <form
        className="security-settings__form"
        onSubmit={changePassword}
      >

        {/* Current Password */}

        <div className="security-settings__field">

          <label htmlFor="currentPassword">
            {t("adminLoginTexts.currentPassword")}
          </label>

          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            placeholder= {t("adminLoginTexts.currentPasswordPlaceholder")}
          />

        </div>


        {/* New Password */}

        <div className="security-settings__field">

          <label htmlFor="newPassword">
             {t("adminLoginTexts.newPassword")}
          </label>

          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            placeholder= {t("adminLoginTexts.newPasswordPlaceholder")}
          />

          <span className="security-settings__hint">
            {t("adminLoginTexts.hintPassword")}
          </span>

        </div>


        {/* Confirm Password */}

        <div className="security-settings__field">

          <label htmlFor="confirmNewPassword">
              {t("adminLoginTexts.confirmNewPassword")}
          </label>

          <input
            id="confirmNewPassword"
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handleChange}
            placeholder= {t("adminLoginTexts.confirmNewPasswordPlaceholder")}
          />

        </div>


        {/* Error */}

        {error && (
          <p className="security-settings__error">
            {error}
          </p>
        )}


        {/* Success */}

        {success && (
          <p className="security-settings__success">
            {success}
          </p>
        )}


        {/* Button */}

        <button
          type="submit"
          className="security-settings__button"
          disabled={saving}
        >
          {saving
            ? t("changingProcess")
            :  t("changePasswordText")
          }
        </button>

      </form>

    </section>

  )
}

export default SecuritySettings