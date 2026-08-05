import "./guideCards.scss";


interface GuideCardProps {

    image:string;

    title:string;
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
    image,
    title,
    description,
    city,
    country,
    rating,
    views,
    likes,
    isNew,
    isPopular

}:GuideCardProps)=>{


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
                    NEW
                </span>
            }


            {
                isPopular &&
                <span className="popular">
                    POPULAR
                </span>
            }


        </div>



        <button className="save-btn">
            ♡
        </button>


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