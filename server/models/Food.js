import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({
      user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    title:{
        required: true,
        type: String
    },
    short_description:{
         required: true,
        type: String
    },
        description:{
         required: true,
        type: String
    },
    image:{
    type:String
},
price:{
    required: true,
    type: Number
},
likesCount:{
    type:Number,
    default: 0
},
commentCount: {
    type: Number,
    default: 0
},
    rating:{
        type:Number,
        default:0
    },


    viewsCount:{
        type:Number,
        default:0
    },
    location:{
    city:{
      type: String,
      required:true
    },
   country:{
     type:String,
     required:true
   }
},

},
{
    timestamps: true
}
)

const Food = mongoose.model("Food",foodSchema);
export default Food