import React, { useState, } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type RegisterFormData = {
    username: string,
    email: string,
    password: string,
   
}

const Register = () => {
  const {t} = useTranslation()
    const navigate = useNavigate()
const [formData,setFormData] = useState<RegisterFormData>({
          username: "",
    email: "",
    password: "",

})
const handleSumbit = (evt:React.FormEvent<HTMLFormElement>)=>{
evt.preventDefault()
     fetch("http://localhost:3000/userRegister",{
        method:"POST",
        body:JSON.stringify({
           username: formData.username,
           email: formData.email,
           password: formData.password,
          
        }),
        headers:{
            "Content-Type": "application/json"
        }
    }).then((response)=>response.json())
    .then((data)=>{
      console.log(data);
    })
    navigate("/login") 
}

const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({
        ...formData,
        [evt.target.name]: evt.target.value
    });
}

  return (
     <div data-aos="fade-up" data-aos-duration="2000" className="auth-wrapper">
      <div className="auth-card">
        <div className="logo">
          
        </div>

        <h2>Create Account</h2>

        <p className="subtitle">Register new administrator</p>

        <form onSubmit={handleSumbit}>     
          <div className="input-group">
            <label>{t("username")}</label>

            <input type="text" value={formData.username} placeholder={t("placeHolder.usernameForRegister")} name='username' onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>{t("email")}</label>

            <input type="text" value={formData.email}placeholder={t("placeHolder.emailForRegister")} onChange={handleChange} name='email' />
          </div>

          <div className="input-group">
            <label>{t("password")}</label>
            <input type="password" value={formData.password} placeholder={t("placeHolder.passwordForRegister")} onChange={handleChange} name='password'/>
          </div>

         

          <button type="submit">{t("register")}</button>
        </form>

        <div className="bottom-text">
         {t("HaveAccountText")}
          <Link to="/login">{t("loginLink")}</Link>
        </div>
      </div>
    </div>
  )
}

export default Register