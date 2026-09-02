import { useEffect, useState } from "react";
import "./AdminHeader.scss";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import logOutIcon from "../../assets/pngicons/log-out.png"
import adminPanel from '../../assets/pngicons/admin-panel.png'
import { useTranslation } from "react-i18next";

type  AdminData = {
  username: string
}
const AdminHeader = () => {
  const {t} = useTranslation()
const[admin,setAdmin] = useState<AdminData | null>(null);
const navigate = useNavigate()
useEffect(()=>{
const getAdminInfo = async()=>{

  try {
     const token = localStorage.getItem("data_token");
      const response = await fetch("http://localhost:3000/admin/dashboard",{
         headers: {
            Authorization: `Bearer ${token}`,
          },
      });
    const data = await response.json();
    setAdmin(data.user)
  } catch (error) {
    console.log(error);
    
  }
}

getAdminInfo()
},[])

const logOut = ()=>{
  localStorage.removeItem("data_token");
  setAdmin(null);
  navigate("/admin/login")
}
  return (

    <header className="admin-header">
     
      <div className="profile">
        <img
          src={adminPanel}
          alt="admin"
        />
        <span>
                  {admin?.username.toUpperCase()}
        </span>
      </div>
      <Button className="Admin_log_Out_Btn" onClick={logOut}><img src={logOutIcon} alt="" /> {t("adminLogOut")}</Button>
    </header>
  );

};


export default AdminHeader;