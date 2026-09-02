import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AboutUs from "../pages/AboutUs";
import Eat from "../pages/Eat";
import Home from "../pages/Home";
import Relax from "../pages/Relax";
import Travel from "../pages/Travel";
import AdminSettingsPage from "../admin/pages/settings/AdminSettingsPage";

import Dashboard from "../admin/pages/Dashboard";
import AdminLayout from "../admin/pages/layouts/AdminLayout";

import AdminLogin from "../admin/pages/AdminLogin";
import Profile from "../pages/profile/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Food from "../admin/pages/Food/Food";
import RelaxPage from "../admin/pages/Relax/RelaxPage";
import TravelPage from "../admin/pages/TravelPage/TravelPage";
import Settings from "../pages/settingspage/Settings";
import SecurityPage from "../pages/settingspage/SecurityPage";
import ProfileSettings from "../pages/settingspage/ProfileSettings";
import Notifications from "../pages/settingspage/Notifications";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Saved from "../pages/Saved";
import Comments from "../admin/pages/Comments";
import AdminNotification from "../admin/pages/AdminNotification";



const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "about",
        element: <AboutUs />
      },
      {
        path: "travel",
        element: <Travel />
      },
      {
        path: "food",
        element: <Eat />
      },
      {
        path: "relax",
        element: <Relax />
      },
      {
        path:"profile/:id",
        element: <Profile/>
      },
       {
        path:"login",
        element: <Login/>
      },
       {
        path:"register",
        element: <Register/>
      },
      {
        path:"settings",
        element: <Settings />
      },
      {
        path:"security",
        element: <SecurityPage />
      },
      {
        path:"profile_change",
        element: <ProfileSettings />
      },
      {
        path:"notification",
        element: <Notifications />
      },
      {
        path:"privacy_policy",
        element: <PrivacyPolicy />
      },
      {
        path:"saved",
        element: <Saved />
      },
   
    ]
  },


  {
    path: "/admin/login",
    element: <AdminLogin />
  },


  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path:"dashboard",
        element: <Dashboard />
      },
      {
        path: "food",
        element: <Food />
      },
      {
        path: "relaxPage",
        element: <RelaxPage />
      },
      {
        path: "travelPage",
        element: <TravelPage />
      },
     
      {
        path: "settingsPage",
        element: <AdminSettingsPage />
      },
      {
        path:"comments",
        element: <Comments />
      },
      {
        path:"adminNotification",
        element:<AdminNotification />
      }
  
    ]
  }
]);

export default router