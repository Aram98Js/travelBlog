import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import "./saved.scss";
import { Helmet } from "react-helmet-async";
import Button from "../Components/Button";
interface SavedPost {
  _id: string;
  user: string;
  category: "Travel" | "Food" | "Relax";
  createdAt: string;
  updatedAt: string;
  post: {
    _id: string;
    title: string;
    description: string;
    image: string;
    location: {
      city: string;
      country: string;
    };
    rating: number;
    likesCount: number;
    viewsCount: number;
  };
}





const Saved = () => {


    const [savedData,setSavedData] = useState<SavedPost[]>([])
    const [postCounter,setCounter] = useState<number>(0);



  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:3000/save_post/counter", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCounter(data.saveCounter)

    }
    getData()
  }, [])


 const {t} = useTranslation();
    useEffect(()=>{
    const getSaveDatas = async () =>{
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:3000/save_post",{
            headers:{
                Authorization: `Bearer ${token} `
            }
        })
        const data = await response.json();
        setSavedData(data.posts)
    }
    getSaveDatas()
    },[])

    const deleteSavedPost = async(id:string)=>{
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:3000/delete_post/${id}`,{
           method:"DELETE",
           headers:{
            Authorization: `Bearer ${token}`
           }
      });
        const data = await response.json();
        console.log(data);
        
    }
  return (

<Fragment>

  <Helmet>
  <title>{t("pagesTitle.savedPage")}</title>

  <meta
    name="description"
    content="View your saved travel posts, favorite destinations, and memorable experiences on Travel Notes, an educational travel website."
  />

  <meta
    name="keywords"
    content="Travel Notes, saved posts, favorite destinations, saved travel posts, travel website"
  />

  <meta
    property="og:title"
    content="Saved Posts | Travel Notes"
  />

  <meta
    property="og:description"
    content="View your saved travel posts, favorite destinations, and memorable experiences on Travel Notes."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>
<section className="saved">
      <div className="saved__container">

        <div className="saved__header">
          <div>
            <h1>{t("save_posts")}</h1>
            <p>
             {t("postDesc")}
            </p>
          </div>

          <span className="saved__count">
            {postCounter} {t("savedText")}
          </span>
        </div>


        <div className="saved__content">

          {/* Saved post card */}

          {!savedData || savedData.length === 0?(
 <div className="saved-empty">

            <div className="saved-empty__icon">
              ♡
            </div>

            <h2>
              {t("savePostEmptyHeader")}
            </h2>

            <p>
             {t("savePostEmptyParagraph")}
            </p>

            

          </div>
          ):(
             savedData.map((item)=>{
                return(
<article className="saved-card">

           

            <div key={item._id} className="saved-card__body">
                <div className="saved-card_image">
                  <img src={item.post.image} alt="" />
                  </div>    
              <div className="saved-card__top">
                <span className="saved-card__category">
                  {item.category}
                </span>

                <span className="saved-card__date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2>
               {item.post.title}
              </h2>

              <p>
             {item.post.description}
              </p>

              <div className="saved-card__bottom">
               <div className="likesandViews">
                <span>❤️ {item.post.likesCount}</span>
                <span>👁 {item.post.viewsCount}</span>
               </div>
              

                <Button onClick={()=>deleteSavedPost(item._id)} className="saved-card__remove">
                  Remove
                </Button >

              </div>

            </div>

          </article>
                )
             })
          )}
          


  
         

        </div>

      </div>
    </section>
</Fragment>

    
  );
};

export default Saved;

