import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHedaer";
import "./AdminLayout.scss";
import { useEffect, useState } from "react";
import type { Theme } from "../settings/AppearanceSettings";
import adminFetch from "../../adminFetch";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
const [theme,setTheme] = useState<Theme>("light");
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
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>

  );

};


export default AdminLayout;