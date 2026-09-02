import { ChevronLeft, ChevronRight, Globe, LogIn, UserPlus, UserRound } from 'lucide-react'
import  { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../Components/Button'
import Armenia from '../assets/changeLangFlag/Flag_of_Armenia_Flat_Round_Corner-64x64.png'
import Russia from '../assets/changeLangFlag/Flag_of_Russia_Flat_Round_Corner-64x64.png'
import USA from '../assets/changeLangFlag/Flag_of_United_States_Flat_Round_Corner-64x64.png'
import './GuestDropdown.scss'
import { Link } from 'react-router-dom'


interface PropsGuest{
    changeLangFunc: (lang:string)=>void
  logInFunc: ()=>void,

}
const GuestDropdown = ({logInFunc,changeLangFunc,}:PropsGuest) => {
    const [toggle,setToggle] = useState<boolean>(false)
    const {t} = useTranslation();
     const handleToggle = ()=>{
    setToggle(!toggle)
  }
  return (
    <>
<div className={`profileGuestContainer ${toggle?"active":""}`}>
    <Button onClick={handleToggle} className='toggleBtn'>{toggle?<ChevronRight />:<ChevronLeft />}</Button>
 <div className="profile-header">

    <div className="guest-avatar">
        <UserRound />
    </div>

    <div className="user-info">
        <h3>{t("guestHeader")}</h3>
        <span>{t("guestParagraph")}</span>
    </div>

</div>
<div className="profile-menu">

    <div onClick={logInFunc} className="menu-item">
        <LogIn />
{t("login")}
        <ChevronRight />
    </div>

    <div className="menu-item">
        <UserPlus />
            <Link className='Link' to="/register">
                {t("register")}
            </Link>
        <ChevronRight />
    </div>

    <div className="menu-item">
<Globe />
   

          <span>
            {t("languageText")}
          </span>
        <Button onClick={()=>changeLangFunc("hy")} className='flags'><img src={Armenia} alt="" /></Button>
          <Button onClick={()=>changeLangFunc("ru")} className='flags'><img src={Russia} alt="" /></Button>
          <Button onClick={()=>changeLangFunc("en")} className='flags'><img src={USA} alt="" /></Button>
        
    </div>

</div>
</div>
   

    </>
   
   
  )
}

export default GuestDropdown