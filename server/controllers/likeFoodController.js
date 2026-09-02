import Food from "../models/Food.js"
import notificationModel from "../models/Notification.js";
import settingModel from "../models/SettingsSchema.js";


const patchLikeFood = async (req,res)=>{
    try {
       
        const post = await Food.findByIdAndUpdate(
        req.params.id,
       {$inc:{likesCount: 1}},
          { new: true }
    );
    if (!post) {
        return res.status(404).json({
            msg: "Post not found"
        })
    }


   
const setting = await settingModel.findOne({
    user: post.user
})
console.log("POST USER:", post.user);
console.log("SETTING:", setting);
console.log("NEW LIKE:", setting?.notification?.newLike);

if (setting?.notification?.newLike) {
const newNotification =   await notificationModel.create({
            user: post.user,
    sender: req.user.id,
    postType: "Food",
        type:"like",
         message: "Someone Liked on your post"
    })
      console.log("NOTIFICATION CREATED:", notification);
        console.log(
        "NOTIFICATION CREATED:",
        newNotification
      );
}

    
    return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({
            msg: "Server Error"
        });

    }
    

}

export default patchLikeFood