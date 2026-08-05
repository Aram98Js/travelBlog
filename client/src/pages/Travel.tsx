
import BannerComponent from '../Components/BannerComponent';

import GuideIntro from '../Components/GuideIntro'
import GuideCards from '../Components/GuideCards'
import { Helmet } from 'react-helmet-async';
import { useEffect,useState } from 'react';
import type {  GetTravelData } from '../admin/Interfaces/interface';

const Travel = () => {
const [travelsData,setTravelsData] = useState<GetTravelData[]>([])
useEffect(()=>{
  
const getDataTravel = async ()=>{
const response = await fetch("http://localhost:3000/postTravel");
const data = await response.json();
setTravelsData(data.allPostTravel)
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

  return (
   <>
<Helmet>

<title>
Travel Guides | Discover The World
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
<BannerComponent

title="Explore The World"
description="Discover breathtaking destinations and unforgettable adventures."
image="/travelImg.jpg"
placeholder="Search destinations..."

/>

<GuideIntro 
title="Explore The World With Our Travel Guide"

description="
Planning your next adventure?
Discover carefully selected destinations,
hidden places and unforgettable experiences.
From beautiful cities to breathtaking nature,
our guides will help you find the best places.
"

image="/travelImg.jpg"

buttonText="Read Travel Tips"

/>
<div className="cards-grid">

{travelsData.map((item)=>{
  
const isPopular = item.likesCount >= MAX_LIKES_COUNT && item.viewsCount >= MAX_VIEWS_COUNT
const isNew = isNewPost(item.createdAt)
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
  
})}







</div>
</>
  )
}

export default Travel