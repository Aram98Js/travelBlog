
import React, { Fragment, useEffect, useState } from 'react'
import "./TravelPage.scss"
import Button from '../../../Components/Button'
import type { TravelFormData,GetTravelData } from '../../Interfaces/interface'
import { Helmet } from 'react-helmet-async'


const TravelPage = () => {
  const [editId,setEditId] = useState<string|null>(null)
  const [travelData,setTravelData] = useState<GetTravelData[]>([])
  const [image,setImage] = useState<File|null>(null)
  const [searchInput,setSearchInput] = useState<string>("")
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

      const response = await fetch(
        "http://localhost:3000/admin/list_for_travel"
      );

      const data = await response.json();

      console.log(data);

      setTravelData(data.allTravel || []);

    } catch (error) {

      console.log(error);

    }

  };

  getTravelData();

}, []);



const addTravel = ()=>{

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



fetch("http://localhost:3000/admin/travel",{
  method:"POST",
  body:formData,
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
  const response = await fetch(`http://localhost:3000/admin/travel/${id}`,{
    method: "DELETE"
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
  if (editId) {
     await fetch(
            `http://localhost:3000/admin/travel/${editId}`,
            {
                method: "PATCH",
                body: formData
            }
        );
  }else{
    await fetch(
            `http://localhost:3000/admin/travel`,
            {
                method: "POST",
                body: formData
            }
        );
  }
}
const filtered = travelData.filter(item=>item.title.toLowerCase().includes(searchInput.toLowerCase()))
  return (

<Fragment>
 <Helmet>
<title>
Admin Page | Travel Post Creating
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
          <h1>Travel</h1>
          <p>Manage all Travel posts</p>
        </div>

       
      </div>


      <div className="travel-form">

        <h2>Create Travel Post</h2>

        <div className="form-grid">

          <div className="form-group full">
            <label>Title</label>
            <input type="text" 
            value={travelForm.title} 
            onChange={handleChange}  
            placeholder="Enter title" 
            name="title"/>
          </div>


          <div className="form-group full">
            <label>Short Description</label>
            <input type="text" 
            value={travelForm.short_description}
             onChange={handleChange}    
             placeholder="Enter Short description"
              name="short_description" />
          </div>

          <div className="form-group full">
            <label>Description</label>
          <input type="text" 
          value={travelForm.description} 
          onChange={handleChange} 
          placeholder="Enter Description" 
          name="description" />
          </div>

<div className="form-group full">
  <label>Country</label>
<input
  type="text"
   value={travelForm.location.country}
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
   value={travelForm.location.city}
   placeholder='Enter a city'
   onChange={handleChange}
/>
</div>
<div className="form-group full">
  <label>Rating</label>
<input

  type="number"
  name="rating"
  value={travelForm.rating}
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

        <Button onClick={editId?saveTravel:addTravel}  className="save-btn">
          Save Post
        </Button>

      </div>


      <div className="travel-list">

        <div className="list-header">
          <h2>Travel Posts</h2>

          <input
            type="text"
            value={searchInput}
            onChange={(evt:React.ChangeEvent<HTMLInputElement>)=>setSearchInput(evt.target.value)}
            placeholder="Search..."
          />
        </div>


        <div className="cards">
     {!filtered || filtered.length === 0?(
        <h2>Travel List Not Found</h2>
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