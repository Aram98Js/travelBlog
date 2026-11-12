
import commentModel from "../models/comment.js";
import notificationModel from "../models/Notification.js";
import settingModel from "../models/SettingsSchema.js";
import User from "../models/User.js";

const commentController = async (req, res) => {
  try {
    const { text, category } = req.body;
    const { postId } = req.params;

    if (!text?.trim() || !category) {
      return res.status(400).json({
        message: "Text and category are required"
      });
    }

    // 1. Create comment
    const newComment = await commentModel.create({
      user: req.user.id,
      post: postId,
      text: text.trim(),
      category
    });

    // 2. Count user's comments
    const reviews = await commentModel.countDocuments({
      user: req.user.id
    });

    // 3. Find admin and send notification
    let newNotification = null;

    try {
      const admin = await User.findOne({
        role: "admin"
      });

      if (admin) {
        const settings = await settingModel.findOne({
          user: admin._id
        });

        if (settings?.notification?.newComment) {
          newNotification = await notificationModel.create({
            user: admin._id,
            sender: req.user.id,
            postType: category,
            type: "comment",
            message: "Someone commented on your post"
          });
        }
      }
    } catch (notificationError) {
      console.error(
        "Notification error:",
        notificationError
      );
    }

    return res.status(201).json({
      message: "Comment created successfully",
      newComment,
      reviews,
      newNotification
    });

  } catch (error) {
    console.error("Comment error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export default commentController;
