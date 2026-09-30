import mongoose from "mongoose";

const violationUsers = new mongoose.Schema({
user:{
  type: mongoose.Schema.Types.ObjectId, 
  ref: "User",
   required: true
},
username:{
    type: String,
    required: true
},

email:{
     type: String,
   required: true
},
phoneNumber:{
     type: String,
   required: true
},
violationCount:{
    type: Number,
    default: 1
   
},
reason:{
    type: String,
    required: true
},
blocked: {
    type: Boolean,
    default: false
},
blockedAt:{
    type: Date,
    default: null
}
})

const violationUser= mongoose.model("violationUsers",violationUsers);
export default violationUser