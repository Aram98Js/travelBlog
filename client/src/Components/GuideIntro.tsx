import "./giudeIntro.scss";


interface GuideIntroProps {

    title:string;
    description:string;
    image:string;
    buttonText?:string;

}


const GuideIntro = ({
    title,
    description,
    image,
    buttonText="Explore More"

}:GuideIntroProps)=>{


return (

<section className="guide-intro">


<div className="guide-content">


<h2>
{title}
</h2>


<p>
{description}
</p>



<button>
{buttonText}
</button>


</div>




<div className="guide-image">


<img 
src={image}
alt="guide"
/>


</div>


</section>

)

}


export default GuideIntro;