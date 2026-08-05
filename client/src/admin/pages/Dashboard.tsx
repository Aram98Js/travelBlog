import React, { useState,useEffect } from "react";
import type { DashboardActivity, DashboardData } from "../Interfaces/interface";
import "./Dashboard.scss";
import allTotals from '/total-posts.svg';
import travel from '/travel.svg';
import relax from '/relax.svg';
import food from '/food.svg';
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
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
const response = await fetch("http://localhost:3000/admin/dashboard/posts");

const data = await response.json();


setDashboardData(data);
setDashboardActivity(data.activity)
console.log(dashboardActivity);

}
getDashboardPost()
  },[])
if(!dashboardData){
    return <h2>Loading...</h2>
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
          Dashboard
        </h1>

        <p>
          Welcome back, Admin 👋
        </p>

    </div>



    {/* Statistics */}

   
      <div className="stats-grid">

    <div className="stat-card">
      <div className="stat-card-icon">
        <img src={allTotals} alt="" />
      </div>
        <h3>Total Posts</h3>
        <p>{dashboardData.totalPosts}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
 <img src={travel} alt="" />
      </div>
        <h3>Travel</h3>
        <p>{dashboardData.stats.travel}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
         <img src={food} alt="" />
      </div>
        <h3>Food</h3>
        <p>{dashboardData.stats.food}</p>
    </div>

    <div className="stat-card">
      <div className="stat-card-icon">
         <img src={relax} alt="" />
      </div>
        <h3>Relax</h3>
        <p>{dashboardData.stats.relax}</p>
    </div>

</div>
 
    <div className="dashboard-content">


      {/* Activity */}


      <div className="activity-box">


          <h2>
            Recent Activity
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
    ? `Created ${item.type} post`
     : item.action === "Deleted"
    ? `Deleted ${item.type} post`
    : `Updated ${item.type} post`
    
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
          Latest Posts
        </h2>



        <div className="table-wrapper">


        <table>


          <thead>

            <tr>

              <th>
                Image
              </th>

              <th>
                Title
              </th>

              <th>
                Category
              </th>

              <th>
                Date
              </th>
              <th>
                Status
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
        <span>{}</span>
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
