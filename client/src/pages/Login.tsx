import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './UserLogin.scss'
type LoginFormData = {
    username: string,
    password: string
}

const Login = () => {
    const {t} = useTranslation()
    const navigate = useNavigate();
const [loginFormData,setLoginFormData] = useState<LoginFormData>({
    username: '',
    password: ""
})



const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
      setLoginFormData({
        ...loginFormData,
        [evt.target.name]: evt.target.value
    });
}

const handleLogin =(evt:React.FormEvent<HTMLFormElement>)=> {
  
 
    evt.preventDefault()
fetch("http://localhost:3000/userLogin",{
method:"POST",
body: JSON.stringify({
    username: loginFormData.username,
    password: loginFormData.password,
}),
headers:{
    "Content-Type": "application/json"
}
})
.then((resp)=>resp.json())
.then((data)=>{
    console.log(data);
    localStorage.setItem(
    "token",
    data.token
);
    
}).catch((error)=>{
    console.log(error);
    
})
navigate("/profile")
}
  return (
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
                value={loginFormData.username}
                onChange={handleChange}
                placeholder=    {t("placeHolder.username")}
                name="username"
               />

            </div>
            <div className="input-group">
                 
                  <label>
                    {t("password")}
                    </label>
                <input 
                type="password" 
                onChange={handleChange}
                value={loginFormData.password}
                placeholder= {t("placeHolder.password")}
                name='password'
                />

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


    </div>


</div>
  )
}

export default Login