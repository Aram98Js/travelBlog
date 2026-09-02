
import React, { Fragment, useEffect, useState } from 'react'
import "./TravelPage.scss"
import Button from '../../../Components/Button'
import type { TravelFormData,GetTravelData } from '../../Interfaces/interface'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Skeleton from '../../../Ui/Skelleton'
import adminFetch from '../../adminFetch'
import { useNavigate } from 'react-router-dom'


const TravelPage = () => {
  const {t} = useTranslation()
  const [editId,setEditId] = useState<string|null>(null)
  const [travelData,setTravelData] = useState<GetTravelData[]>([])
  const [image,setImage] = useState<File|null>(null)
  const [searchInput,setSearchInput] = useState<string>("")
  const [loading,setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [travelForm,setTravelForm] = useState<TravelFormData>({
    title:"",
    short_description:"",
    description:"",
    location:{
      city:"",
      country:""
    },
    rating:0.0
  })


  const handleImageChange = (
    evt: React.ChangeEvent<HTMLInputElement>
)=>{

    if(evt.target.files){

        setImage(evt.target.files[0]);

    }

}

  const handleChange = (
 e:React.ChangeEvent<HTMLInputElement>
)=>{

const {name,value}=e.target;


setTravelForm(prev=>{

 if(name==="city" || name==="country"){

  return {
   ...prev,
   location:{
    ...prev.location,
    [name]:value
   }
  }

 }


 if(name==="rating"){

  return {
   ...prev,
   rating:Number(value)
  }

 }


 return {
  ...prev,
  [name]:value
 }

})

}

useEffect(() => {

  const getTravelData = async () => {

    try {
      
      const response = await adminFetch("http://localhost:3002/admin/list_for_travel",navigate);
      if (!response) return 
      const data = await response.json();
      console.log(data);
      setTravelData(data.allTravel || []);

    } catch (error) {

      console.log(error);

    }finally{
      setLoading(false)
    }

  };

  getTravelData();

}, []);



const addTravel = async ()=>{

   if (!travelForm.title ||!travelForm.short_description || !travelForm.description || !travelForm.location.city ||!travelForm.location.country ||!travelForm.rating) return;
   const formData = new FormData();

   formData.append("title",travelForm.title);
    formData.append("short_description",travelForm.short_description);
    formData.append("description",travelForm.description);
    formData.append("location",JSON.stringify(travelForm.location))
formData.append("rating",travelForm.rating.toString())
    if(image){
    formData.append("image", image);
}

const token = localStorage.getItem("data_token")

 await fetch("http://localhost:3000/admin/travel",{
  method:"POST",
  body:formData,
  headers:{
    Authorization: `Bearer ${token}`
  }
})
.then((response)=>response.json())
.then((data)=>{
  console.log(data);
    setTravelData([
    ...travelData,
    data.travel,
    
  ]);
  
}).catch((error)=>{
  console.log(error);
  
});
setTravelForm({
 title:"",
 short_description:"",
 description:"",
 location:{
  city:"",
  country:""
 },
 rating:0.0
});
}



const deleteTravel = async (id:string) =>{
const token = localStorage.getItem("data_token")
  const response = await fetch(`http://localhost:3002/admin/travel/${id}`,{
    method: "DELETE",
      headers:{
    Authorization: `Bearer ${token}`
  }
  })
   const data = await response.json();
   console.log(data);
}

const editTravel = (item: GetTravelData)=>{
  setEditId(item._id);
  setTravelForm({
     title: item.title,
      short_description: item.short_description,
      description: item.description,
        location:{
          city: item.location.city,
          country: item.location.country
        },
        rating:item.rating
  })
}

const saveTravel = async ()=>{
  const formData = new FormData();

   formData.append("title",travelForm.title);
    formData.append("short_description",travelForm.short_description);
    formData.append("description",travelForm.description);
  if (image) {
    formData.append("image",image)
  }
  const token = localStorage.getItem("data_token")
  if (editId) {
     await fetch(
            `http://localhost:3002/admin/travel/${editId}`,
            {
                method: "PATCH",
                body: formData,
                   headers:{
    Authorization: `Bearer ${token}`
  }
            }
        );
  }else{
    await fetch(
            `http://localhost:3002/admin/travel`,
            {
                method: "POST",
                body: formData,
                   headers:{
    Authorization: `Bearer ${token}`
  }
            }
        );
  }
}
const filtered = travelData.filter(item=>item.title.toLowerCase().includes(searchInput.toLowerCase()))

  return (

<Fragment>
 <Helmet>
<title>
{t("adminTitle.titleAdminTravel")}
</title>


<meta
name="description"
content="
Admin Panel Page For Creating Travel Post
"
/>
    </Helmet>
<section className="travel">

      <div className="travel-header">
        <div>
          <h1>{t("adminTravelHeader")}</h1>
          <p>{t("adminTravelParagraph")}</p>
        </div>

       
      </div>


      <div className="travel-form">

        <h2>{t("create.travelPost")}</h2>

        <div className="form-grid">

          <div className="form-group full">
            <label>{t("inputBox.title")}</label>
            <input type="text" 
            value={travelForm.title} 
            onChange={handleChange}  
            placeholder={t("inputBox.titlePlaceHolder")} 
            name="title"/>
          </div>


          <div className="form-group full">
            <label>{t("inputBox.shortDescription")}</label>
            <input type="text" 
            value={travelForm.short_description}
             onChange={handleChange}    
             placeholder={t("inputBox.placeHolderShortDescription")} 
              name="short_description" />
          </div>

          <div className="form-group full">
            <label>{t("inputBox.description")}</label>
          <input type="text" 
          value={travelForm.description} 
          onChange={handleChange} 
          placeholder={t("inputBox.placeHolderdescription")} 
          name="description" />
          </div>

<div className="form-group full">
  <label>{t("inputBox.country")}</label>
<input
  type="text"
   value={travelForm.location.country}
   onChange={handleChange}
   placeholder={t("inputBox.placeHolderCountry")}
   name="country"
/>
</div>
<div className="form-group full">
  <label>{t("inputBox.city")}</label>
<input
  type="text"
  name="city"
   value={travelForm.location.city}
   placeholder={t("inputBox.placeHolderCity")}
   onChange={handleChange}
/>
</div>
<div className="form-group full">
  <label>{t("inputBox.rating")}</label>
<input

  type="number"
  name="rating"
  value={travelForm.rating}
  step="0.1"
  onChange={handleChange}
/>
</div>

          <div className="form-group">
            <label>{t("inputBox.imgUpload")}</label>
            <input type="file" onChange={handleImageChange}/>
          </div>

        </div>

        <Button onClick={editId?saveTravel:addTravel}  className="save-btn">
          {t("savePost")}
        </Button>

      </div>


      <div className="travel-list">

        <div className="list-header">
          <h2>Travel Posts</h2>

          <input
            type="text"
            value={searchInput}
            onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>setSearchInput(evt.target.value)}
            placeholder={t("postSearch")}
          />
        </div>


        <div className="cards">
     {loading? (
<>
<Skeleton />
<Skeleton />
<Skeleton />
<Skeleton />
</>
      ):!filtered || filtered.length === 0?(
               <div className="empty-posts">
          <h2>{t("emptyPostHeader")}</h2>

          <p>
            {t("emptyPostParagraph")}
          </p>
        </div>
      ):(
        filtered.map((item)=>{
          console.log(item);
          console.log(item.location);
          
        return(
 <div className="card">

  <img
    src={item.image}
    alt={item.title}
  />

  <div className="card-body">

    <div className="card-header">

      <h3>{item.title}</h3>

      <span className="rating">
        ⭐ {item.rating}
      </span>

    </div>

    <p className="short-description">
      {item.short_description}
    </p>

    <div className="location">

      📍 {item.location.city ?? "No City"}, {item.location.country??"No Country"}

    </div>

    <div className="stats">

      <span>❤️ {item.likesCount}</span>

      <span>👁 {item.viewsCount}</span>

    </div>

    <div className="actions">

      <Button
        onClick={() => editTravel(item)}
        className="EditBtn"
      >
        Edit
      </Button>

      <Button
        onClick={() => deleteTravel(item._id)}
        className="DeleteBtn"
      >
        Delete
      </Button>

      <Button
        onClick={() => alert()}
        className="ViewBtn"
      >
        View
      </Button>

    </div>

  </div>

</div>
        )
      })
      )}
              
            
    
          

        </div>

      </div>

    </section>
</Fragment>


  )
}

export default TravelPage