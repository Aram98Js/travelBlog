import { Helmet } from "react-helmet-async"
import BannerComponent from "../Components/BannerComponent"
import GuideIntro from "../Components/GuideIntro"
import type { GetRelaxData } from "../admin/Interfaces/interface"
import { useEffect, useState } from "react"
import GuideCards from "../Components/GuideCards"



const Relax = () => {
const [relaxPostData,setRelaxPostData] = useState<GetRelaxData[]>([])
  const MAX_LIKES_COUNT: number = 200;
  const MAX_VIEWS_COUNT: number = 200;

  const isNewPost = (createdAt: string)=>{
    const createdPost = new Date(createdAt);
    const today = new Date();
     const dif = today.getTime() -  createdPost.getTime();
     return dif <= 7 * 24 * 60 * 60 * 1000
  }


useEffect(()=>{
const getDataRelax = async ()=>{
const response = await fetch("http://localhost:3000/postRelax");
const data = await response.json();
setRelaxPostData(data.allRelaxPost);
}
getDataRelax();
},[])


  return (
<>
<Helmet>



<title>
Relax Places | Find Your Escape
</title>


<meta
name="description"
content="
Explore peaceful destinations, resorts and relaxing experiences.
"
/>



</Helmet>
<BannerComponent

title="Relax The World"
description="Discover breathtaking destinations and unforgettable adventures."
image="/relaxImg.jpg"
placeholder="Search destinations..."

/>

<GuideIntro
title="Find Your Perfect Escape"

description="
Explore peaceful destinations, luxury resorts
and relaxing places where you can recharge.

From spa retreats to beautiful nature escapes,
find the perfect place to relax and enjoy life.
"

image="/relaxImg.jpg"

buttonText="Read Relax Tips"

/>

{!relaxPostData || relaxPostData.length === 0?(
<h2>Not Found</h2>
):(
relaxPostData.map((item)=>{
  const isNew = isNewPost(item.createdAt);
  const isPopular = item.likesCount>=MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
  return(
     <GuideCards 
  key={item._id}
image={item.image}

title={item.title}
description={item.description}
city={item.location.city}
country={item.location.country}
rating={item.rating}
views={item.viewsCount}
likes={item.likesCount}
isNew={isNew}
isPopular={isPopular}
  />
  )
})
)}

</>
  )
}

export default Relax