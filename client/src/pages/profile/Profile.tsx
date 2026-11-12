import { useEffect, useState } from "react";
import './Profile.scss'
import Button from "../../Components/Button";
import { useNavigate, useParams, } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from 'react-i18next'
interface DataForUser{
   username: string,
   email:string
   image:string,
   country: string,
   city: string,
   birthDate?:{
    day?: number,
    month?: number,
    year?: number
   }
}

interface ProfileStats {
  savedPlaces: number,
  reviews: number,
  trips: number,
}
const calculateAge = (birthDate?: DataForUser["birthDate"]) => {
  if (!birthDate?.day || !birthDate?.month || !birthDate?.year) {
    return "Նշված չէ";
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.year;

  const hasNotHadBirthday =
    today.getMonth() + 1 < birthDate.month ||
    (today.getMonth() + 1 === birthDate.month &&
      today.getDate() < birthDate.day);

  if (hasNotHadBirthday) {
    age--;
  }

  return age;
};

const Profile = () => {
const [userData,setUserData] = useState<DataForUser | null>(null);
const [profileStats,setProfileStats] = useState<ProfileStats>({
  savedPlaces: 0,
  reviews: 0,
  trips: 0
})

  const { id } = useParams();

  console.log("PROFILE ID:", id);
const navigate = useNavigate();
const {t} = useTranslation()
useEffect(()=>{

const getProfile = async () => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
        "http://localhost:3000/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (response.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");

    const refreshResponse = await fetch(
        "http://localhost:3000/refreshToken",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken
            })
        }
    );
 const data = await refreshResponse.json();
console.log(data);
    }

    const data = await response.json();

    console.log(data);
    console.log("PROFILE USER:", data.user);

    setUserData(data.user);
};

getProfile();


},[]);

useEffect(()=>{


const getProfileStats = async()=>{
   try {
      const token = localStorage.getItem("accessToken")
const response = await fetch("http://localhost:3000/profile/stats",{
  headers:{
    Authorization: `Bearer ${token}`
  }
});
if (!response.ok) return;

const data =await response.json();
console.log(data);

setProfileStats(data)

  } catch (error) {
    console.log(error);
    
  }
 

}

  getProfileStats()




},[])

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
                  {t("EditProfile")}
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

<br />
<br />
<br />


          <div className="profile-details">


            <div>
              <span>
                {t("profilePageText.countryText")}
              </span>

              <strong>
                 {userData?.country} {userData?.city}
              </strong>
            </div>


            


            <div>
              <span>
               {t("profilePageText.memberSince")}
              </span>

              <strong>
                2026
              </strong>
            </div>



     <div>
              <span>
                 {t("profilePageText.age")}
              </span>

              <strong>
                 {calculateAge(userData?.birthDate)}
              </strong>
            </div>

<div>
              <span>
                 {t("profilePageText.dateOfBirth")}
              </span>

            <strong className="dateofBirth">
    {userData?.birthDate?.day &&
    userData?.birthDate?.month &&
    userData?.birthDate?.year
      ? `${String(userData.birthDate.day).padStart(2, "0")}.${String(userData.birthDate.month).padStart(2, "0")}.${userData.birthDate.year}`
      : "Նշված չէ"}
  </strong>
            </div>


      


          </div>


        </div>


      </div>



      {/* Stats */}

      <div className="travel-stats">


        <div className="stat-card">

          <h2>
            {profileStats.trips || t("emptyResult")}
          </h2>

          <p>
           {t("userProfileStats.trips")}
          </p>

        </div>



        <div className="stat-card">

          <h2>
            {profileStats.reviews || t("emptyResult")}
          </h2>

          <p>
            {t("userProfileStats.reviews")}
          </p>

        </div>



        <div className="stat-card">

          <h2>
            {profileStats.savedPlaces || t("emptyResult")}
          </h2>

          <p>
             {t("userProfileStats.savedPlace")}
          </p>

        </div>


      </div>


    </div>
</>


 
)

}

export default Profile;