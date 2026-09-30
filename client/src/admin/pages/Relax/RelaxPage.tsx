import React, { Fragment, useEffect, useState } from 'react'

import Button from '../../../Components/Button'
import type { RelaxFormData,GetRelaxData } from '../../Interfaces/interface'
import './RelaxPage.scss'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Skeleton from '../../../Ui/Skelleton'
import adminFetch from '../../adminFetch'
import { useNavigate } from 'react-router-dom'
const RelaxPage = () => {
const [relaxData,setRelaxData] = useState<GetRelaxData[]>([])
const [image,setImage] = useState<File|null>(null)
const [editingId,setEditingId] = useState<string|null>(null)
const [searchInput,setSearchInput] = useState<string>("")
const [loading,setLoading] = useState<boolean>(true);
const navigate = useNavigate()
const handleChange = (
 e:React.ChangeEvent<HTMLInputElement>
)=>{

const {name,value}=e.target;


setRelaxForm(prev=>{

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
 if(name==="price"){

  return {
   ...prev,
   price:Number(value)
  }

 }

 return {
  ...prev,
  [name]:value
 }

})

}

    const handleImageChange = (
      evt: React.ChangeEvent<HTMLInputElement>
  )=>{
  
      if(evt.target.files){
  
          setImage(evt.target.files[0]);
  
      }
  
  }

const [relaxForm,setRelaxForm] = useState<RelaxFormData>({
    title:"",
    short_description:"",
    description:"",
    price:0,
        location:{
      city:"",
      country:""
    },
    rating:0.0
  })





  
  useEffect(()=>{
   const getRelaxData = async()=>{
try {

  const response = await adminFetch("http://localhost:3000/admin/relaxList",navigate)

if (!response) return

  const data = await response.json()
  console.log(data);
  setRelaxData(data.allRelax || [])
} catch (error) {
  console.log(error);
  
}finally{
setLoading(false)
}
   }

getRelaxData()
  },[])


  
  const addRelax = async ()=>{
    if (!relaxForm.title ||
      !relaxForm.short_description ||
      !relaxForm.description || 
      !relaxForm.location.country || 
      !relaxForm.location.city ||
       !relaxForm.rating) return
 const formData = new FormData();

   formData.append("title",relaxForm.title);
    formData.append("short_description",relaxForm.short_description);
    formData.append("description",relaxForm.description);
    formData.append("location",JSON.stringify(relaxForm.location))
formData.append("rating",relaxForm.rating.toString())
formData.append("price",relaxForm.price.toString())
  if (image) {
    formData.append("image",image)
  }


  try {
    const token = localStorage.getItem("data_token")
   const response = await fetch("http://localhost:3000/admin/relax",{
      method:"POST",
      body:formData,
         headers:{
    Authorization: `Bearer ${token}`
  }
    })
  
     if(!response.ok){
      const errorData = await response.text();
        console.error("Server Error:", errorData);
        return;
     }
     const data = await response.json();
     console.log("success",data);
     setRelaxData(prev=>[...prev,data.outputRelax])
  } catch (error) {
    console.error("Network or Parsing Error:", error);
  }


    

setRelaxForm({
  title:"",
  short_description:"",
  description:"",
  price:0,
      location:{
      city:"",
      country:""
    },
    rating:0.0
})
  }

  const deleteRelaxPost = async (id:string)=>{

    const token = localStorage.getItem("data_token")
    const response = await fetch(`http://localhost:3000/admin/relax/${id}`,{
    method:"DELETE",
headers:{
  Authorization: `Bearer ${token}`
}
   })
   const data = await response.json();
   console.log(data);
  }
  

  const editRelax = async (item: GetRelaxData)=>{
    setEditingId(item._id);
    setRelaxForm({
      title: item.title,
      short_description: item.short_description,
      description: item.description,
      price: item.price,
  location:{
          city: item.location.city,
          country: item.location.country
        },
        rating:item.rating
    })

  }

  const saveRelax = async ()=>{
const formData = new FormData();

   formData.append("title",relaxForm.title);
    formData.append("short_description",relaxForm.short_description);
    formData.append("description",relaxForm.description);
    formData.append("location",JSON.stringify(relaxForm.location))
formData.append("rating",relaxForm.rating.toString())
formData.append("price",relaxForm.price.toString())
  if (image) {
    formData.append("image",image)
  }
  if (editingId) {

    const token = localStorage.getItem("data_token")
     await fetch(
            `http://localhost:3000/admin/relax/${editingId}`,
            {
                method: "PATCH",
                body: formData,
                headers:{
                  Authorization: `Bearer ${token}`
                }
            }
        );
  }else{
    const token = localStorage.getItem("data_token")
    await fetch(`http://localhost:3000/admin/relax`,
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

  const fitered = relaxData.filter((item)=>item.title.toLowerCase().includes(searchInput.toLowerCase()))
const {t} = useTranslation()
  return (

    <Fragment>
 <Helmet>
<title>
{t("adminTitle.titleAdminRelax")}
</title>


<meta
name="description"
content="
Admin Panel Page For Creating Relax Post
"
/>
    </Helmet>
    <section className="relax">
   
         <div className="relax-header">
           <div>
             <h1>{t("adminTravelHeader")}</h1>
             <p>{t("adminTravelParagraph")}</p>
           </div>
   
          
         </div>
   
   
         <div className="relax-form">
   
           <h2>{t("create.relaxPost")}</h2>
   
           <div className="form-grid">
   
             <div className="form-group full">
               <label>{t("inputBox.title")}</label>
               <input type="text" value={relaxForm.title} onChange={handleChange} placeholder={t("inputBox.titlePlaceHolder")} name="title"/>
             </div>
   
   
             <div className="form-group full">
              <label>{t("inputBox.shortDescription")}</label>
               <input type="text"  value={relaxForm.short_description} onChange={handleChange} placeholder={t("inputBox.placeHolderShortDescription")} name="short_description" />
             </div>
   
             <div className="form-group full">
               <label>{t("inputBox.description")}</label>
             <input type="text"  
             value={relaxForm.description} 
             onChange={handleChange} 
             placeholder={t("inputBox.placeHolderdescription")} 
             name="description" />
             </div>
   
<div className="form-group full">
  <label>{t("inputBox.country")} </label>
<input
  type="text"
   value={relaxForm.location.country}
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
   value={relaxForm.location.city}
   placeholder={t("inputBox.placeHolderCity")}
   onChange={handleChange}
/>
</div>
<div className="form-group full">
  <label>{t("inputBox.price")}</label>
<input

  type="number"
  name="price"
  value={relaxForm.price}
  step="50"
  onChange={handleChange}
 
/>
</div>
<div className="form-group full">
  <label>{t("inputBox.rating")}</label>
<input

  type="number"
  name="rating"
  value={relaxForm.rating}
  step="0.1"
  onChange={handleChange}
 
/>
</div>

             <div className="form-group">
               <label>{t("inputBox.imgUpload")}</label>
               <input type="file" onChange={handleImageChange}/>
             </div>
   
           </div>
   
           <Button onClick={editingId ? saveRelax : addRelax} className="save-btn">
           {t("savePost")}
           </Button>
   
         </div>
   
   
         <div className="food-list">
   
           <div className="list-header">
             <h2>relax Posts</h2>
   
             <input
               type="text"
               value={searchInput}
               onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>setSearchInput(evt.target.value)}
               placeholder={t("postSearch")}
             />
           </div>
   
   
           <div className="cards">
   
             {loading?(
<>
<Skeleton />
<Skeleton />
<Skeleton />
</>
             ): !fitered || fitered.length === 0?(
                    <div className="empty-posts">
          <h2>{t("emptyPostHeader")}</h2>

          <p>
            {t("emptyPostParagraph")}
          </p>
        </div>
             ):(
fitered.map((item)=>{
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
  <span className="rating">
        💲 {item.price}
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
        onClick={() => editRelax(item)}
        className="EditBtn"
      >
        Edit
      </Button>

      <Button
        onClick={() => deleteRelaxPost(item._id)}
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

export default RelaxPage