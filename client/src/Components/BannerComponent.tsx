import "./bannerComponent.scss"
interface HeroBannerProps {
    title:string;
    description:string;
    image:string;
    placeholder:string;
}


const BannerComponent = ({title,description,image,placeholder}:HeroBannerProps) => {
  return (
   <section 
className="hero-banner"
style={{
backgroundImage:`linear-gradient(
rgba(0,0,0,.45),
rgba(0,0,0,.45)
),url(${image})`
}}
>


<div className="hero-content">


<h1>
{title}
</h1>


<p>
{description}
</p>



<div className="search-box">


<input 
type="text"
placeholder={placeholder}
/>


<button>
Search
</button>


</div>


</div>


</section>

  )
}

export default BannerComponent