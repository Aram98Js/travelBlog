

import './Header.scss';
import { Link} from 'react-router-dom';
import socialData from '../socialData';



import { useTranslation } from "react-i18next";

export type Links = {
  link: string;
  href: string
}
const Header = () => {
const {t} = useTranslation()

 const linkData: Links[] = [
    {
link: t("home"),
href: "/",
    },
    {
link:t("about"),
href: "/about"
    },
    {
link:t("travel"),
href: "/travel"
    },
    {
link:t("food"),
href: "/food"
    },
    {
link:t("relax"),
href: "/relax"
    },
  ]
 







  return (
    <header>

  <div className="logo_block">

      </div>

       <ol>
        {linkData.map((links,id)=>{
        return(

          <li key={id}> <Link to={links.href}>{links.link}</Link></li>
        )
        })}
       </ol>

    


      <div className="socialBlock">
        {socialData.map((item,index)=>{
          return(
            <Link key={index} to={item.href}>
               <img src={item.imgUrl} alt={item.link} />
               <span>{item.name}</span>
            </Link>
          )
        })}
      </div>






    </header>
  )
}

export default Header