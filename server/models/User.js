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
       type: String,
  required: function () {
    return this.provider === "local";
  }
    },
    city:{
       type: String,
  required: function () {
    return this.provider === "local";
  }
    },
phoneNumber:{
  type: String,
  required: function () {
    return this.provider === "local";
  },

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
         type: String,
  required: function () {
    return this.provider === "local";
  }
    },
    gender:{
        type: String,
        enum:["male","female"],
   required: function () {
    return this.provider === "local";
  }
        },
 birthDate: {
  day: {
    type: Number,
    required: function () {
      return this.provider === "local";
    }
  },
  month: {
    type: String,
    required: function () {
      return this.provider === "local";
    }
  },
  year: {
    type: Number,
    required: function () {
      return this.provider === "local";
    }
  }
},
provider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
},

googleId: {
  type: String,
  unique: true,
  sparse: true
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
userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $type: "string" }
    }
  }
);

const User = mongoose.model("User",userSchema);
export default User