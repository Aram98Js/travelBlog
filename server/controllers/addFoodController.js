

import ActivityModel from "../models/Activity.js";
import Food from "../models/Food.js";
import notificationModel from "../models/Notification.js";
import User from "../models/User.js";

 


 const addFoodAction =  async(req,res)=>{
    try {
          console.log("1. BODY:", req.body);
    console.log("2. USER:", req.user);
    console.log("3. FILE:", req.file);

          const{title,short_description,description,price,location,rating} = req.body;
   const newFood = {
      user: req.user.id,
    title,
    short_description,
    description,
    price,
    location:JSON.parse(location || "{}"),
    rating,
    image:  req.file ? req.file.path : ""

   }
   const outputFood = await Food.create(newFood);
   const activityOutPut = await ActivityModel.create({
      action: "Created",
    type: "Food",
    title: outputFood.title
   })

const users = await User.find()



await Promise.all(
users.map(async(user)=>{
  const notificationCreate = await notificationModel.create({
user: user._id,
sender: req.user.id,
postType: "Food",
message: `${req.user.username} Added a new Food post: ${outputFood.title}`,
type: "admin"
  });
  return notificationCreate
})
)


   return res.status(201).json({
      outputFood,
      activityOutPut
   })

    } catch (error) {
      
         console.log("ADD FOOD ERROR:", error);
    console.log("ERROR MESSAGE:", error.message);
    console.log("ERROR NAME:", error.name);
    console.log("ERROR STACK:", error.stack);

  return res.status(500).json({
    msg: error.message
  });
    }

 }

 export default addFoodAction