import { Helmet } from "react-helmet-async"
import BannerComponent from "../Components/BannerComponent"
import GuideIntro from "../Components/GuideIntro"
import { useEffect, useState } from "react"
import type { GetFoodData } from "../admin/Interfaces/interface"
import GuideCards from "../Components/GuideCards"
import { useTranslation } from "react-i18next"
import './food.scss'
import Skeleton from "../Ui/Skelleton"

const Eat = () => {
  const [foodPostData,setFoodPostData] = useState<GetFoodData[]>([])
  const [loading,setLoading] = useState<boolean>(true);
  const [search,setSearch] = useState<string>("")
const {t} = useTranslation()

  useEffect(()=>{


     const getDataFood = async ()=>{

          try {
       const response = await fetch("http://localhost:3000/postFood");
      const data = await response.json();
      setFoodPostData(data.allFoodPost);
      console.log(foodPostData);
    } catch (error) {
      console.log(error);
      
    }finally{
      setLoading(false)
    }
     
      
     }
     getDataFood()
  },[])

const filteredItems = foodPostData.filter((item)=>item.title.toLowerCase().includes(search.toLowerCase()))



const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
  setSearch(evt.target.value)
}

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
{t("pagesTitle.foodPage")}
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

title={t("foodGuidesTexts.foodGuideHeader")}
description={t("foodGuidesTexts.foodGuideParagraph")}
image="/FoodImg.jpg"
placeholder={t("foodGuidesTexts.SearchText")}
handleChange={handleChange}
search={search}
/>


<GuideIntro 
title={t("foodGuidesTexts.foodGuideHeaderTwo")}

description={t("foodGuidesTexts.foodGuideParagraphTwo")}

image="/FoodImg.jpg"
buttonText={t("foodGuidesTexts.buttonText")}

/>

<div className="cards_grid" data-aos="fade-up" data-aos-duration="1000">
{loading?(
  <>
  <Skeleton />
  <Skeleton />
  <Skeleton />
  <Skeleton />
  
  </>
):!filteredItems || filteredItems.length === 0?(
            <div className="empty-posts">
          <h2>{t("emptyPostHeader")}</h2>

          <p>
            {t("emptyPostParagraph")}
          </p>
        </div>
):(
  filteredItems.map((item)=>{
    const isNew = isNewPost(item.createdAt);
    const isPopular = item.likesCount >= MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
    return(
        <GuideCards
        id={item._id}
        key={item._id}
      image={item.image}
      category="Food"
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
</div>


    </>
  )
}

export default Eat