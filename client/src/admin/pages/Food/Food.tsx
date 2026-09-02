import { Fragment, useEffect, useState } from "react";
import Button from "../../../Components/Button";
import "./Food.scss";
// import { useNavigate } from "react-router-dom";
import type {FoodFormData,GetFoodData } from "../../Interfaces/interface";
import PostModal from "../../components/PostModal";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Skeleton from "../../../Ui/Skelleton";
import adminFetch from "../../adminFetch";
import { useNavigate } from "react-router-dom";


const Food = () => {
  const {t} = useTranslation()
  const [loading,setLoading] = useState<boolean>(true)
  const [image,setImage] = useState<File|null>(null)
  const [searchInput,setSearchInput] = useState<string>("")
  const [editingId,setEditingId] = useState<string|null>(null)
  const [foodModalData,setFoodModalData] = useState<GetFoodData | null>(null)
  const [modalFood,setModalFood] = useState<boolean>(false)
  const navigate = useNavigate()
  const [foodForm,setFoodForm] = useState<FoodFormData>({
    title:"",
    short_description:"",
    description:"",
       location:{
      city:"",
      country:""
    },
    rating:0.0
  })
  const [foodData,setFoodData] = useState<GetFoodData[]>([])



const openModal = (food:GetFoodData)=>{
  setFoodModalData(food);
  setModalFood(true)
}
const closeModal = ()=>{
  setFoodModalData(null);
  setModalFood(false);
}


const handleChange = (
 e:React.ChangeEvent<HTMLInputElement>
)=>{

const {name,value}=e.target;


setFoodForm(prev=>{

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




useEffect(()=>{
const getFoodData = async ()=>{

  try {
    
    const response = await adminFetch("http://localhost:3002/admin/foodList",navigate)
    if (!response ) return
    const data = await response.json();
    setFoodData(data.allFoods || [])
      console.log(data);
  console.log(data.allFoods);
  } catch (error) {
    console.log(error);
    
  }finally{
setLoading(false)
  }
}


getFoodData()
},[])




  const addFood = async()=>{

if (
    !foodForm.title ||
    !foodForm.short_description ||
    !foodForm.description|| 
    !foodForm.location.country || 
    !foodForm.location.city || 
    !foodForm.rating
){
    return;
}


const formData = new FormData();
formData.append("title",foodForm.title);
formData.append("short_description",foodForm.short_description);
formData.append("description",foodForm.description);
formData.append("location",JSON.stringify(foodForm.location))
formData.append("rating",foodForm.rating.toString())
if(image){
    formData.append(
        "image",
        image
    );
}
try {
  const token = localStorage.getItem("data_token")
const response = await fetch("http://localhost:3002/admin/food",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`
        },
        body:formData
    }
);
const data = await response.json();
console.log(data);
}catch(error){
console.log(error);
}
setFoodForm({
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

     const handleImageChange = (
        evt: React.ChangeEvent<HTMLInputElement>
    )=>{
    
        if(evt.target.files){
    
            setImage(evt.target.files[0]);
    
        }
    
    }
const deleteFood = async (id:string)=>{
  const token = localStorage.getItem("data_token")
   const response = await fetch(`http://localhost:3000/admin/food/${id}`,{
    method:"DELETE",
headers:{
  authorization: `Bearer ${token}`
}
   })
   const data = await response.json();
   console.log(data);
   
}

const editFood = (item: GetFoodData)=>{
  setEditingId(item._id);
  console.log(item);
  setFoodForm({
      title: item.title,
      short_description: item.short_description,
      description: item.description,
       location:item.location,
        rating:item.rating
  })
}

const saveFood = async () => {
  if (
    !foodForm.title ||
    !foodForm.short_description ||
    !foodForm.description ||
    !foodForm.location.city ||
    !foodForm.location.country ||
    !foodForm.rating
  ) {
    return;
  }

  const formData = new FormData();

  formData.append("title", foodForm.title);
  formData.append("short_description", foodForm.short_description);
  formData.append("description", foodForm.description);
  formData.append("location", JSON.stringify(foodForm.location));
  formData.append("rating", foodForm.rating.toString());

  if (image) {
    formData.append("image", image);
  }

  try {
    const token = localStorage.getItem("data_token")    
    const response = await fetch(
      editingId
        ? `http://localhost:3000/admin/food/${editingId}`
        : "http://localhost:3000/admin/food",
      {
        method: editingId ? "PATCH" : "POST",
        body: formData,
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    console.log(data);

    // Թարմացնում ենք ցուցակը

    
    setFoodForm({
      title: "",
      short_description: "",
      description: "",
      location: {
        city: "",
        country: "",
      },
      rating: 0,
    });

    setImage(null);
    setEditingId(null);
  } catch (error) {
    console.log(error);
  }
};



    const filtered = foodData.filter((item) =>item.title.toLowerCase().includes(searchInput.toLowerCase()));
const handleFilter = (evt: React.ChangeEvent<HTMLInputElement>)=>{
setSearchInput(evt.target.value)
}
  return (
    

    <Fragment>
 <Helmet>
<title>
{t("adminTitle.titleAdminFood")}
</title>


<meta
name="description"
content="
Admin Panel Page For Creating Food Post
"
/>
    </Helmet>


    <section className="food">

      <div className="food-header">
        <div>
          <h1>{t("adminFoodHeader")}</h1>
          <p>{t("adminFoodParagraph")}</p>
        </div>

       
      </div>


      <div className="food-form">

        <h2>{t("create.foodPost")}</h2>

        <div className="form-grid">

          <div className="form-group full">
            <label>{t("inputBox.title")}</label>
            <input type="text" value={foodForm.title} onChange={handleChange} placeholder={t("inputBox.titlePlaceHolder")} name="title"/>
          </div>


          <div className="form-group full">
            <label>{t("inputBox.shortDescription")}</label>
            <input type="text"  value={foodForm.short_description} onChange={handleChange} placeholder={t("inputBox.placeHolderShortDescription")} name="short_description" />
          </div>

          <div className="form-group full">
            <label>{t("inputBox.description")}</label>
          <input type="text"  value={foodForm.description} onChange={handleChange} placeholder={t("inputBox.placeHolderdescription")} name="description" />
          </div>


<div className="form-group full">
  <label>{t("inputBox.country")}</label>
<input
  type="text"
  name="country"
   value={foodForm.location.country}
   placeholder={t("inputBox.placeHolderCountry")}
   onChange={handleChange}
/>
</div>

<div className="form-group full">
  <label>{t("inputBox.city")}</label>
<input
  type="text"
  name="city"
   value={foodForm.location.city}
   placeholder={t("inputBox.placeHolderCity")}
   onChange={handleChange}
/>
</div>


  <div className="form-group full">
  <label>{t("inputBox.rating")}</label>
<input

  type="number"
  name="rating"
  value={foodForm.rating}
  step="0.1"
  onChange={handleChange}
  placeholder='Enter a Rating'
/>
</div>

          <div className="form-group">
            <label>{t("inputBox.imgUpload")}</label>
            <input type="file" onChange={handleImageChange}/>
          </div>

        </div>

        <Button onClick={editingId?saveFood:addFood} className="save-btn">
         {t("savePost")}
        </Button>

      </div>


      <div className="food-list">

        <div className="list-header">
          <h2>Food Posts</h2>

          <input
            type="text"
            value={searchInput}
            onChange={handleFilter}
            placeholder={t("postSearch")}
          />
        </div>


        <div className="cards">

          {loading?(
            <>
               <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            </>
         
          ):!filtered ||  filtered.length === 0?(
                   <div className="empty-posts">
          <h2>{t("emptyPostHeader")}</h2>

          <p>
            {t("emptyPostParagraph")}
          </p>
        </div>
          ):(
filtered.map((item)=>{
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

      📍 {item.location?.city }, {item.location?.country}

    </div>

    <div className="stats">

      <span>❤️ {item.likesCount}</span>

      <span>👁 {item.viewsCount}</span>

    </div>

    <div className="actions">

      <Button
        onClick={() => editFood(item)}
        className="EditBtn"
      >
        Edit
      </Button>

      <Button
        onClick={() => deleteFood(item._id)}
        className="DeleteBtn"
      >
        Delete
      </Button>

      <Button
        onClick={() => openModal(item)}
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
    <PostModal 
    isOpen={modalFood}
    post={foodModalData}
    onClose={closeModal}
    />
    </Fragment>
  );
};

export default Food;