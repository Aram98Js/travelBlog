import { Fragment, useState } from "react";
import "./profileSettings.scss";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

type UserData = {
  username: string;
  email: string;
  image:string,
  birthDate: {
    day: number,
    month: number,
    year: number,
  }
};

const ProfileSettings = () => {
  const {t} = useTranslation( )
const [image,setImage] = useState<File|null>(null)
const [formData, setFormData] = useState<UserData>(() => {
  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : {};

  return {
    username: user.username ?? "",
    email: user.email ?? "",
    image: user.image ?? "",

    birthDate: {
      day: user.birthDate?.day ?? 0,
      month: user.birthDate?.month ?? 0,
      year: user.birthDate?.year ?? 0,
    }
  };
});

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      const dataForm = new FormData();
      dataForm.append("username",formData.username);
      dataForm.append("email",formData.email);
      dataForm.append("birthDate",JSON.stringify(formData.birthDate));
      if (image) {
        dataForm.append("image",image)
      }
      console.log("SENDING BIRTHDATE:", formData.birthDate);
      const response = await fetch("http://localhost:3000/profile",{
          method: "PATCH",
          headers: {
     
            Authorization: `Bearer ${token}`
          },
          body: dataForm
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg);
        return;
      }
console.log("UPDATED USER:", data);
console.log("UPDATED BIRTHDATE:", data.updatedUser?.birthDate);
      localStorage.setItem(
        "user",
        JSON.stringify(data.updatedUser)
      );

      window.dispatchEvent(
        new Event("userLogin")
      );

      alert("Profile updated successfully");

    } catch (error) {

      console.log(error);

    }
  };
const handleChange =(evt:React.ChangeEvent<HTMLInputElement>)=>{
  setFormData({
    ...formData,
    [evt.target.name]: evt.target.value
  })
}

const handleImageChange = (evt: React.ChangeEvent<HTMLInputElement>)=>{
if (evt.target.files) {
  setImage(evt.target.files[0]);
}
}
  return (

<Fragment>
  <Helmet>
  <title>
    {formData.username
      ? `${formData.username} | ${t("pagesTitle.profileChangePage")}`
      : t("pagesTitle.profileChangePage")}
  </title>

  <meta
    name="description"
    content="Manage your Travel Notes profile, update your username, email address, and profile picture."
  />

  <meta
    property="og:title"
    content={
      formData.username
        ? `${formData.username} | ${t("pagesTitle.profileChange")}`
        : t("pagesTitle.profileChange")
    }
  />

  <meta
    property="og:description"
    content="Manage your Travel Notes profile, update your username, email address, and profile picture."
  />
</Helmet>
<div className="profile-page_for_setting">

  <div className="profile-card">

    <div className="profile-card__header">

      <div className="avatar">
        {formData.username.charAt(0).toUpperCase()}
      </div>

      <div>
        <h1>Profile</h1>
        <p>
          Change your personal information
        </p>
      </div>

    </div>


    <form onSubmit={handleSubmit}>

      {/* Profile Image */}
      <div className="input-group profile-image-group">

        <label htmlFor="profile-image">
          Profile Image
        </label>

        <div className="profile-image-wrapper">

          <div className="profile-image">
            {/* Այստեղ հետո կդնես user-ի նկարը */}
            <img
              src={formData.image || "/avatar.png"}
              alt="Profile"
            />
          </div>

          <div className="profile-image-content">

            <label
              htmlFor="profile-image"
              className="change-image-button"
            >
              Change Image
            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
            />

            <span>
              JPG, JPEG or PNG
            </span>

          </div>

        </div>

      </div>


      {/* Username */}
      <div className="input-group">

        <label htmlFor="username">
          Username
        </label>

        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          name="username"
        />

      </div>


      {/* Email */}
      <div className="input-group">

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />

      </div>
<div className="birthDateGroup">
  <label>Ծննդյան ամսաթիվ</label>

  <div className="birthDateInputs">
    <input
      type="number"
      placeholder="Օր"
      min={1}
      max={31}
      value={formData.birthDate.day || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          birthDate: {
            ...prev.birthDate,
            day: Number(e.target.value)
          }
        }))
      }
    />

    <input
      type="number"
      placeholder="Ամիս"
      min={1}
      max={12}
      value={formData.birthDate.month || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          birthDate: {
            ...prev.birthDate,
            month: Number(e.target.value)
          }
        }))
      }
    />

    <input
      type="number"
      placeholder="Տարի"
      min={1900}
      max={new Date().getFullYear()}
      value={formData.birthDate.year || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          birthDate: {
            ...prev.birthDate,
            year: Number(e.target.value)
          }
        }))
      }
    />
  </div>
</div>

      <button
        className="save-button"
        type="submit"
      >
        Save Changes
      </button>

    </form>

  </div>

</div>
</Fragment>

    
  );
};

export default ProfileSettings;