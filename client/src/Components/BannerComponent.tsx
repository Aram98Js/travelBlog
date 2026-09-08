
import "./bannerComponent.scss"
import { useTranslation } from 'react-i18next';
interface HeroBannerProps {
    title:string;
    description:string;
    image:string;
    placeholder:string;
    handleChange: (evt:React.ChangeEvent<HTMLInputElement>)=>void,
    search: string
}


const BannerComponent = ({search,handleChange,title,description,image,placeholder}:HeroBannerProps) => {
const {t} = useTranslation()
  return (
   <section data-aos="fade-up" data-aos-duration="1000"
className="hero-banner"
style={{
backgroundImage:`linear-gradient(
rgba(0,0,0,.45),
rgba(0,0,0,.45)
),url(${image})`
}}
>


<div className="hero-content">


<h1>{title}</h1>
<p>{description}</p>
<div className="search-box">
<input 
type="text"
placeholder={placeholder}
onChange={handleChange}
value={search}
/>

<button>
{t("travelGuidesTexts.searchButtonText")}
</button>
</div>
</div>
</section>

  )
}

export default BannerComponent