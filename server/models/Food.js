import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({
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