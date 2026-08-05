
import logo from '/putevye-zametki-logo.png';
import './Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import socialData from '../socialData';
import { useEffect, useState } from 'react';

import ProfileDropdown from './ProfileDropdown';
import { useTranslation } from "react-i18next";
import GuestDropdown from './GuestDropdown';


type DataUser = {
  username: string;
  email: string
}

export type Links = {
  link: string;
  href: string
}
const Header = () => {
  const { t,i18n } = useTranslation();
  const navigate = useNavigate()
  const [userdata,setUserData] = useState<DataUser |null>(null);
  

const changeLang = (lang:string)=>{

  i18n.changeLanguage(lang);

  localStorage.setItem("lang",lang);

};

 const linkData: Links[] = [
    {
link: t("home"),
href: "/",
    },
    {
link:t("about"),
href: "/about"
    },
    {
link:t("travel"),
href: "/travel"
    },
    {
link:t("food"),
href: "/food"
    },
    {
link:t("relax"),
href: "/relax"
    },
  ]
 

  useEffect(()=>{
    const getData = async ()=>{

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
          setUserData(data.user)
        console.log(data);
    }
getData()

  },[])


  const logOut = ()=>{
      localStorage.removeItem("token");
    setUserData(null);
    navigate("/login");
  }

  const login = ()=>{
    navigate("/login")
  }



  return (
    <header>

  <div className="logo_block">
<img src={logo} alt="" />
      </div>

       <ol>
        {linkData.map((links,id)=>{
        return(

          <li key={id}> <Link to={links.href}>{links.link}</Link></li>
        )
        })}
       </ol>

    


      <div className="socialBlock">
        {socialData.map((item)=>{
          return(
            <Link to={item.href}>
               <img src={item.imgUrl} alt={item.link} />
               <span>{item.name}</span>
            </Link>
          )
        })}
      </div>





<div className="userBlock">
  
{userdata?(

 <>
<ProfileDropdown   user_data={userdata} logOutFunc = {logOut} changeLangFunc = {changeLang}/>
</>
):(
  <>
       <GuestDropdown  logInFunc = {login} changeLangFunc = {changeLang}/>
  </>

)}
</div>

    </header>
  )
}

export default Header