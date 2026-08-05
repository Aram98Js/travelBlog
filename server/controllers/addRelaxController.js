

import ActivityModel from "../models/Activity.js";
import Relax from "../models/Relax.js";

 


 const addRelaxAction =  async(req,res)=>{
    try {
          const{title,short_description,description,location,rating} = req.body;
   const newRelax = {
    title,
    short_description,
    description,
    location:JSON.parse(location),
    rating:Number(rating),
    image:  req.file ? req.file.path : ""

   }
   const outputRelax = await Relax.create(newRelax);
   const activityOutPut = await ActivityModel.create({
      action: "Created",
    type: "Relax",
    title: outputRelax.title
   })

   return res.status(201).json({
      outputRelax,
      activityOutPut
   })
    } catch (error) {
        return res.status(500).json({
            "msg":"no"
        })
    }

 }

 export default addRelaxAction