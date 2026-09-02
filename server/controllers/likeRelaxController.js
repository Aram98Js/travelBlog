import notificationModel from "../models/Notification.js";
import Relax from "../models/Relax.js"
import settingModel from "../models/SettingsSchema.js";


 
 const likeRelaxPatch = async (req,res)=>{

    try {
        const post = await Relax.findByIdAndUpdate(
    req.params.id,
       {$inc:{likesCount: 1}},
          { new: true }
);
if (!post) {
    return res.status(404).json({
        "msg":"Post Not Found"
    })
}



const setting = await settingModel.findOne({
    user: post.user
})
  console.log("===== LIKE START =====");

    console.log("USER:", req.user);
    console.log("POST ID:", req.params.id);
if (setting?.notification?.newLike) {
    const newNotification =   await notificationModel.create({
            user: post.user,
    sender: req.user.id,
    postType: "Relax",
        type:"like",
         message: "Someone Liked on your post"
    })
     console.log(
        "NOTIFICATION CREATED:",
        newNotification
      );
}


return res.status(200).json(post)
    
} catch (error) {
   return res.status(500).json({
            msg: "Server Error"
        }); 
}

 }

 export default likeRelaxPatch