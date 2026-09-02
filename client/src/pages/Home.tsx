import "./Home.scss"
import travelImg from '/travelImg.jpg'
import relaxImg from '/relaxImg.jpg'
import foodImg from '/FoodImg.jpg'
import type { DashboardData, DataURL, Post, } from "../admin/Interfaces/interface"
import {  Link } from "react-router-dom"
import { Fragment, useEffect, useState } from "react"

import { useTranslation } from "react-i18next";

import PostCard from "../Components/PostCard"
import { Helmet } from "react-helmet-async"




const Home = () => {
  const {t} = useTranslation()
const [dashboardData,setDashboardData] = useState<DashboardData |null>(null)

  const allPosts:Post[] = [
   ...(dashboardData?.posts.travel || []).map(post=>({
          ...post,
      category:"Travel" as const
   })),
   ...(dashboardData?.posts.food || []).map(post=>({
          ...post,
      category:"Food" as const
   })),
   ...(dashboardData?.posts.relax || []).map(post=>({
          ...post,
      category:"Relax" as const
   })),
  ]
const UrlData:DataURL[] = [
  {
    id: 1,
    path: "/travel",
    imgUrl: travelImg,
    pathName: t("travel")
  },
  {
    id: 2,
    path: "/food",
    imgUrl: foodImg,
    pathName: t("food")
  },
  {
    id: 3,
    path: "/relax",
    imgUrl: relaxImg,
    pathName: t("relax")
  },
]
useEffect(()=>{
const getInfos = async()=>{
const response = await fetch("http://localhost:3000/admin/dashboard/posts");
const data = await response.json();
setDashboardData(data);
console.log(data);

}
getInfos();
},[])
const patchLikeCount = async (id: string,path:string)=>{
  const token =  localStorage.getItem("accessToken")
 const response = await fetch(`http://localhost:3000/admin/${path}/${id}/like`,{
    method:"PATCH",
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  const updatedPost = await response.json();

setDashboardData(prev=>{
  if (!prev) return prev;
  return {
    ...prev,
    posts: {
                      travel: prev.posts.travel.map(post =>
                    post._id === id ? updatedPost : post
                ),

                food: prev.posts.food.map(post =>
                    post._id === id ? updatedPost : post
                ),

                relax: prev.posts.relax.map(post =>
                    post._id === id ? updatedPost : post
                )

    }
  }
})
}




  return (
<Fragment>  
    <Helmet>
<title>
{t("pagesTitle.homePage")}
</title>


<meta
name="description"
content="
Home page for travel Blog web Site.
"
/>


<meta
property="og:title"
content="Home  Page"
/>
<meta
property="og:description"
content="
Home Page.
"
/>
<meta
property="og:type"
content="website"
/>
    </Helmet>
<section>
      <div className="Home_Container">
        <h1>{t("travelHeader")}</h1>
        <p>{t("travelParagraph")}</p>
      </div>

      <div className="secondContainer">
             <div className="serviceHeader">
              <h2>{t("ourServices")}</h2>
             </div>

             <div className="serviceBlock">
               {UrlData.map((item)=>{
                return(
                  <Link key={item.id} className="Services" to={item.path}>
                    <img src={item.imgUrl} alt="" />
                    <span>{item.pathName}</span>
                  </Link>
                )
               })}
             </div>
             
      </div>
<div className="postBlock">
{allPosts.map((item)=>{
  return(
    <PostCard 
    key={item._id} 
    post={item} 
    likeFunc={patchLikeCount}
    />
  )
    
})}

</div>
      
    </section>
</Fragment>

    
  )
}

export default Home