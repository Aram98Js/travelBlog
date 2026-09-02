import React, { useEffect, useState } from 'react'
import Header from '../Ui/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Ui/Footer'
import HamburgerButton from '../Ui/HamburgerButton'
import MobileMenu from '../Ui/MobileMenu'
import { useTranslation } from 'react-i18next'
import ProfileDropdown from '../Ui/ProfileDropdown'
import GuestDropdown from '../Ui/GuestDropdown'
import { useNavigate } from 'react-router-dom'
import ChatBot from '../Ui/ChatBot'




type DataUser = {
  _id: string
  username: string;
  email: string
  image?:string
}






const MainLayout = () => {
  const { i18n } = useTranslation();
  const [hamburgerToggle,setHamburgerToggle] = useState<boolean>(false)

 const [userdata,setUserData] = useState<DataUser |null>(()=>{
    const user  = localStorage.getItem("user");

return user ? JSON.parse(user) : null;
  });

const navigate = useNavigate()
const changeLang = (lang:string)=>{
  i18n.changeLanguage(lang);
  localStorage.setItem("lang",lang);
};




  useEffect(()=>{
const updateUser = ()=>{
const user = localStorage.getItem("user");
setUserData(
    user ? JSON.parse(user) : null
);
};


window.addEventListener(
"userLogin",
updateUser
);
console.log("HEADER USER:", userdata);
console.log("HEADER IMAGE:", userdata?.image);

return ()=>{
window.removeEventListener(
"userLogin",
updateUser
);
}

},[]);



  const logOut = ()=>{
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user")
    setUserData(null);
    navigate("/login",{replace:true});
  }

  const login = ()=>{
    navigate("/login")
  }


  const handleToggle = ()=>{
    setHamburgerToggle(prev => !prev)
  }
  return (
  <>
<ChatBot />
  {userdata?(

 <>
<ProfileDropdown   user_data={userdata} logOutFunc = {logOut} changeLangFunc = {changeLang}/>
</>
):(
  <>
       <GuestDropdown  logInFunc = {login} changeLangFunc = {changeLang}/>
  </>

)}
  <HamburgerButton toggleFunc={handleToggle} hamburgerToggle ={hamburgerToggle}/>
  <MobileMenu hamburgerToggle ={hamburgerToggle} />
     <Header />

      <Outlet />

      <Footer />
  </>
  )
}

export default MainLayout