import { Fragment, useState } from "react";
import "./AdminSettingsPage.scss";

import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import Button from "../../../Components/Button";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

type Tab = "profile" | "security" | "appearance" | "notifications";

const AdminSettingsPage = () => {
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (

<Fragment>
  <Helmet>

 <title>{t("adminTitle.titleAdminSettingPage")}</title>

  <meta
    name="description"
    content="Manage your admin panel settings, appearance, notifications, and account preferences."
  />

  <meta
    name="keywords"
    content="admin settings, admin panel, settings, account settings, preferences"
  />

  <meta
    name="robots"
    content="noindex, nofollow"
  />

  </Helmet>
 <div className="admin-settings">

      <div className="settings-header">
        <h1>{t("adminSettings")}</h1>
        <p>{t("adminSettingParagraph")}</p>
      </div>


      <div className="settings-tabs">

        <Button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
         {t("adminProfile")}
        </Button>

        <Button
          className={activeTab === "security" ? "active" : ""}
          onClick={() => setActiveTab("security")}
        >
         {t("adminSecurity")}
        </Button>

        <Button
          className={activeTab === "appearance" ? "active" : ""}
          onClick={() => setActiveTab("appearance")}
        >
      {t("adminAppearance")}
        </Button>

        <Button
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          {t("adminNotificationSetting")}
        </Button>

      </div>


      <div className="settings-content">

        {activeTab === "profile" && (
          <ProfileSettings />
        )}

        {activeTab === "security" && (
          <SecuritySettings />
        )}

        {activeTab === "appearance" && (
          <AppearanceSettings />
        )}

        {activeTab === "notifications" && (
          <NotificationSettings />
        )}

      </div>

    </div>
</Fragment>

   
  );
};

export default AdminSettingsPage;