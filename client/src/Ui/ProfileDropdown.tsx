import React, { useState } from 'react'
import './ProfileDropdown.scss'
import Armenia from '/Flag_of_Armenia_Flat_Round_Corner-64x64.png'
import Russia from '/Flag_of_Russia_Flat_Round_Corner-64x64.png'
import USA from '/Flag_of_United_States_Flat_Round_Corner-64x64.png'
import { useTranslation } from "react-i18next";
import {
    UserRound,
    ChevronRight,
Settings,
Bell,
LogOut,
Globe,

ChevronLeft
} from 'lucide-react'
import Button from '../Components/Button'
import {Link} from 'react-router-dom'
interface ProfileData{
  changeLangFunc: (lang:string)=>void
  logOutFunc: ()=>void,

  user_data: {
    username: string,
    email: string
  }
}



const ProfileDropdown = ({user_data,logOutFunc,changeLangFunc}:ProfileData) => {
  const [toggle,setToggle] = useState<boolean>(false)

  const {t} = useTranslation()

  const handleToggle = ()=>{
    setToggle(!toggle)
  }
  return (
    <div className={`profile-dropdown ${toggle?"active":""}`}>

<Button onClick={handleToggle} className='toggleBtn'>{toggle?<ChevronRight />:<ChevronLeft />}</Button>

      <div className="profile-header">

        <img 
          src="/user.png" 
          alt="user"
          className="avatar"
        />

        <div className="user-info">

          <h3>
           {user_data.username}
          </h3>

          <span>
            {user_data.email}
          </span>

        </div>

      </div>



      <div className="profile-menu">


        <div className="menu-item active">

          <UserRound />
         
         <Link className='ProfileLink' to="/profile"><span>
           {t("profileText")}
          </span></Link>
          

          <ChevronRight />

        </div>



        <div className="menu-item">

          <Settings />

          <span>
           {t("settingText")}
          </span>

          <ChevronRight />

        </div>



        <div className="menu-item notification">


          <Bell />

          <span>
           {t("notificationText")}
          </span>


          <button>
            Allow
          </button>


        </div>
        <div className="menu-item Language">

<Globe />
   

          <span>
            {t("languageText")}
          </span>


          <Button onClick={()=>changeLangFunc("hy")} className='flags'><img src={Armenia} alt="" /></Button>
          <Button onClick={()=>changeLangFunc("ru")} className='flags'><img src={Russia} alt="" /></Button>
          <Button onClick={()=>changeLangFunc("en")} className='flags'><img src={USA} alt="" /></Button>


        </div>



        <div onClick={logOutFunc} className="menu-item logout">


          <LogOut />
             {t("logoutText")}
        </div>


      </div>


    </div>
  )
}

export default ProfileDropdown