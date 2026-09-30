

import ActivityModel from "../models/Activity.js";
import Relax from "../models/Relax.js";
import notificationModel from "../models/Notification.js";
import User from "../models/User.js";
 


 const addRelaxAction =  async(req,res)=>{
    try {
          const{title,short_description,description,price,location,rating} = req.body;
   const newRelax = {
      user: req.user.id,
    title,
    short_description,
    description,
    location:JSON.parse(location),
    rating:Number(rating),
    price:Number(price),
    image:  req.file ? req.file.path : ""

   }
   const outputRelax = await Relax.create(newRelax);
   const activityOutPut = await ActivityModel.create({
      action: "Created",
    type: "Relax",
    title: outputRelax.title
   })

const users = await User.find()



await Promise.all(
users.map(async(user)=>{
  const notificationCreate = await notificationModel.create({
user: user._id,
sender: req.user.id,
postType: "Relax",
message: `${req.user.username} Added a new Relax post: ${outputRelax.title}`,
type: "admin"
  });
  return notificationCreate
})
)


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