import { Helmet } from "react-helmet-async"
import BannerComponent from "../Components/BannerComponent"
import GuideIntro from "../Components/GuideIntro"
import type { GetRelaxData } from "../admin/Interfaces/interface"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import GuideCards from '../Components/GuideCards'
import "./relax.scss"
import Skeleton from "../Ui/Skelleton"
const Relax = () => {
const [relaxPostData,setRelaxPostData] = useState<GetRelaxData[]>([]);
const [loading,setLoading] = useState<boolean>(true)
const [search,setSearch] = useState<string>("")
const {t} = useTranslation()
  const MAX_LIKES_COUNT: number = 200;
  const MAX_VIEWS_COUNT: number = 200;

  const isNewPost = (createdAt: string)=>{
    const createdPost = new Date(createdAt);
    const today = new Date();
     const dif = today.getTime() -  createdPost.getTime();
     return dif <= 7 * 24 * 60 * 60 * 1000
  }

  const filteredItems = relaxPostData.filter((item)=>item.title.toLowerCase().includes(search.toLowerCase()))



const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
  setSearch(evt.target.value)
}

useEffect(()=>{


const getDataRelax = async ()=>{

  try {
    const response = await fetch("http://localhost:3000/postRelax");
    const data = await response.json();
    setRelaxPostData(data.allRelaxPost);
  } catch (error) {
    console.log(error);
    
  }finally{
setLoading(false)
  }

}
getDataRelax();
},[])


  return (
<>
<Helmet>



<title>
{t("pagesTitle.relaxPage")}
</title>


<meta
name="description"
content="
Explore peaceful destinations, resorts and relaxing experiences.
"
/>



</Helmet>
<BannerComponent

title={t("relaxGuidesTexts.relaxGuideHeader")}
description={t("relaxGuidesTexts.relaxGuideParagraph")}
image="/relaxImg.jpg"
placeholder={t("relaxGuidesTexts.SearchText")}
handleChange={handleChange}
search={search}
/>

<GuideIntro
title={t("relaxGuidesTexts.relaxGuideHeaderTwo")}

description={t("relaxGuidesTexts.relaxGuideParagraphTwo")}

image="/relaxImg.jpg"

buttonText={t("relaxGuidesTexts.buttonText")}

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
  const isPopular = item.likesCount>=MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
  return(

     <GuideCards 
     id={item._id}
  key={item._id}
image={item.image}
category="Relax"
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

export default Relax