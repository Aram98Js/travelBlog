import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
         user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    title:{
        required: true,
        type: String,
    },
    short_description:{
        required: true,
        type: String,
    },
    description:{
        required: true,
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    image:{
    type:String
},
likesCount:{
    type:Number,
    default: 0
},
commentCount: {
    type: Number,
    default: 0
},
location:{
      city:{
      type: String,
      required:true
    },
      country:{
      type: String,
      required:true
    },
},
rating:{
        type:Number,
        default:0
    },

viewsCount:{
    type: Number,
    default: 0
}
},
{
    timestamps: true
}
)

const Travel = mongoose.model("Travel",travelSchema);

export default Travel