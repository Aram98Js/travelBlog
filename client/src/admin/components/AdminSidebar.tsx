import "./AdminSideBar.scss";
import sideBarData from "./sideBarData";
import { NavLink } from "react-router-dom";
import logo from '../../../public/putevye-zametki-logo.png'

const AdminSidebar = () => {


  return (

    <aside className="admin-sidebar">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <nav>

        {
          sideBarData.map((item,index)=>(
            
            <NavLink
              key={index}
              to={item.link}
            >
              <img src={item.logo} alt="" />
              {item.pageName}

            </NavLink>

          ))
        }


      </nav>


    </aside>

  );

};


export default AdminSidebar;