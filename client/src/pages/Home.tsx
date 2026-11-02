import "./Home.scss"
import travelImg from '/travelImg.jpg'
import relaxImg from '/relaxImg.jpg'
import foodImg from '/FoodImg.jpg'
import type {DataURL, Post, } from "../admin/Interfaces/interface"
import {  Link } from "react-router-dom"
import { Fragment, useEffect, useState } from "react"

import { useTranslation } from "react-i18next";

import PostCard from "../Components/PostCard"
import { Helmet } from "react-helmet-async"
import Button from "../Components/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"




const Home = () => {
  const {t} = useTranslation()

const [page, setPage] = useState(1);
const [posts, setPosts] = useState<Post[]>([]);
const limit:number = 6

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

const patchLikeCount = async (id: string,path:string)=>{
  const token =  localStorage.getItem("accessToken")
 const response = await fetch(`http://localhost:3000/admin/${path}/${id}/like`,{
    method:"PATCH",
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  const updatedPost = await response.json();

  setPosts(prev =>
    prev.map(post =>
      post._id === id ? updatedPost : post
    )
  );
}

useEffect(()=>{

const pagination = async()=>{
const response = await fetch(`http://localhost:3000/pagination?page=${page}&limit=${limit}`);
const data = await response.json();
setPosts(data.paginationSlice);
console.log("page:", page);
console.log("posts length:", data.paginationSlice.length);
console.log("limit:", limit);
}


pagination()


},[page])


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
  <div className="paginationBlock">
  <Button className="paginationBtn" disabled={page===1} onClick={()=>setPage(page - 1 )}><ChevronLeft /></Button>
  <Button className="paginationBtn" disabled={posts.length<limit} onClick={()=>setPage(page + 1)}><ChevronRight /></Button>
</div>
{posts.map((item)=>{
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