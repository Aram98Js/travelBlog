

import ActivityModel from "../models/Activity.js";
import Food from "../models/Food.js";

 


 const addFoodAction =  async(req,res)=>{
    try {
          const{title,short_description,description,location,rating} = req.body;
   const newFood = {
    title,
    short_description,
    description,
    location:JSON.parse(location),
    rating,
    image:  req.file ? req.file.path : ""

   }
   const outputFood = await Food.create(newFood);
   const activityOutPut = await ActivityModel.create({
      action: "Created",
    type: "Food",
    title: outputFood.title
   })

   return res.status(201).json({
      outputFood,
      activityOutPut
   })
    } catch (error) {
        return res.status(500).json({
            "msg":"no"
        })
    }

 }

 export default addFoodAction