import notificationModel from "../models/Notification.js";
import settingModel from "../models/SettingsSchema.js";
import Travel from "../models/Travel.js";

const patchTravelLike = async (req, res) => {
try {
      const post = await Travel.findByIdAndUpdate(
        req.params.id,
        {$inc:{likesCount: 1}},
        {new: true}
    );

    if (!post) {
        return res.status(404).json({
            msg: "Post not found"
        });
    }
console.log("POST USER:", post.user);
const setting = await settingModel.findOne({
    user: post.user
})
  console.log("===== LIKE START =====");

    console.log("USER:", req.user);
    console.log("POST ID:", req.params.id);
   console.log("SETTING:", setting);

    console.log("NEW LIKE:", setting?.notification?.newLike);
if (setting?.notification?.newLike) {
  const newNotification =  await notificationModel.create({
            user: post.user,
    sender: req.user.id,
    postType: "Travel",
        type:"like",
         message: "Someone Liked on your post"
    })
      console.log(
        "NOTIFICATION CREATED:",
        newNotification
      );
}


    return res.status(200).json(post);
} catch (error) {
     return res.status(404).json({
        "msg":"Post Not Found"
    })
}
  
};

export default patchTravelLike;