import './AboutUs.scss'
import { useTranslation } from 'react-i18next';


import {
    Globe,
    UtensilsCrossed,
    Trees,
    ShieldCheck,
    Users,
    HeartHandshake,
    BadgeCheck
} from "lucide-react";

import aboutUs from "/aboutUs.jpg"
import { Helmet } from 'react-helmet-async';
import { Fragment } from 'react/jsx-runtime';
const AboutUs = () => {
  const {t} = useTranslation()
  return (
    <Fragment>
<Helmet>
<title>
{t("pagesTitle.AboutUs")}
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
property="og:type"
content="website"
/>
    </Helmet>

<section data-aos="fade-up" data-aos-duration="1000" className="about">

            <div className="about-hero">
              <img src={aboutUs} alt="" />
                <div className="overlay">

                    <h1>{t("aboutUs")}</h1>

                    <p>
                        {t("MottoText")}
                    </p>

                </div>

            </div>


            <div className="container">

                <div className="about-content" data-aos="fade-up" data-aos-duration="1000">

                    <div className="about-content">

     <h2>
     {t("aboutUsObj.header")}
  </h2>


  <p>
 {t("aboutUsObj.paragraphOne")}
  </p>


  <p>
 {t("aboutUsObj.paragraphTwo")}
  </p>


  <p>
  {t("aboutUsObj.paragraphThree")}
  </p>


  <p>
  {t("aboutUsObj.paragraphFour")}
  </p>


  <p>
 {t("aboutUsObj.paragraphFive")}
  </p>


  <p>
   {t("aboutUsObj.paragraphSix")}
  </p>


  <div className="about-signature">

    <h3>
    {t("SignaturePart.SignatureHeader")}
    </h3>

    <p>
      {t("SignaturePart.SignatureParagraph")}
    </p>


    <strong>
     {t("SignaturePart.lastText")}
    </strong>

  </div>

</div>
                </div>


                <div className="services">

                    <div data-aos="fade-up" data-aos-duration="1000" className="card">

                        <Globe />

                        <h3>{t("travel")}</h3>

                        <p>
                           {t("Cards.card_one")}
                        </p>

                    </div>

                    <div data-aos="fade-up" data-aos-duration="2000" className="card">

                        <UtensilsCrossed />

                        <h3>{t("food")}</h3>

                        <p>
                            {t("Cards.card_two")}
                        </p>

                    </div>

                    <div data-aos="fade-up" data-aos-duration="3000" className="card">

                        <Trees />

                        <h3>{t("relax")}</h3>

                        <p>
                            {t("Cards.card_three")}
                        </p>

                    </div>

                </div>


                <div className="why-us">

                    <h2>{t("Why_choose_us")}</h2>

                    <div className="grid">

                        <div data-aos="fade-left" >
                            <ShieldCheck />
                            <span>{t("chooseObject.trust_info")}</span>
                        </div>

                        <div data-aos="fade-left">
                            <Users />
                            <span>{t("chooseObject.trust_info_two")}</span>
                        </div>

                        <div data-aos="fade-right">
                            <HeartHandshake />
                            <span>{t("chooseObject.trust_info_three")}</span>
                        </div>

                        <div data-aos="fade-right">
                            <BadgeCheck />
                            <span>{t("chooseObject.trust_info_four")}</span>
                        </div>

                    </div>

                </div>


                <div className="stats">

                    <div  data-aos="fade-up" data-aos-duration="1000">
                        <h2>10K+</h2>
                        <p>{t("results.happyVisitors")}</p>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="2000">
                        <h2>350+</h2>
                        <p>{t("results.destination")}</p>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="3000">
                        <h2>120+</h2>
                        <p>{t("results.restaurant")}</p>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="4000">
                        <h2>98%</h2>
                        <p>{t("results.positiveReviews")}</p>
                    </div>

                </div>


                <div className="footer-text" data-aos="fade-right" data-aos-duration="1000">

                    <h2>{t("thankYou.thankYouHeader")}</h2>

                    <p>
                      {t("thankYou.thankYouParagraph")}
                    </p>

                    <span>
                       {t("thankYou.thankYouTwo")}<br />
                       {t("thankYou.thankYouThree")}
                    </span>

                </div>

            </div>

        </section>        
    </Fragment>
    
   
  )
}

export default AboutUs