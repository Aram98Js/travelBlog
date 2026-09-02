import React, { useEffect, useState } from "react";
import './Profile.scss'
import Button from "../../Components/Button";
import { useNavigate, useParams, } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from 'react-i18next'
interface DataForUser{
   username: string,
   email:string
   image:string
}
const Profile = () => {
const [userData,setUserData] = useState<DataForUser | null>(null);

 
  const { id } = useParams();

  console.log("PROFILE ID:", id);
const navigate = useNavigate();
const {t} = useTranslation()
useEffect(()=>{

const getProfile = async()=>{
const token = localStorage.getItem("accessToken");
const response = await fetch(
    "http://localhost:3000/profile",
    {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
const data = await response.json();
console.log(data);
console.log("PROFILE USER:", data.user);
setUserData(data.user)
}
getProfile();


},[]);



return (

<>
<Helmet>
   <title>{userData?.username ? `${userData.username} | ${t("pagesTitle.profilePage")}` :t("pagesTitle.profilePage")}</title>

  <meta
    name="description"
    content="View and manage your Travel Notes profile, personal information, travel preferences, and saved experiences."
  />

  <meta
    name="keywords"
    content="Travel Notes, profile, travel profile, user profile, travel preferences"
  />

  <meta
    property="og:title"
    content="My Profile | Travel Notes"
  />

  <meta
    property="og:description"
    content="View and manage your Travel Notes profile and personal travel information."
  />

  <meta
    property="og:type"
    content="profile"
  />
</Helmet>
<div className="profile-page">

      <div className="profile-container">

        {/* Avatar Section */}
        <div className="profile-avatar-card">

          <img 
            src={userData?.image}
            alt="profile avatar"
            className="profile-avatar"
          />

          <Button onClick={()=>navigate("/profile_change")}  className="edit-btn">
            Edit Profile
          </Button>

        </div>


        {/* Information Section */}
        <div className="profile-info-card">

          <div className="profile-title">

            <h1>
              {userData?.username}
            </h1>

            <span>
                {userData?.email}
            </span>

          </div>


          <p className="bio">
            Passionate traveler exploring new places,
            cultures and unforgettable experiences.
          </p>


          <div className="profile-details">


            <div>
              <span>
                Country
              </span>

              <strong>
                Armenia
              </strong>
            </div>


            <div>
              <span>
                Language
              </span>

              <strong>
                English
              </strong>
            </div>


            <div>
              <span>
                Member Since
              </span>

              <strong>
                2026
              </strong>
            </div>


            <div>
              <span>
                Favorite Place
              </span>

              <strong>
                Italy
              </strong>
            </div>


          </div>


        </div>


      </div>



      {/* Stats */}

      <div className="travel-stats">


        <div className="stat-card">

          <h2>
            24
          </h2>

          <p>
            Trips
          </p>

        </div>



        <div className="stat-card">

          <h2>
            15
          </h2>

          <p>
            Reviews
          </p>

        </div>



        <div className="stat-card">

          <h2>
            8
          </h2>

          <p>
            Saved Places
          </p>

        </div>


      </div>


    </div>
</>


 
)

}

export default Profile;