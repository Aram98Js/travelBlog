
import BannerComponent from '../Components/BannerComponent';
import './travel.scss'
import GuideIntro from '../Components/GuideIntro'
import GuideCards from '../Components/GuideCards'
import { Helmet } from 'react-helmet-async';
import { useEffect,useState } from 'react';
import type {  GetTravelData } from '../admin/Interfaces/interface';
import { useTranslation } from 'react-i18next';
import Skeleton from '../Ui/Skelleton';
const Travel = () => {
const {t} = useTranslation()
const [travelsData,setTravelsData] = useState<GetTravelData[]>([])
const [loading,setLoading] = useState<boolean>(true)
const[search,setSearch] = useState<string>("")



const filteredItems = travelsData.filter((item)=>item.title.toLowerCase().includes(search.toLowerCase()))



useEffect(()=>{
  
const getDataTravel = async ()=>{
  try {
    const response = await fetch("http://localhost:3000/postTravel");
    const data = await response.json();
    setTravelsData(data.allPostTravel)
  } catch (error) {
    console.log(error);
    
  }finally{
    setLoading(false)
  }



console.log(travelsData);

}
getDataTravel()
},[])


const MAX_LIKES_COUNT = 200
const MAX_VIEWS_COUNT = 200
  

const isNewPost = (createdAt:string) => {
  const createdDate = new Date(createdAt);
  const today = new Date();

  const diff = today.getTime() - createdDate.getTime();

  return diff <= 7 * 24 * 60 * 60 * 1000;
};

const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
setSearch(evt.target.value)
}


  return (

   <>
<Helmet>

<title>
{t("pagesTitle.travelPage")}
</title>


<meta
name="description"
content="
Explore amazing destinations, travel tips and unforgettable adventures.
"
/>


<meta
property="og:title"
content="Travel Guides | Discover The World"
/>


<meta
property="og:description"
content="
Find beautiful places and inspiring travel experiences.
"
/>


<meta
property="og:image"
content="/travel-banner.jpg"
/>


<meta
property="og:type"
content="website"
/>


</Helmet>
<BannerComponent data-aos="fade-up" data-aos-duration="1000"

title={t("travelGuidesTexts.travelGuideHeader")}
description={t("travelGuidesTexts.travelGuideParagraph")}
image="/travelImg.jpg"
placeholder={t("travelGuidesTexts.SearchText")}
handleChange = {handleChange}
search={search}
/>

<GuideIntro 
title={t("travelGuidesTexts.travelGuideHeaderTwo")}

description={t("travelGuidesTexts.travelGuideParagraphTwo")}

image="/travelImg.jpg"

buttonText={t("travelGuidesTexts.buttonText")}

/>
<div className="cards-grid" data-aos="fade-up" data-aos-duration="1000">

{loading?(
<>
<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />
</>
):



!filteredItems || filteredItems.length === 0?(
          <div className="empty-posts">
          <h2>{t("emptyPostHeader")}</h2>

          <p>
            {t("emptyPostParagraph")}
          </p>
        </div>
)
:
(
filteredItems.map((item)=>{
  
const isPopular = item.likesCount >= MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
const isNew = isNewPost(item.createdAt)
return(
  
  <GuideCards 
  id={item._id}
  key={item._id}
  category="Travel"
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







</div>
</>
  )
}

export default Travel