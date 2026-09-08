import{ Fragment, useEffect, useState } from "react";
import "./adminNotification.scss";
import { useTranslation } from "react-i18next";
import adminFetch from "../adminFetch";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
type Notification = {
  _id: string;

  user: string;

  sender: {
    _id: string;
    username: string;
    image: string;
  };
  postType: "Food" | "Travel" | "Relax";
  type: "like" | "comment";
  message: string;

  isRead: boolean;

  createdAt: string;
};

const AdminNotification = () => {
  const {t} = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const limit = 10;

  useEffect(() => {
  const getNotifications = async () => {

    try {

      setLoading(true);
      setError("");



      const response = await adminFetch(`http://localhost:3000/admin/notification?page=${currentPage}&limit=${limit}`,navigate);

      

  

    
      if (!response) return
const data = await response.json();
      setNotifications(data.notification || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {

      setLoading(false);

    }

  };




    getNotifications();

  }, [currentPage]);


  if (loading) {
    return (
      <section className="admin-notification">
        <p>Loading...</p>
      </section>
    );
  }


  return (
    <Fragment>
<Helmet>
   <title>{t("adminTitle.titleAdminNotificationPage")}</title>

  <meta
    name="description"
    content="Manage notification preferences and control how you receive comments, posts, likes, and system notifications."
  />

  <meta
    name="keywords"
    content="notification settings, admin notifications, email notifications, comments, likes, posts"
  />

  <meta
    name="robots"
    content="noindex, nofollow"
  />
</Helmet>
  
    <section className="admin-notification">

      <div className="admin-notification__header">

        <div>

          <h1>{t("notificationAdmin")}</h1>

          <p>
           {t("notificationContentText")}
          </p>

        </div>

      </div>


      {error && (
        <p className="admin-notification__error">
          {error}
        </p>
      )}


      {!error && notifications.length === 0 && (

        <div className="admin-notification__empty">

          <h3>No notifications</h3>

          <p>
            You don't have any notifications yet.
          </p>

        </div>

      )}


      <div className="admin-notification__list">

        {notifications.map((notification) => (

          <div
            key={notification._id}
            className={`admin-notification__item ${
              !notification.isRead
                ? "admin-notification__item--unread"
                : ""
            }`}
          >

            <div className="admin-notification__icon">
              🔔
            </div>


            <div className="admin-notification__content">
               <h3>{notification.sender.username}</h3>
              <p className="admin-notification__message">

                {notification.message}
              </p>

              <span className="admin-notification__date">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </span>

            </div>


            {!notification.isRead && (
              <span className="admin-notification__badge">
                New
              </span>
            )}

          </div>

        ))}

      </div>


      {totalPages > 1 && (

        <div className="admin-notification__pagination">

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </button>


          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (

            <button
              type="button"
              key={page}
              className={
                currentPage === page
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentPage(page)
              }
            >
              {page}
            </button>

          ))}


          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>

        </div>

      )}

    </section>
      </Fragment>
  );
};

export default AdminNotification;