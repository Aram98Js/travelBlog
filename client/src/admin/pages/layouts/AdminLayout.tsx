import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHedaer";
import "./AdminLayout.scss";
import { Fragment, useEffect, useState } from "react";
import type { Theme } from "../settings/AppearanceSettings";
import adminFetch from "../../adminFetch";
import { useNavigate } from "react-router-dom";
import AdminHamburgerButton from "../../Ui/AdminHamburgerButton";

const AdminLayout = () => {
const [theme,setTheme] = useState<Theme>("light");
const [openSideBar,setOPenSideBar] = useState<boolean>(false);

const navigate = useNavigate()
useEffect(()=>{
const getSettings = async()=>{
const response = await adminFetch("http://localhost:3000/admin/settings",navigate)
if (!response) return
  const data = await response.json();

  setTheme(data.settings?.appearance?.theme || "light");
}
getSettings()
},[])

useEffect(() => {

    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {

      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.classList.add(
        systemDark ? "dark" : "light"
      );

    } else {

      root.classList.add(theme);

    }

  }, [theme]);


const handleToggle = ()=>{
setOPenSideBar(prev=>!prev)
}
  return (
  
    <Fragment>
  <AdminHamburgerButton handleToggle={handleToggle} openSideBar={openSideBar}/> 

    <div className="admin-layout">
      
      <AdminSidebar openClassName={openSideBar?"active":""}/>
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
    </Fragment>


  );

};


export default AdminLayout;