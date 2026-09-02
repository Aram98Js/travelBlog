import mongoose from "mongoose";


const settingsSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
            unique: true
        },
        appearance:{
            theme:{
                type: String,
                enum:["light","dark","system"],
                default: "light",
                
            }
        },
        notification:{
              emailNotification: {
        type: Boolean,
        default: true
      },

      newComment: {
        type: Boolean,
        default: true
      },
        newPost: {
        type: Boolean,
        default: true
      },
      newLike:{
       type: Boolean,
       default: true
      },
       systemNotification: {
        type: Boolean,
        default: true
      }

        }
    },
    {
        timestamps: true
    }
)

const settingModel = mongoose.model("settingSchema",settingsSchema)
export default settingModel