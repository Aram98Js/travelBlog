import commentModel from "../models/comment.js";
import notificationModel from "../models/Notification.js";
import settingModel from "../models/SettingsSchema.js";
import User from "../models/User.js";

const commentController = async (req, res) => {
  try {
    const { text, category } = req.body;
    const { postId } = req.params;

    console.log("1. Comment request");

    const newComment = await commentModel.create({
      user: req.user.id,
      post: postId,
      text,
      category
    });

    console.log("2. Comment created:", newComment);

    const admin = await User.findOne({
      role: "admin"
    });

    console.log("3. Admin:", admin);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

  const settings = await settingModel.findOne({
    user:admin._id
  })

  if (settings?.notification?.newComment) {
    await notificationModel.create({
      user: admin._id,
        sender: req.user.id,
        postType: category,
      type: "comment",
      message: "Someone commented on your post"
    });
  }

    

    console.log("4. Notification created:", newNotification);

    return res.status(201).json({
      newComment,
      newNotification
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export default commentController;