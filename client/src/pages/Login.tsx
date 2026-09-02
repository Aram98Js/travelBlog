import React, { Fragment,  useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './UserLogin.scss'
import { Eye, EyeClosed } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Button from '../Components/Button'

type LoginFormData = {
    email: string,
    password: string
}

const Login = () => {
   const rememberedEmail = localStorage.getItem("rememberedEmail");
    const {t} = useTranslation()
    const navigate = useNavigate();
    const [rememberMe,setRememberMe] = useState<boolean>(!!rememberedEmail)
    const [passwordToggle,setPasswordToggle] = useState<boolean>(false)
    const [errors,setErrors] = useState<{
        email: string,
        password:string
    }>({
        email:"",
        password:""
    })
const [loginFormData,setLoginFormData] = useState<LoginFormData>({
    email: rememberedEmail || "",
    password: ""
})



const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
      setLoginFormData({
        ...loginFormData,
        [evt.target.name]: evt.target.value
    });
}

const handleLogin = async (evt:React.FormEvent<HTMLFormElement>)=> {
    evt.preventDefault()

    const newErrors = {
        email:"",
        password:""
    }
  if(!loginFormData.email ){
    newErrors.email = t("userLogin.emailRequired")
  }     

  if (!loginFormData.password) {
    newErrors.password = t("userLogin.passwordRequired")
  }

    if (newErrors.email || newErrors.password) {
        setErrors(newErrors);
        return;
    }
 
const response =  await fetch("http://localhost:3000/userLogin",{
method:"POST",
body: JSON.stringify({
    email: loginFormData.email,
    password: loginFormData.password,
}),
headers:{
    "Content-Type": "application/json"
}
})
const data =await response.json()
console.log("LOGIN ERROR DATA:", data);

if (!response.ok) {
    setErrors(prev=>({
        ...prev,
    [data.path]: t(`userLogin.${data.msg}`)
    }))
    return 
}

 if (rememberMe) {
  localStorage.setItem("rememberedEmail",loginFormData.email)
 }else{
  localStorage.removeItem("rememberedEmail")
 }

  console.log(data);    
localStorage.setItem("accessToken",data.accessToken);
localStorage.setItem("refreshToken",data.refreshToken);
console.log("LOGIN USER:", data.user);
localStorage.setItem("user",JSON.stringify(data.user));

window.dispatchEvent(new Event("userLogin"));
 navigate(`/profile/${data.user._id}`)

}



  return (

    <Fragment>
        <Helmet>
  <title>{t("pagesTitle.loginPage")}</title>

  <meta
    name="description"
    content="Log in to your Travel Notes account to explore destinations, access saved posts, manage your profile, and enjoy personalized travel experiences."
  />

  <meta
    name="keywords"
    content="Travel Notes, login, sign in, travel account, saved posts, travel website"
  />

  <meta
    property="og:title"
    content="Login | Travel Notes"
  />

  <meta
    property="og:description"
    content="Log in to your Travel Notes account to explore destinations, access saved posts, and manage your profile."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>


<div data-aos="fade-up" data-aos-duration="2000" className="auth-wrapper">

    <div className="auth-card">
        <div className="logo">
          
        </div>
        <h2>
           {t("userLoginHeader")}
           
        </h2>
        <p className="subtitle">
 
            {t("userLoginParagraph")}
            
        </p>
        <form onSubmit={handleLogin}>
            <div className="input-group">

                <label>
                    {t("username")}
                    </label>
                

                <input 
                type="text" 
                value={loginFormData.email}
                onChange={handleChange}
                placeholder={t("placeHolder.username")}
                name="email"
              className={errors.email ? "input-error" : ""}
               />
             {errors.email &&(
               <p className='error'>{errors.email}</p>
             )}
            </div>
            <div className="input-group">
                  
                  <label>
                         
                    {t("password")}
                    </label>
                    <div className="inputBox">
     <input 
                type={`${passwordToggle?"text":"password"}`} 
                onChange={handleChange}
                value={loginFormData.password}
                placeholder= {t("placeHolder.password")}
                name='password'
                className={errors.password ? "input-error" : ""}
                />
                <Button type='button' className='passwordTypeBtn'  onClick={()=>setPasswordToggle(!passwordToggle)}>{passwordToggle?<Eye />:<EyeClosed />}</Button >
                    </div>
           

 {errors.password &&(
               <p className='error'>{errors.password}</p>
             )}
            </div>
            <button type="submit">
                {t("loginButtonText")}
            </button>
        </form>
        <div className="bottom-text">
            {t("dontHaveAccountText")}
            <Link to="/register">
            {t("RegisterLink")}
            </Link>
         
        </div>
        <div className="rememberBlock">
<label >{t("rememberLabel")}</label> 
         <input type="checkBox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)}/>
        </div>
         

    </div>


</div>
    </Fragment>
    
  )
}

export default Login