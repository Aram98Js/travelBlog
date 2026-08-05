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

     password:{
         required: true,
        type: String,
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