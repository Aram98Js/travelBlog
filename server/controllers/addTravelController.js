

import ActivityModel from "../models/Activity.js";
import Travel from "../models/Travel.js";

 


 const addTravelAction =  async(req,res)=>{
    try {
          const{title,short_description,description,location,rating} = req.body;
   const newTravel = {
    user: req.user.id,
    title,
    short_description,
    description,
    image:  req.file ? req.file.path : "",
      location:JSON.parse(location),
    rating:Number(rating)

   }
   const outputTravel = await Travel.create(newTravel);
   const activityOutPut = await ActivityModel.create({
    action: "Created",
    type: "Travel",
    title: outputTravel.title
   })

   return res.status(201).json({
      outputTravel,
      activityOutPut
   })
    } catch (error) {
        return res.status(500).json({
            "msg":"no"
        })
    }

 }

 export default addTravelAction