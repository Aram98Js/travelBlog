import React, { useEffect, useState } from "react";
import './Profile.scss'

interface DataForUser{
   username: string,
   email:string
}
const Profile = () => {
const [userData,setUserData] = useState<DataForUser | null>(null)
useEffect(()=>{

const getProfile = async()=>{
const token = localStorage.getItem("token");
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
setUserData(data.user)
}
getProfile();


},[]);


return (
 <div className="profile-page">

      <div className="profile-container">

        {/* Avatar Section */}
        <div className="profile-avatar-card">

          <img 
            
            alt="profile avatar"
            className="profile-avatar"
          />

          <button className="edit-btn">
            Edit Profile
          </button>

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
)

}

export default Profile;