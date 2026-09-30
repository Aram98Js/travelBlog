
import { Link } from "react-router-dom";

import "./Footer.scss"
import type { Links } from "./Header";
import { useTranslation } from "react-i18next";
import socialData from "../socialData";
import { useState } from "react";
import emailjs from '@emailjs/browser'

interface EmailFormData{
  name:string,
  email: string,
  message: string,
}

const Footer = () => {
 
  const {t} = useTranslation();
  const [formData,setFormData] = useState<EmailFormData>({
    name:"",
    email:"",
    message:""
  })
  const sendEmail = (evt: React.FormEvent<HTMLFormElement>)=>{

    evt.preventDefault();
     emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      {
    name: formData.name,
    email: formData.email,
    message: formData.message
      },
      import.meta.env.VITE_EMAIL_PUBLIC_KEY,
     ).then((response)=>{
        console.log("SUCCESS", response.status, response.text);
      setFormData({
        name:"",
        email:"",
        message:""
      })
     }).catch((error)=>{
      console.log(error);
      
     })
  }
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
      link:t("privacy_policy"),
href: "/privacy_policy"
    }
  ]
  const categoryData:Links[] = [
  
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
  const handleChange = (evt:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    })
  }
  return (
    <footer className="footer" data-aos="fade-up" data-aos-duration="1000">

      <div className="footer-container">

        <div className="footer-brand">

          <div className="footerLogoBlock">
            
          </div>

          <p>
            {t("discoverText")}
          </p>

        </div>


        <div className="footer-column">

          <h3>{t("explore")}</h3>

           {linkData.map((item,index)=>{
            return(
              <Link key={index} to={item.href}>{item.link}</Link>
            )
           })}

        </div>



        <div className="footer-column">

          <h3>{t("category")}</h3>

           {categoryData.map((item,index)=>{
            return(
              <Link key={index} to={item.href}>{item.link}</Link>
            )
           })}

        </div>



        <div className="footer-column">
  <h3>{t("contact")}</h3>

  <form  onSubmit={sendEmail} className="footer-form">

    <input
      type="text"
      name="name"
      placeholder={t("yourName")}
        value={formData.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder={t("yourEmail")}
        value={formData.email}
       onChange={handleChange}
      required
    />

    <textarea
      name="message"
      placeholder={t("yourMessage")}
      rows={4}
      value={formData.message}
       onChange={handleChange}
      required
    ></textarea>

    <button type="submit">
      {t("sendMessage")}
    </button>

  </form>



        </div>


      </div>


      <div className="footer-social">

        <h3>{t("follow")}</h3>

        <div className="socialBlock">
        {socialData.map((item,index)=>{
          return(
            <Link key={index} to={item.href} className="footerLink">
               <img src={item.imgUrl} alt={item.link} />
            
            </Link>
          )
        })}
      </div>

      </div>



      <div className="footer-bottom">

        © {new Date().getFullYear()} {t("copyRightText")}.

      </div>


    </footer>
  )
}


export default Footer;


