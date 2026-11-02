import "./giudeIntro.scss";


interface GuideIntroProps {

    title:string;
    description:string;
    image:string;
    buttonText?:string;
    openAiModal: ()=>void
}


const GuideIntro = ({
    title,
    description,
    image,
    buttonText="Explore More",
    openAiModal

}:GuideIntroProps)=>{


return (

<section className="guide-intro" data-aos="fade-up" data-aos-duration="1000">


<div className="guide-content">


<h2>
{title}
</h2>


<p>
{description}
</p>



<button onClick={openAiModal}>
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