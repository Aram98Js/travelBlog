import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AboutUs from "../pages/AboutUs";
import Eat from "../pages/Eat";
import Home from "../pages/Home";
import Relax from "../pages/Relax";
import Travel from "../pages/Travel";
import Settings from "../admin/pages/Settings";

import Dashboard from "../admin/pages/Dashboard";
import AdminLayout from "../admin/pages/layouts/AdminLayout";

import AdminLogin from "../admin/pages/AdminLogin";
import Profile from "../pages/profile/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Food from "../admin/pages/Food/Food";
import RelaxPage from "../admin/pages/Relax/RelaxPage";
import TravelPage from "../admin/pages/TravelPage/TravelPage";



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
        path:"profile",
        element: <Profile/>
      },
       {
        path:"login",
        element: <Login/>
      },
       {
        path:"register",
        element: <Register/>
      }
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
        path: "settings",
        element: <Settings />
      },
  
    ]
  }
]);

export default router