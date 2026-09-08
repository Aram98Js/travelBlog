import mongoose from "mongoose"



const userSchema = new mongoose.Schema({
    username:{
        required: true,
        type: String,
    },
    email:{
         required: true,
         unique: true,
        type: String,
    },
    country:{
      required: true,
      type: String
    },
    city:{
       required: true,
      type: String
    },
phoneNumber:{
  required:true,
  unique: true,
  type:String
},
emailVerified: {
  type: Boolean,
  default: false
},

emailOtp: {
  type: String,
  default: null
},

emailOtpExpires: {
  type: Date,
  default: null
},
      image:{
    type:String
},

     password:{
         required: true,
        type: String,
    },
    gender:{
        type: String,
        enum:["male","female"],
        required:true,
        },
        birthDate: {
  day:{
    type:Number,
    required: true
  } ,
  month:{
    type:String,
    required: true,
  },
  year:{
    type: Number,
    required:true
  },
},



        role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
},
  {
        timestamps: true,
    }
)

const User = mongoose.model("User",userSchema);
export default User