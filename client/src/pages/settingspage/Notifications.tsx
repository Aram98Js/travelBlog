interface Notification{
    _id: string,
      message:string,
      isRead: boolean,
      createdAt:string,
       
}

import { Fragment, useEffect, useState } from 'react'
import "./notification.scss"
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
const Notifications = () => {
  const {t} = useTranslation()
const[notificationData,setNotificationData] = useState<Notification[]>([]);
useEffect(()=>{
const  getNotification = async ()=>{
    const token = localStorage.getItem("accessToken")
  const response = await fetch("http://localhost:3000/notifications",{
    headers:{
        Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json()
   
  setNotificationData(data.notifications)
}
getNotification()
},[])
  return (

    <Fragment>
   <Helmet>
  <title>{t("pagesTitle.notificationPage")}</title>

  <meta
    name="description"
    content="View your latest notifications, account updates, and important messages on Travel Notes."
  />

  <meta
    name="keywords"
    content="Travel Notes, notifications, travel website, user notifications, account updates"
  />

  <meta
    property="og:title"
    content="Notifications | Travel Notes"
  />

  <meta
    property="og:description"
    content="View your latest notifications, account updates, and important messages on Travel Notes."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>
<section className="notifications">

      <div className="notifications__header">

        <div>
          <h1>{t("notificationHeeader")}</h1>

          <p>
           {t("notificationP")}
          </p>
        </div>

        <span className="notifications__count">
          {notificationData.filter(
            (notification) => !notification.isRead
          ).length}
          {" "}{t("unRead")}
        </span>

      </div>


      <div className="notifications__list">

        {notificationData.length === 0 ? (

          <div className="notifications__empty">
            <span>🔔</span>

            <h3>No notifications</h3>

            <p>
              You don't have any notifications yet.
            </p>
          </div>

        ) : (

          notificationData.map((notification) => (

            <div
              key={notification._id}
              className={`notification ${
                notification.isRead
                  ? "notification--read"
                  : "notification--unread"
              }`}
            >

              <div className="notification__icon">
                {notification.isRead ? "✓" : "🔔"}
              </div>


              <div className="notification__content">

                <p className="notification__message">
                  { notification.message}
                </p>

                <span className="notification__date">
                  {new Date(
                    notification.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>


              {!notification.isRead && (
                <span className="notification__dot"></span>
              )}

            </div>

          ))

        )}

      </div>

    </section>

    </Fragment>
    
  )
}

export default Notifications