import React, { useState } from 'react'
import './appearanceSettings.scss'
import { useTranslation } from 'react-i18next';
export type Theme = "light"|"dark"|"system";


const AppearanceSettings = () => {
  const [theme,setTheme] = useState<Theme>("light")
  const {t} = useTranslation()
  const handleChangeTheme = (evt: React.ChangeEvent<HTMLInputElement>)=>{
    setTheme(evt.target.value as Theme)
  }

const saveAppearance = async (evt:React.FormEvent<HTMLFormElement>)=>{
  evt.preventDefault();
const token = localStorage.getItem("data_token");
const response = await fetch("http://localhost:3000/admin/settings",{
  method:"PATCH",
  headers:{
    "Content-Type":"application/json",
    Authorization: `Bearer ${token}`
  },
  body:JSON.stringify({
    appearance:{
      theme
    }
  })
})
const data = await response.json();
console.log(data);

}


  return (
      <section className="appearance-settings">

      {/* Header */}

      <div className="appearance-settings__header">

        <h2>{t("adminAppearance")}</h2>

        <p>
         {t("adminAppearanceParagraph")}
        </p>

      </div>


      <form
        className="appearance-settings__form"
        onSubmit={saveAppearance}
      >

        {/* Theme */}

        <div className="appearance-settings__section">

          <div className="appearance-settings__section-header">

            <h3> {t("adminAppearanceTheme")}</h3>

            <p>
              {t("adminAppearanceThemeParagraph")}
            </p>

          </div>


          <div className="appearance-settings__theme-options">

            {/* Light */}

            <label
              className={`theme-card ${
                theme === "light" ? "active" : ""
              }`}
            >

              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={handleChangeTheme}
              />

              <div className="theme-card__preview theme-card__preview--light">
                <div className="preview-header"></div>

                <div className="preview-content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="theme-card__info">
                <strong>{t("adminAppearanceLightTheme")}</strong>
                <span>{t("adminAppearanceLightThemeParagraph")}</span>
              </div>

            </label>


            {/* Dark */}

            <label
              className={`theme-card ${
                theme === "dark" ? "active" : ""
              }`}
            >

              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={handleChangeTheme}
              />

              <div className="theme-card__preview theme-card__preview--dark">
                <div className="preview-header"></div>

                <div className="preview-content">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="theme-card__info">
                <strong>{t("adminAppearanceDarkTheme")}</strong>
                <span>{t("adminAppearanceDarkThemeParagraph")}</span>
              </div>

            </label>


            {/* System */}

            <label
              className={`theme-card ${
                theme === "system" ? "active" : ""
              }`}
            >

              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={handleChangeTheme}
              />

              <div className="theme-card__preview theme-card__preview--system">
                <div className="preview-half preview-half--light">
                  <div></div>
                </div>

                <div className="preview-half preview-half--dark">
                  <div></div>
                </div>
              </div>

              <div className="theme-card__info">
                <strong>{t("adminAppearanceSystemTheme")}</strong>
                <span>{t("adminAppearanceSystemThemeParagraph")}</span>
              </div>

            </label>

          </div>

        </div>




        


        {/* Save */}

        <button
          type="submit"
          className="appearance-settings__save"
        >
          {t("saveChangeText")}
        </button>

      </form>

    </section>
  )
}

export default AppearanceSettings