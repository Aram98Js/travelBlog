import { useState,useEffect } from "react";
import type { DashboardActivity, DashboardData } from "../Interfaces/interface";
import "./Dashboard.scss";
import allTotals from '../../assets/icon/total-posts.svg';
import travel from '../../assets/icon/travel.svg';
import relax from '../../assets/icon/relax.svg';
import food from '../../assets/icon/food.svg';
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import adminFetch from "../adminFetch";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [dashboardData,setDashboardData] = useState<DashboardData |null>(null)
  const [dashboardActivity,setDashboardActivity] = useState<DashboardActivity[]>([])
  const allPosts = [
    ...(dashboardData?.posts.travel || []).map(post=>({
      ...post,
      category:"Travel"
    })),
    ...(dashboardData?.posts.food || []).map(post=>({
      ...post,
      category:"Food",
    })),
    ...(dashboardData?.posts.relax || []).map(post=>({
      ...post,
      category:"Relax",
    })),
  ]
  useEffect(()=>{
const getDashboardPost = async()=>{


const response = await adminFetch("http://localhost:3000/admin/dashboard/posts",navigate);




if (!response) return 
const data = await response.json();
setDashboardData(data);
setDashboardActivity(data.activity)
console.log(dashboardActivity);
}
getDashboardPost()
  },[])
if(!dashboardData){
    return <h1>{t("loading")}</h1>
}


  return (
    <>

    <Helmet>
      <title>
Admin Panel Dashboard
</title>


<meta
name="description"
content="
Discover traditional dishes, restaurants and local flavors.
"
/>


<meta
property="og:image"
content="/food-banner.jpg"
/>
    </Helmet>
<div className="dashboard">


    <div className="dashboard-title">

        <h1>
       {t("dashboard")}
        </h1>

        <p>
          {t("welcome")} {}👋
        </p>

    </div>



    {/* Statistics */}

   
      <div className="stats-grid">

    <div className="stat-card">
      <div className="stat-card-icon">
        <img src={allTotals} alt="" />
      </div>
        <h3>{t("Total")}</h3>
        <p>{dashboardData.totalPosts}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
 <img src={travel} alt="" />
      </div>
        <h3>{t("adminTravel")}</h3>
        <p>{dashboardData.stats.travel}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
         <img src={food} alt="" />
      </div>
        <h3>{t("adminFood")}</h3>
        <p>{dashboardData.stats.food}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
         <img src={relax} alt="" />
      </div>
        <h3>{t("adminRelax")}</h3>
        <p>{dashboardData.stats.relax}</p>
    </div>

</div>
 
    <div className="dashboard-content">


      {/* Activity */}


      <div className="activity-box">


          <h2>
            {t("recent")}
          </h2>


          <div className="timeline">
        {dashboardActivity.map((item) => {
             console.log(item.createdAt);
    return (
        <div
            key={item._id}
            className="activity-item"
        >

            <div className="dot"></div>

            <div>

                <h4 style={item.action && item.action === "Created"?{color:"green"}:item.action==="Deleted"?{color:"red"}:{color:"rgb(195, 195, 54)"}}>
                   {
                     item.action === "Created"
    ? ` ${t("messages.create")} ${item.type}`
     : item.action === "Deleted"
    ? `${t("messages.delete")} ${item.type}`
    : `${t("messages.update")} ${item.type}`
    
                   }
                </h4>

                <p>
                    {item.title}
                </p>

                <small>
                    {item.createdAt 
 ? new Date(item.createdAt).toLocaleDateString()
 : "No date"}
                </small>

            </div>

        </div>
    );
})}
          


          </div>


      </div>




      {/* Posts */}


      <div className="posts-box">


        <h2>
          {t("latest")}
        </h2>



        <div className="table-wrapper">


        <table>


          <thead>

            <tr>

              <th>
                {t("table.image")}
              </th>

              <th>
                 {t("table.title")}
              </th>

              <th>
                {t("table.category")}
              </th>

              <th>
                 {t("table.date")}
              </th>
              <th>
                 {t("table.rating")}
              </th>
            </tr>

          </thead>



          <tbody>  
         
         
          {allPosts.map((item)=>{
            return(
              <tr key={item._id}>

    <td>
        <img 
            src={item.image}
            alt={item.title}
            width="80"
        />
    </td>


    <td>
        {item.title}
    </td>


    <td>
        {item.category}
    </td>


    <td>
        {
        new Date(item.createdAt)
        .toLocaleDateString()
        }
    </td>
     <td>
        {
        <span>{item.rating}</span>
        }
    </td>
</tr>

            )
          })}

          </tbody>


        </table>


        </div>



      </div>




    </div>



</div>







    </>
  );
};

export default Dashboard;
