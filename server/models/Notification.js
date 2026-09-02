import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
       sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
        postType: {
      type: String,
      enum: ["Food", "Travel", "Relax"],
      required: true
    },

      message:{
        type:String,
        required: true
      },
    isRead:{
      type: Boolean,
      default: false
    },
  type:{
    type:String,
    enum: ["like", "comment", "admin"],
    required: true
  }

},
{
    timestamps:true
}
)

const notificationModel = mongoose.model("notification",notificationSchema);
export default notificationModel