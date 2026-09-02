import { useEffect, useState } from "react";
import "./ProfileSettings.scss";
import { useNavigate } from "react-router-dom";
import adminFetch from "../../adminFetch";
import { useTranslation } from "react-i18next";

interface ProfileFormData {
  username: string;
  email: string;
}

const ProfileSettings = () => {

  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()
  const {t} = useTranslation()
  // GET ADMIN PROFILE
    useEffect(() => {
  const getAdminProfile = async () => {

    try {
      
      const response = await adminFetch("http://localhost:3000/admin/profile",navigate);

     

      if (!response)  return;
      
 const data = await response.json();
      setFormData({
        username: data.user.username,
        email: data.user.email
      });

    } catch (error) {

      console.log(error);
      setError("Something went wrong");

    } finally {
      setLoading(false);
    }
  };



    getAdminProfile();
  }, []);


  // INPUT CHANGE
  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    });

  };


  // PATCH PROFILE
  const saveChange = async (
    evt: React.FormEvent<HTMLFormElement>
  ) => {

    evt.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {

      const token = localStorage.getItem("data_token");

      const response = await fetch(
        "http://localhost:3002/admin/profile",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            username: formData.username,
            email: formData.email
          })
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setError(data.msg);
        return;
      }

      setFormData({
        username: data.user.username,
        email: data.user.email
      });

      setSuccess(data.msg);

    } catch (error) {

      console.log(error);
      setError("Something went wrong");

    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="profile-settings">
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <div className="profile-settings">

      <div className="profile-settings-header">

        <h2>{t("adminProfile")}</h2>

        <p>
          {t("profilePageParagraph")}
        </p>

      </div>


      <form
        className="profile-settings-form"
        onSubmit={saveChange}
      >

        {/* Username */}

        <div className="profile-input-group">

          <label htmlFor="username">
           {t("adminLoginTexts.adminLogin")}
          </label>

          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

        </div>


        {/* Email */}

        <div className="profile-input-group">

          <label htmlFor="email">
            {t("adminLoginTexts.adminEmail")}
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

        </div>


        {/* Error */}

        {error && (
          <p className="profile-error">
            {error}
          </p>
        )}


        {/* Success */}

        {success && (
          <p className="profile-success">
            {success}
          </p>
        )}


        {/* Save */}

        <button
          type="submit"
          className="profile-save-btn"
          disabled={saving}
        >
          {saving ? t("SavingProces") : t("saveChangeText")}
        </button>

      </form>

    </div>
  );
};

export default ProfileSettings;