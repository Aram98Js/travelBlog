
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    postType: {
      type: String,
      enum: ["Food", "Travel", "Relax", "user"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      enum: ["like", "comment", "admin", "system"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const notificationModel = mongoose.model(
  "notification",
  notificationSchema
);

export default notificationModel;

