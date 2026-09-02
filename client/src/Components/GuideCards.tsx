import { useTranslation } from "react-i18next";
import "./guideCards.scss";
import Button from "./Button";
import { useState } from "react";


interface GuideCardProps {
     id:string
    image:string;
    title:string;
    category:string
    description:string;
    city:string;
    country:string;
    rating:number;
    views:number;
    likes:number;
    isNew?:boolean;
    isPopular?:boolean;

}


const GuideCards = ({
    id,
    image,
    title,
    category,
    description,
    city,
    country,
    rating,
    views,
    likes,
    isNew,
    isPopular

}:GuideCardProps)=>{
const [isSave, setIsSave] = useState<boolean>(false);
const {t} = useTranslation();
const actionSaveData = async (category:string, id:string)=>{

const token = localStorage.getItem("accessToken")
const response = await fetch(`http://localhost:3000/save_post/${category}/${id}`,{
method:"POST",
headers:{
    Authorization: `Bearer ${token}`
}
});
const data = await response.json();

if (response.ok) {
    handleChangeSave(id)
}
console.log(data);

}

const handleChangeSave = (id: string)=>{
    setIsSave(true)
const savedPosts = JSON.parse(
  localStorage.getItem("savedPosts") || "[]"
);
if (!savedPosts.includes(id)) {
    savedPosts.push(id)
    localStorage.setItem("savedPosts",JSON.stringify(savedPosts))
}
}
return (
<div  className="guide-card">
    <div className="guide-card-image">
        <img 
            src={image}
            alt={title}
        />
        <div className="badges">
            {
                isNew &&
                <span className="new">
                    {t("travelGuidesTexts.new")}
                </span>
            }
            {
                isPopular &&
                <span className="popular">
                      {t("travelGuidesTexts.popular")}
                </span>
            }
        </div>
        <Button disabled={isSave} onClick={() =>actionSaveData(category,id)} className={`saved-btn ${isSave?"save":""}`}>
            {isSave?"Saved":"Save"}
        </Button>


    </div>
    <div className="guide-card-content">
        <div className="card-meta">
            <span>
                📍 {city},{country}
            </span>
            <span>
                ⭐ {rating}
            </span>
        </div>
        <h3>
            {title}
        </h3>
        <p>
            {description}
        </p>
        <div className="card-footer">
            <div className="stats">
                <span>
                    👁 {views}
                </span>
                <span>
                    ❤️ {likes}
                </span>

            </div>
            <button className="read-btn">
                Read Guide →
            </button>
        </div>
    </div>
</div>

)

}


export default GuideCards;