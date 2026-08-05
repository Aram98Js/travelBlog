import React, { useState } from 'react'
import "./styles/AdminLogin.scss"
import logo from '/putevye-zametki-logo.png'
import { useNavigate } from 'react-router-dom'

type AdminFormData = {
    username: string,
    password: string,
}



const AdminLogin = () => {

    const navigate = useNavigate()
const [adminFormData,setAdminFormData] = useState<AdminFormData>({
    username:"",
    password:"",
})

const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
setAdminFormData({
    ...adminFormData,
    [evt.target.name]: evt.target.value
})
}
  
    
    const getAdminProfile =(evt:React.FormEvent<HTMLFormElement>)=>{
evt.preventDefault()
        fetch("http://localhost:3000/adminLogin",{
            method:"POST",
            body:JSON.stringify({
                username: adminFormData.username,
                password: adminFormData.password,
            }),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((response)=>response.json())
        .then((data)=>{
           console.log(data);
           localStorage.setItem("data_token",data.token)
        })
      navigate("/admin/dashboard")
    }
    

  return (


<div className="auth-wrapper">

    <div className="auth-card">
        <div className="logo">
            <img src={logo} alt="" />
        </div>
        <h2>
            Admin Login
        </h2>
        <p className="subtitle">
            Welcome back! Login to manage your website
        </p>
        <form onSubmit={getAdminProfile}>
            <div className="input-group">
                <label>Admin Username</label>
                <input type="text" required onChange={handleChange} value={adminFormData.username} name="username" placeholder="your admin usernaame"/>

            </div>
            <div className="input-group">
                <label>Password</label>
                <input type="password" required onChange={handleChange} value={adminFormData.password} name="password" placeholder="Enter your password"/>

            </div>
            <button type="submit">
                Login
            </button>
        </form>
        <div className="bottom-text">
      
          

        </div>


    </div>


</div>

  )
}

export default AdminLogin