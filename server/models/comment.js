import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
        user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
 type:String
},
     post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
        text:{
        type:String,
        required:true,
        maxlength:500
    },
       createdAt:{
        type:Date,
        default:Date.now()
    },
    commentCount: {
        type:Number,
        default: 0
    },
        status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ],
        default:"pending"
    }
},
{
 timestamps:true
}

)


const commentModel = mongoose.model("Comment",commentSchema);

 export default commentModel;

