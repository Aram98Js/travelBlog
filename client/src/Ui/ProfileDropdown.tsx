import{ useEffect, useState } from 'react'
import './ProfileDropdown.scss'
import Armenia from '../assets/changeLangFlag/Flag_of_Armenia_Flat_Round_Corner-64x64.png'
import Russia from '../assets/changeLangFlag/Flag_of_Russia_Flat_Round_Corner-64x64.png'
import USA from '../assets/changeLangFlag/Flag_of_United_States_Flat_Round_Corner-64x64.png'
import { Link} from 'react-router-dom'
import { useTranslation } from "react-i18next";
import {
  UserRound,
  ChevronRight,
  Settings,
  Bell,
  LogOut,
  Globe,

  ChevronLeft,
  Save
} from 'lucide-react'
import Button from '../Components/Button'
import { useNavigate } from 'react-router-dom'
interface ProfileData {
  changeLangFunc: (lang: string) => void
  logOutFunc: () => void,

  user_data: {
    _id:string
    username: string,
    email: string,
    image?:string
  }
}




const ProfileDropdown = ({user_data, logOutFunc, changeLangFunc }: ProfileData) => {

  
  const navigate = useNavigate()
  const [toggle, setToggle] = useState<boolean>(false)


 const getThemeByTime = ()=>{
    const hour = new Date().getHours();
    if (hour>=6 && hour < 18) {
      return "light"
    }else{
      return "dark"
    }
  }


  const [notifyData, setNotifyData] = useState<number>(0);
  const [saveNumber, setSaveNumber] = useState<number>(0);
  const [toggleTheme, setToggleTheme] = useState(() => {
    const saved =  localStorage.getItem("theme");
    if (saved) {
      return saved === "dark"
    }
    return  getThemeByTime() === "dark"
    
  })
  const { t } = useTranslation()

  const handleToggle = () => {
    setToggle(prev => !prev)
  }


useEffect(()=>{
document.body.className = toggleTheme ? "dark" : "light";
},[toggleTheme])
 



  const handleChangeTheme = () => {
    setToggleTheme(prev => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme
    });
  }

  const moveToNotificationPage = (url: string) => {
    navigate(url)
  }


  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:3002/notification/counter", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setNotifyData(data.notificationCounter)
    }
    getData();
  }, [])

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:3002/save_post/counter", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSaveNumber(data.saveCounter)

    }
    getData()
  }, [])

  return (
    <div className={`profile-dropdown ${toggle ? "active" : ""}`}>

      <Button onClick={handleToggle} className='toggleBtn'>{toggle ? <ChevronRight /> : <ChevronLeft />}</Button>

      <div className="profile-header">

        <img
          src={user_data.image || "/user.png"}
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

     
  <Link
    className="ProfileLink"
    to={`/profile/${user_data._id}`}
  >
    <span>
      {t("profileText")}
    </span>
  </Link>





        </div>



        <div className="menu-item">

          <Settings />

          <Link className='settingLink' to="/settings">
            {t("settingText")}
          </Link>



        </div>



        <div className="menu-item savingActions">

          <div className='linkAndIcon'>
            <Save />
            <Link className='saveLink' to="/saved">
               {t("save_posts")}
            </Link>
          </div>

          <p>
            {saveNumber}
          </p>



        </div>



        <div className="menu-item notification">
          <Bell />
          <Button onClick={() => moveToNotificationPage("notification")} className='notificationBtn'>
            {t("notificationText")}

          </Button>
          <div className='badge'>

            {notifyData}
          </div>
        </div>
        <div className="menu-item light_dark_theme">

          <Button className={`themeBtn ${toggleTheme ? "dark" : "light"}`} onClick={handleChangeTheme}>
            {toggleTheme ? t("themeText.light") : t("themeText.dark")}
          </Button>
        </div>


        <div className="menu-item Language">

          <Globe />


          <span>
            {t("languageText")}
          </span>


          <Button onClick={() => changeLangFunc("hy")} className='flags'><img src={Armenia} alt="" /></Button>
          <Button onClick={() => changeLangFunc("ru")} className='flags'><img src={Russia} alt="" /></Button>
          <Button onClick={() => changeLangFunc("en")} className='flags'><img src={USA} alt="" /></Button>


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