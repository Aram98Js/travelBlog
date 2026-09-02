import React, { Fragment, useEffect, useState } from 'react'
import './notificationSettings.scss'
import adminFetch from '../../adminFetch'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type NotificationData = {
  emailNotification:boolean,
  newComment:boolean
  newPost:boolean
  newLike: boolean
  systemNotification:boolean
}

const NotificationSettings = () => {
  const [notifications,setNotifications] = useState<NotificationData>({
    emailNotification: true,
    newComment: true,
    newPost: true,
    newLike:true,
    systemNotification: true,
  })


    const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
const navigate  = useNavigate()

const {t} = useTranslation()

  const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,checked} = evt.target;
    setNotifications({
      ...notifications,
      [name]: checked
    })
  }

  const saveNotification = async(evt:React.FormEvent<HTMLFormElement>)=>{
    evt.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("")
try {
const token = localStorage.getItem("data_token")
const response = await fetch("http://localhost:3000/admin/settings",{
  method:"PATCH",
  headers:{
"Content-Type":"application/json",
Authorization: `Bearer ${token}`
  },
  body:JSON.stringify({
        emailNotification: notifications.emailNotification,
    newComment: notifications.newComment,
    newPost: notifications.newPost,
    newLike:notifications.newLike,
    systemNotification: notifications.systemNotification
  })
}
)
 const data = await response.json()
console.log(data);
   if (!response.ok) {
      setError(data.msg);
      return;
    }
  setSuccess("Notification settings saved successfully")
} catch (error) {
  console.log(error);
  setError("Something went wrong");
  
}finally{

      setSaving(false);
}
  }


  useEffect(()=>{
const getSettingsInfo = async()=>{

  try {

const response = await adminFetch("http://localhost:3000/admin/settings",navigate)

if (!response) return
const data = await response.json();
console.log(data);
setNotifications({
  emailNotification:data.settings.notification.emailNotification,
  newComment:data.settings.notification.newComment,
  newPost:data.settings.notification.newPost, 
  newLike:data.settings.notification.newLike,
  systemNotification:data.settings.notification.systemNotification
})

  } catch (error) {
    console.log(error);
    
  }

}

getSettingsInfo()


  },[])


  return (
    <Fragment>

       <section className="notification-settings">

      {/* Header */}

      <div className="notification-settings__header">

        <h2>{t("notificationAdmin")}</h2>

        <p>
         {t("notificationContentTextTwo")}
        </p>

      </div>


      <form
        className="notification-settings__form"
        onSubmit={saveNotification}
      >

        {/* Email Notifications */}

        <div className="notification-option">
          <div className="notification-option__content">
            <h3>{t("notificationsSettingsText.emailNotification")}</h3>
            <p>{t("notificationsSettingsText.emailNotificationparagraph")}</p>
</div>

          <label className="switch">

            <input
              type="checkbox"
              name="emailNotification"
              checked={notifications.emailNotification}
              onChange={handleChange}
            />

            <span className="slider"></span>

          </label>

        </div>


        {/* New Comments */}

        <div className="notification-option">
          <div className="notification-option__content">
            <h3>{t("notificationsSettingsText.newComment")}</h3>
            <p>{t("notificationsSettingsText.newCommentParagraph")}</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              name="newComment"
              checked={notifications.newComment}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>


        {/* New Posts */}

        <div className="notification-option">
          <div className="notification-option__content">
            <h3>{t("notificationsSettingsText.newPost")}</h3>
            <p>{t("notificationsSettingsText.newPostParagraph")}</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="newPost"
              checked={notifications.newPost}
              onChange={handleChange}
            />

            <span className="slider"></span>

          </label>

        </div>



        {/* New Posts */}

          <div className="notification-option">

          <div className="notification-option__content">

            <h3>{t("notificationsSettingsText.newLike")}</h3>

            <p>
              {t("notificationsSettingsText.newLikeParagraph")}
            </p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="newLike"
              checked={notifications.newLike}
              onChange={handleChange}
            />

            <span className="slider"></span>

          </label>

        </div>



        {/* System Notifications */}

        <div className="notification-option">

          <div className="notification-option__content">

            <h3>{t("notificationsSettingsText.systemNotification")}</h3>

            <p>
             {t("notificationsSettingsText.systemNotificationParagraph")}
            </p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="systemNotification"
              checked={notifications.systemNotification}
              onChange={handleChange}
            />

            <span className="slider"></span>

          </label>

        </div>


        {/* Messages */}

        {error && (
          <p className="notification-settings__error">
            {error}
          </p>
        )}

        {success && (
          <p className="notification-settings__success">
            {success}
          </p>
        )}


        {/* Save */}

        <button
          type="submit"
          className="notification-settings__save"
          disabled={saving}
        >
          {saving
            ? t("SavingProces")
            : t("saveChangeText")
          }
        </button>

      </form>

    </section>
    </Fragment>
  )
}

export default NotificationSettings