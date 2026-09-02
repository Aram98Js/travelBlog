import React, { Fragment, useState } from 'react'
import "./styles/AdminLogin.scss"
import logo from '../../assets/pngicons/putevye-zametki-logo.png'
import { useNavigate } from 'react-router-dom'
import { Eye,EyeClosed } from 'lucide-react'
import Button from '../../Components/Button'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
type AdminFormData = {
    username: string,
    password: string,
}



const AdminLogin = () => {
    const rememberUserName = localStorage.getItem("rememberUserName")
   const [showHidePass,setShowHidePass] = useState<boolean>(false);
   const [rememberMe,setRememberMe] = useState<boolean>(!!rememberUserName)
const {t} = useTranslation()
    const navigate = useNavigate()
const [adminFormData,setAdminFormData] = useState<AdminFormData>({
    username:rememberUserName || "",
    password:"",
})

const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
setAdminFormData({
    ...adminFormData,
    [evt.target.name]: evt.target.value
})
}
  
    
    const getAdminProfile = async (evt:React.FormEvent<HTMLFormElement>)=>{
evt.preventDefault()

try {
      const response =  await  fetch("http://localhost:3000/adminLogin", {
  method: "POST",
  body: JSON.stringify({
    username: adminFormData.username,
    password: adminFormData.password,
  }),
  headers: {
    "Content-Type": "application/json",

  }
}) 
const data = await response.json();
if (!response.ok) {
    navigate("/admin/login");
    return
}
   if (rememberMe) {
    localStorage.setItem("rememberUserName", adminFormData.username)
}else{
      localStorage.removeItem("rememberUserName")  
}
console.log(data);
     console.log("ADMIN LOGIN RESPONSE:", data);

     localStorage.setItem("data_token", data.token);
   navigate("/admin/dashboard");



} catch (error) {
    console.log(error);
    
}



}

  return (

    <Fragment >
        <Helmet>
            <title>{t("adminTitle.titleAdminLogin")}</title> 
            <meta name="description" content="Secure login page for the Travel Blog administration panel." /> 
            <meta name="robots" content="noindex, nofollow" />
             <meta name="author" content="Travel Blog" /> 
             <meta property="og:title" content="Admin Login | Travel Blog" />
              <meta property="og:description" content="Secure login page for the Travel Blog administration panel." /> 
            <meta property="og:type" content="website" />
        </Helmet>
<div className="admin-wrapper">

    <div className="admin-card">
        <div className="logo">
            <img src={logo} alt="" />
        </div>
        <h2>
         {t("adminLoginTexts.adminLoginHeader")}
        </h2>
        <p className="subtitle">
           {t("adminLoginTexts.adminLoginHeader")}
        </p>
        <form onSubmit={getAdminProfile}>
            <div className="input-group">
                <label>{t("adminLoginTexts.adminLogin")}</label>
                <input type="text" required onChange={handleChange} value={adminFormData.username} name="username" placeholder={t("adminLoginTexts.adminLoginPlaceHolder")}/>

            </div>
            <div className="input-group">
                <label>{t("adminLoginTexts.adminPassword")}</label>
                <div className="inputBox">
<input type={`${showHidePass?"text":"password"}`} required onChange={handleChange} value={adminFormData.password} name="password" placeholder={t("adminLoginTexts.adminPasswordPlaceHolder")}/>
                 <Button type='button' className='show_hide' onClick={()=>setShowHidePass(!showHidePass)}>{showHidePass?<Eye />:<EyeClosed />}</Button>
                </div>
                
            </div>
            <button type="submit">
               {t("adminLoginTexts.adminLoginBtn")}
            </button>
        </form>
        <div className="bottom-text">
       <label className="remember-me"> 
        <input type="checkbox" checked={rememberMe} onChange={(evt) => setRememberMe(evt.target.checked)} />
         <span className="custom-checkbox"></span> 
         <span className="remember-text"> {t("rememberLabel")} </span> 
         </label>
       </div>


    </div>


</div>

    </Fragment>


  )
}

export default AdminLogin