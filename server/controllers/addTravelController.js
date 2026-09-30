

import ActivityModel from "../models/Activity.js";
import Travel from "../models/Travel.js";
import notificationModel from "../models/Notification.js";
import User from "../models/User.js";
 


 const addTravelAction =  async(req,res)=>{
    try {
          const{title,short_description,price,description,location,rating} = req.body;
   const newTravel = {
    user: req.user.id,
    title,
    short_description,
    description,
    price,
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



   const users = await User.find()
   
   
   
   await Promise.all(
   users.map(async(user)=>{
     const notificationCreate = await notificationModel.create({
   user: user._id,
   sender: req.user.id,
   postType: "Travel",
   message: `${req.user.username} Added a new Travel post: ${outputTravel.title}`,
   type: "admin"
     });
     return notificationCreate
   })
   )

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