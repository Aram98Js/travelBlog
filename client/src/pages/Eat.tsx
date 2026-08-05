import { Helmet } from "react-helmet-async"
import BannerComponent from "../Components/BannerComponent"
import GuideIntro from "../Components/GuideIntro"
import { useEffect, useState } from "react"
import type { GetFoodData } from "../admin/Interfaces/interface"
import GuideCards from "../Components/GuideCards"


const Eat = () => {
  const [foodPostData,setFoodPostData] = useState<GetFoodData[]>([])


  useEffect(()=>{
     const getDataFood = async ()=>{
      const response = await fetch("http://localhost:3000/postFood");
      const data = await response.json();
      setFoodPostData(data.allFoodPost);
      console.log(foodPostData);
      
     }
     getDataFood()
  },[])


  const isNewPost = (createdAt: string)=>{
const createdPost = new Date(createdAt);
const today = new Date();
const dif = today.getTime() - createdPost.getTime();
return dif <= 7 * 24 * 60 * 60 * 1000;
  }

  const MAX_LIKES_COUNT = 200;
  const MAX_VIEWS_COUNT = 200;
  return (
    <>
<Helmet>

<title>
Food Guide | Taste The World
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

    <BannerComponent

title="TASTE THE WORLD"
description="Find the best restaurants,
traditional dishes and local cuisine."
image="/FoodImg.jpg"
placeholder="Search destinations..."
/>


<GuideIntro 
title="Taste The World With Our Food Guide"

description="
Discover traditional dishes, famous restaurants
and local flavors from different countries.

Learn what to try, where to eat and which
culinary experiences you should not miss.
"

image="/FoodImg.jpg"
buttonText="Read Food Tips"

/>

{!foodPostData || foodPostData.length === 0?(
  <h2>Not Found</h2>
):(
  foodPostData.map((item)=>{
    const isNew = isNewPost(item.createdAt);
    const isPopular = item.likesCount >= MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
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

export default Eat