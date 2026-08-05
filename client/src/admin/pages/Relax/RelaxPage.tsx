import React, { Fragment, useEffect, useState } from 'react'

import Button from '../../../Components/Button'
import type { RelaxFormData,GetRelaxData } from '../../Interfaces/interface'
import './RelaxPage.scss'
import { Helmet } from 'react-helmet-async'
const RelaxPage = () => {
const [relaxData,setRelaxData] = useState<GetRelaxData[]>([])
const [image,setImage] = useState<File|null>(null)
const [editingId,setEditingId] = useState<string|null>(null)
const [searchInput,setSearchInput] = useState<string>("")

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
        location:{
      city:"",
      country:""
    },
    rating:0.0
  })





  
  useEffect(()=>{
   const getRelaxData = async()=>{
try {
  const response = await fetch("http://localhost:3000/admin/relaxList")
  const data = await response.json()
  console.log(data);
  setRelaxData(data.allRelax || [])
} catch (error) {
  console.log(error);
  
}
   }

getRelaxData()
  },[])


  
  const addRelax = ()=>{
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
  if (image) {
    formData.append("image",image)
  }


    fetch("http://localhost:3000/admin/relax",{
      method:"POST",
      body:formData,
    })
    .then((response)=>response.json())
    .then((data)=>{
      console.log(data.newRelax);
        setRelaxData([
    ...relaxData,
    data.outputRelax
  ]);
      
    }).catch((error)=>{
      console.log(error);
      
    });

setRelaxForm({
  title:"",
  short_description:"",
  description:"",
      location:{
      city:"",
      country:""
    },
    rating:0.0
})
  }

  const deleteRelaxPost = async (id:string)=>{
    const response = await fetch(`http://localhost:3000/admin/relax/${id}`,{
    method:"DELETE",

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
  if (image) {
    formData.append("image",image)
  }
  if (editingId) {
     await fetch(
            `http://localhost:3000/admin/relax/${editingId}`,
            {
                method: "PATCH",
                body: formData
            }
        );
  }else{
    await fetch(
            `http://localhost:3000/admin/relax`,
            {
                method: "POST",
                body: formData
            }
        );
  }
  }

  const fitered = relaxData.filter((item)=>item.title.toLowerCase().includes(searchInput.toLowerCase()))

  return (

    <Fragment>
 <Helmet>
<title>
Admin Page | Relax Post Creating
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
             <h1>Relax</h1>
             <p>Manage all Relax posts</p>
           </div>
   
          
         </div>
   
   
         <div className="relax-form">
   
           <h2>Create Relax Post</h2>
   
           <div className="form-grid">
   
             <div className="form-group full">
               <label>Title</label>
               <input type="text" value={relaxForm.title} onChange={handleChange} placeholder="Enter " name="title"/>
             </div>
   
   
             <div className="form-group full">
               <label>Short Description</label>
               <input type="text"  value={relaxForm.short_description} onChange={handleChange} placeholder="Enter  short_description" name="short_description" />
             </div>
   
             <div className="form-group full">
               <label>Description</label>
             <input type="text"  
             value={relaxForm.description} 
             onChange={handleChange} 
             placeholder="Enter Price" 
             name="description" />
             </div>
   
<div className="form-group full">
  <label>Country</label>
<input
  type="text"
   value={relaxForm.location.country}
   onChange={handleChange}
   placeholder='Enter a country'
   name="country"
/>
</div>
<div className="form-group full">
  <label>City</label>
<input
  type="text"
  name="city"
   value={relaxForm.location.city}
   placeholder='Enter a city'
   onChange={handleChange}
/>
</div>
<div className="form-group full">
  <label>Rating</label>
<input

  type="number"
  name="rating"
  value={relaxForm.rating}
  step="0.1"
  onChange={handleChange}
  placeholder='Enter a Rating'
/>
</div>


             <div className="form-group">
               <label>Upload Image</label>
               <input type="file" onChange={handleImageChange}/>
             </div>
   
           </div>
   
           <Button onClick={editingId ? saveRelax : addRelax} className="save-btn">
             Save Post
           </Button>
   
         </div>
   
   
         <div className="food-list">
   
           <div className="list-header">
             <h2>relax Posts</h2>
   
             <input
               type="text"
               value={searchInput}
               onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>setSearchInput(evt.target.value)}
               placeholder="Search..."
             />
           </div>
   
   
           <div className="cards">
   
             {!fitered || fitered.length === 0?(
                <h2>Relax List not Found</h2>
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