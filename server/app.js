import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import User from './models/User.js';
import Relax from './models/Relax.js';
import Food from './models/Food.js';
import Travel from './models/Travel.js'
import dotenv from "dotenv";
import authMiddleWare from './auth/authMiddleware.js';
import adminMiddleware from './auth/adminMiddleware.js';
import routerDashBoard from './routers/dashboardRoutes.js';
import admin_router from './routers/adminRoutes.js';
import routerFoodAdd from './routers/addFoodRoutes.js';
import upload from './middleware/upload.js';
import routerFoodDelete from './routers/foodRoutes.js';
import routerRelaxDelete from './routers/relaxRoutes.js';
import routerRelaxAdd from './routers/addRelaxRoutes.js';
import routerTravelAdd from './routers/addTravelRoutes.js';
import routerTravelDelete from './routers/travelRoutes.js';
import routerTravelPatch from "./routers/patchTravelRoutes.js"
import routerFoodPatch from './routers/patchFoodRoutes.js';
import routerRelaxPatch from './routers/patchRelaxRoutes.js';
import routerTravelLikePatch from './routers/LikeRoutesTravel.js';
import routerFoodLikePatch from './routers/likeRoutesFood.js';
import routerRelaxLikePatch from './routers/likeRoutesRelax.js';
import { loginValidator, registerValidator } from './validators/authValidator.js';
import validate from './middleware/validate.js';
import commentRouter from './routers/commentRoutes.js';
import commentModel from './models/comment.js';
import patchCountRouter from './routers/PatchCountRoutes.js';
import NotificationModel from './models/Notification.js';
import saveModel from './models/SavePosts.js';
import updateCommentRouter from './routers/updateCommentCountRoutes.js';
import authMiddleware from './auth/authMiddleware.js';
import optionalAuthMiddleware from './auth/optionalAuthMiddleware.js';
import settingModel from './models/SettingsSchema.js';
import ai from './config/gemini.js';

import violationUser from './models/violationUsers.js';
import natureRouter from './routers/relaxRoute/natureRoute.js';
import weekendRouter from './routers/relaxRoute/weekendRoute.js';
import spaRouter from './routers/relaxRoute/spaRoute.js';
import familyRouter from './routers/relaxRoute/familyRoute.js';
import googleAouthRouter from './routers/googleAuthRoute.js';
import { getReviewRouter, reviewRouter } from './routers/reviewRoutes.js';
import getPostDetailRouter from './routers/getPostDetailsRoutes.js';
import SavedPlace from './models/SavedPlace.js';
import profileStatRouter from './routers/profileStatsRoute.js';

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())
app.use("/admin",routerFoodDelete)
app.use("/admin",routerRelaxDelete)
app.use("/admin",routerTravelDelete)
app.use(admin_router)
app.use("/admin/dashboard",routerDashBoard);
app.use("/admin",routerFoodAdd)
app.use("/admin",routerRelaxAdd)
app.use("/admin",routerTravelAdd)
app.use("/admin", routerRelaxPatch);
app.use("/admin", routerFoodPatch);
app.use("/admin", routerTravelPatch);
app.use("/admin",routerTravelLikePatch)
app.use("/admin",routerFoodLikePatch)
app.use("/admin",routerRelaxLikePatch)
app.use("/comment", commentRouter);
app.use(patchCountRouter)
app.use(updateCommentRouter);
app.use(reviewRouter);
app.use(getReviewRouter);
app.use(getPostDetailRouter)
app.use(profileStatRouter)



app.use(natureRouter)
app.use(weekendRouter)
app.use(spaRouter)
app.use(familyRouter)
app.use(googleAouthRouter)


//mongoose connection
mongoose.connect(process.env.MONGOOSE_URI)















app.post(
  "/userRegister",
  upload.single("image"),
  registerValidator,
  validate,
  async (req, res) => {

    console.log("REGISTER START");

    try {

      const {
        username,
        email,
        password,
        phoneNumber,
        gender,
        country,
        city
      } = req.body;

      const birthDate = JSON.parse(req.body.birthDate);

      if (password.length < 8) {
        return res.status(409).json({
          path: "password",
          msg: "password is too short"
        });
      }

      const existingUser = await User.findOne({
        username
      });

      if (existingUser) {
        return res.status(409).json({
          path: "username",
          msg: "username already exists"
        });
      }

      const existingPhone = await User.findOne({
        phoneNumber
      });

      if (existingPhone) {
        return res.status(409).json({
          path: "phoneNumber",
          msg: "Phone number already exists"
        });
      }

      const existingEmail = await User.findOne({
        email
      });

      if (existingEmail) {
        return res.status(409).json({
          path: "email",
          msg: "email already exists"
        });
      }

      const hashPass = await bcrypt.hash(password, 10);

      // Generate 6-digit OTP
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // OTP expires in 5 minutes
      const otpExpires = new Date(
        Date.now() + 5 * 60 * 1000
      );

      const newUser = {
        username,
        email,
        password: hashPass,
        gender,
        phoneNumber,
        birthDate,
        country,
        city,
        image: req.file?.path || "",

        emailVerified: false,
        emailOtp: otp,
        emailOtpExpires: otpExpires
      };

      const createdUser = await User.create(
        newUser
      );

      // Development only
      console.log(
        "Email OTP:",
        otp
      );

      const notificationed =
        await NotificationModel.create({
          user: createdUser._id,
          message: "is Registered",
          isRead: false,
          notificationCount: 1,
          type: "system",
          postType: "user",
          sender: createdUser._id
        });

      const unreadCount =
        await NotificationModel.countDocuments({
          user: createdUser._id,
          isRead: false
        });

      return res.status(201).json({
        msg: "Registration successful",
        createdUser,
        requiresEmailVerification: true,
        phoneNumber,
        notificationed,
        unreadCount

      });

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      return res.status(500).json({
        Msg: error.message
      });

    }
  }
);


app.post("/userLogin", loginValidator,
validate, async (req, res) => {

try {

    console.log("LOGIN SECRET: ", process.env.SECRET);

    const { email, password } = req.body;


    const findUser = await User.findOne({email});


    if (!findUser) {

    const errorResponse = {
        test: "HELLO_FROM_LOGIN",
        path: "email",
        msg: "userNotFound"
    };
       console.log(errorResponse)
        return res.status(401).json(errorResponse);
    }


    const pwd = await bcrypt.compare(
        password,
        findUser.password
    );


    if (!pwd) {
       const errorResponse = {
        test: "HELLO_FROM_LOGIN",
        path: "password",
        msg:"wrongPassword"
    };
    console.log(errorResponse)
        return res.status(401).json(errorResponse);
    }


    const accessToken = jwt.sign(
        {
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            role: findUser.role,
            image: findUser.image
        },
        process.env.SECRET,
        {
          expiresIn: "1d"
        }
    );

    const refreshToken = jwt.sign(
        {
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            role: findUser.role,
            image: findUser.image
        },
        process.env.REFRESH_SECRET,
        {expiresIn: "7d"}
    )

    console.log(
        "USER TOKEN DATA:",
        jwt.decode(accessToken)
    );

console.log(
    "REFRESH TOKEN DATA:",
    jwt.decode(refreshToken)
);
    return res.json({
        accessToken,
        user:{
          _id: findUser._id,
          username: findUser.username,
           email:findUser.email,
        role:findUser.role,
        image: findUser.image
        },
        refreshToken
    });


} catch(error) {

    console.log(error);

    return res.status(500).json({
        msg:"Server error"
    });

}
});



app.get("/pagination", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        msg: "Invalid pagination parameters"
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [travels, foods, relaxes] = await Promise.all([
      Travel.find().populate("user", "username"),
      Food.find().populate("user", "username"),
      Relax.find().populate("user", "username")
    ]);

    const post = [
      ...travels.map(item => ({
        ...item.toObject(),
        category: "Travel"
      })),

      ...foods.map(item => ({
        ...item.toObject(),
        category: "Food"
      })),

      ...relaxes.map(item => ({
        ...item.toObject(),
        category: "Relax"
      }))
    ];

    const paginationSlice = post.slice(
      skip,
      skip + limitNumber
    );

    return res.status(200).json({
      paginationSlice
    });

  } catch (error) {
    console.error("Pagination error:", error);

    return res.status(500).json({
      msg: "Internal server error"
    });
  }
});





app.post("/refreshToken",(req,res)=>{
 

  try {
    const {refreshToken} = req.body; 
      if(!refreshToken){
    return res.status(401).json({
      "msg":"token not found"
    })
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET
  );
  req.user = decoded;

  const accessToken = jwt.sign(
            {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role,
                image: decoded.image
            },
            process.env.SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            accessToken
        });
  } catch (error) {
     console.log("REFRESH TOKEN ERROR:", error);

        return res.status(401).json({
            msg: "Invalid or expired refresh token"
        });

  }

})

app.get("/admin/profile",adminMiddleware,async(req,res)=>{
  try {
    const adminProfile = await User.findById(req.user.id).select("-password");
    if (!adminProfile) {
      res.status(404).json({
        msg:"Admin Not Found"
      })
    }
    return res.status(200).json({
      user: adminProfile
    })
  } catch (error) {
    return res.status(500).json({
      msg:"Server Error"
    })
  }
})


app.patch("/admin/profile",adminMiddleware, async(req,res)=>{
try {
  const {username,email} = req.body
  const updatedAdmin = await User.findByIdAndUpdate(
    req.user.id,
    {
username
,email
    },
    {
      new: true
    }
  )


return res.status(200).json({
  msg:"Profile Updated Successfully",
  user: updatedAdmin
})
} catch (error) {
  return res.status(500).json({
    "msg":"server error"
  })
}
})



app.get("/comment/post/:postId", async(req,res)=>{
  try {
 const postId = req.params.postId;
    const comments = await commentModel.find({
      post:postId,
      status:"approved"
    }).populate("user","username image")
     .sort({ createdAt: -1 });


    return res.json({
      comments
    })
  } catch (error) {
     return res.status(500).json({
            message:error.message
        });

  }
   
})

app.get("/postTravel", async (req,res)=>{
const allPostTravel = await Travel.find().populate("user");
if (allPostTravel.length === 0) {
  return res.status(404).json({
    "msg":"not found"
  })
}
return res.status(200).json({
  allPostTravel
})
})


app.get("/postFood",async(req,res)=>{
  const allFoodPost = await Food.find().populate("user");
  if (allFoodPost.length === 0) {
    return res.status(404).json({
      "msg":"Not Found"
    })
  }
  return res.status(200).json({
    allFoodPost
  })
})

app.get("/postRelax",async(req,res)=>{
  const allRelaxPost = await Relax.find().populate("user");
  if (allRelaxPost.length === 0) {
    return res.status(404).json({
      "msg":"not found"
    })
  }
  return res.status(200).json({
    allRelaxPost
  })
})

app.get("/test", (req, res) => {
  return res.status(200).json({
    msg: "Server is working"
  });
});

app.get("/profile", authMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -refreshToken -emailOtp");

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    return res.status(200).json({
      user
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error"
    });
  }
});





app.patch(
  "/profile",
  authMiddleWare,
  upload.single("image"),
  async (req, res) => {
    try {
      const { username, email, birthDate } = req.body;

      const updateData = {};

      // Username
      if (username) {
        updateData.username = username;
      }

      // Email
      if (email) {
        updateData.email = email;
      }

      // Profile image
      if (req.file) {
        updateData.image = req.file.path;
      }

      // BirthDate
      if (birthDate) {
        let parsedBirthDate;

        try {
          parsedBirthDate = JSON.parse(birthDate);
        } catch (error) {
          return res.status(400).json({
            msg: "Invalid birthDate JSON"
          });
        }

        const { day, month, year } = parsedBirthDate ?? {};

        const date = new Date(
          Date.UTC(year, month - 1, day)
        );

        const isValidDate =
          Number.isInteger(day) &&
          Number.isInteger(month) &&
          Number.isInteger(year) &&
          year >= 1900 &&
          year <= new Date().getFullYear() &&
          date.getUTCFullYear() === year &&
          date.getUTCMonth() === month - 1 &&
          date.getUTCDate() === day &&
          date <= new Date();

        if (!isValidDate) {
          return res.status(400).json({
            msg: "Invalid birth date"
          });
        }

        updateData.birthDate = {
          day,
          month,
          year
        };
      }

      // Debug logs
      console.log("REQ BODY:", req.body);
      console.log("UPDATE DATA:", updateData);

      console.log(
        "SCHEMA BIRTHDATE:",
        User.schema.path("birthDate")
      );

      console.log(
        "SCHEMA BIRTHDATE DAY:",
        User.schema.path("birthDate.day")
      );

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: updateData
        },
        {
          new: true,
          runValidators: true
        }
      ).select("-password -refreshToken -emailOtp");

      if (!updatedUser) {
        return res.status(404).json({
          msg: "User not found"
        });
      }

      // Check database result
      console.log(
        "UPDATED BIRTHDATE:",
        updatedUser.birthDate
      );

      console.log(
        "UPDATED USER:",
        updatedUser.toObject()
      );

      return res.status(200).json({
        msg: "Profile updated successfully",
        updatedUser
      });

    } catch (error) {
      console.error("Profile update error:", error);

      if (error.name === "ValidationError" ||
          error.name === "CastError") {
        return res.status(400).json({
          msg: error.message
        });
      }

      return res.status(500).json({
        msg: "Internal server error"
      });
    }
  }
);



app.patch("/profile/changePassword", authMiddleWare, async(req,res)=>{
try {
  const{currentPassword,newPassword,confirmNewPassword} = req.body;
  if (newPassword !==confirmNewPassword) {
    return res.status(404).json({
      msg:"password dont match"
    })
  }
const user = await User.findById(req.user.id);
if (!user) {
  return res.status(404).json({
    "msg":"not fond"
  })
}
const isPasswordCorrect = await bcrypt.compare(currentPassword,user.password);
if(!isPasswordCorrect){
  return res.status(404).json({
    "msg":"wrong Password"
  })
}
const hashedNewPassword = await bcrypt.hash(newPassword,10);
user.password = hashedNewPassword;
await user.save();
return res.status(200).json({
    msg: "Password changed successfully"
})
} catch (error) {
  return res.status(500).json({
        msg: "Server error"
      });

}

})

app.delete("/profile",authMiddleWare,async(req,res)=>{
  try{
const deleteUser = await User.findByIdAndDelete(
  req.user.id
)
if(!deleteUser){
  return res.status(404).json({
    "msg":"user not found"
  })
}
return res.json({
  deleteUser
})
  }catch(error){
   return res.status(500).json({
    "msg": error
   })
  }

})

app.get("/notifications",authMiddleWare, async(req,res)=>{
  const notifications = await NotificationModel.find({
  user: req.user.id,
  })

  return res.status(200).json({
    notifications,
    
  })
})



app.get("/notification/counter",authMiddleWare, async(req,res)=>{
    const notificationCounter = await NotificationModel.countDocuments({
      user: req.user.id,
      isRead: false
  })
  return res.json({
notificationCounter
  })
})



app.post("/save_post/:category/:id", authMiddleWare, async (req, res) => {
  try {
    const { category, id } = req.params;

    const models = {
      travel: Travel,
      food: Food,
      relax: Relax
    };

    const Model = models[category.toLowerCase()];

    if (!Model) {
      return res.status(400).json({
        msg: "Invalid category"
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "Invalid post ID"
      });
    }

    const post = await Model.findById(id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }

    const existingSavedPost = await saveModel.findOne({
      user: req.user.id,
      post: post._id,
      category: Model.modelName
    });

    if (existingSavedPost) {
      return res.status(409).json({
        msg: "Post already saved"
      });
    }

    const savedPosts = await saveModel.create({
      user: req.user.id,
      post: post._id,
      category: Model.modelName
    });

    const savedPlaces = await saveModel.countDocuments({
      user: req.user.id
    });

    return res.status(201).json({
      post,
      savedPosts,
      savedPlaces
    });

  } catch (error) {
    console.error("SAVE POST ERROR:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
});




app.get("/save_post", authMiddleWare,async(req,res)=>{

  try {
  const posts = await saveModel.find({
    user: req.user.id
  }).populate("post");
  if (posts.length === 0) {
    return res.status(200).json(
      []
    )
  }

  return res.status(200).json({
    posts
  })    
  } catch (error) {
    return res.status(500).json({
      msg: "Server error"
    });
  }

})

app.delete("/delete_post/:id",authMiddleware,async(req,res)=>{
  try {
    const id = req.params.id;
    const deletedPost = await saveModel.findOneAndDelete({
      _id: id,
      user:req.user.id
    });
    if (!deletedPost) {
      return res.status(404).json({
        msg:"Post not Found"
      })
    }


    return res.status(200).json({
      msg:"Deleted"
    })
  } catch (error) {
    return res.status(500).json({
      msg:"Server error",
error
    })
  }
})



app.get("/save_post/counter",authMiddleWare,async(req,res)=>{
  const saveCounter = await saveModel.countDocuments({
    user: req.user.id
  })
  return res.json({
    saveCounter
  })
})





app.delete("/userDelete",authMiddleWare,async(req,res)=>{

  try {

  const deletedUser = await User.findByIdAndDelete(req.user.id) 
  
  if (!deletedUser) {
    return res.status(401).json({
      "msg": "not found"
    })
  }

  return res.status(204).json({
    "msg":"Delete"
  })
  } catch (error) {
    return res.status(500).json({
      "msg":"Server not found"
    })
  }

})

app.post("/chat",async(req,res)=>{
 try {
  const {message} = req.body
  console.log("message",message);
  if (!message) {
    return res.status(404).json({
      msg:"Message is Required"
    })
  }

const response = await OpenAI.Responses.create({
  model:"gpt-5.6-luna",
      input: message
})

  return res.status(200).json({
    message:response.output_text
  })
 } catch (error) {
  
    return res.status(500).json({
      msg: "Server Error"
    });
 }
})
//------------------------------------------------For Phone Verification-----------------------------------------------------


app.post("/auth/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({
        msg: "Email and OTP are required"
      });
    }

    // Find user
    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        msg: "User Not Found"
      });
    }

   
    if (user.emailVerified) {
      return res.status(400).json({
        msg: "Phone number is already verified"
      });
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      return res.status(400).json({
        msg: "OTP not found"
      });
    }

   
    if (new Date() > user.emailOtpExpires) {
      return res.status(400).json({
        msg: "OTP has expired"
      });
    }

   
    if (user.emailOtp !== otp) {
      return res.status(400).json({
        msg: "Invalid OTP"
      });
    }


    user.emailVerified = true;

  
    user.emailOtp = null;
    user.emailOtpExpires = null;

    await user.save();

    return res.status(200).json({
      msg: "Phone number verified successfully",
      emailVerified: true
    });

  } catch (error) {
    console.log("VERIFY EMAIL ERROR:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
});


app.post("/auth/resend-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check phone number
    if (!email) {
      return res.status(400).json({
        msg: "Phone Number is required"
      });
    }

    // Find user
    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        msg: "Phone number is already verified"
      });
    }


    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    user.emailOtp = otp;
    user.emailOtpExpires = otpExpires;

    await user.save();
    console.log("NEW Email OTP:", otp);

    return res.status(200).json({
      msg: "Verification code generated successfully"
    });

  } catch (error) {
    console.log("RESEND OTP ERROR:", error);

    return res.status(500).json({
      msg: "Failed to resend OTP"
    });
  }
});





//------------------------------------------------For Admin Routes-----------------------------------------------------------

app.get("/admin/dashboard", adminMiddleware, (req, res) => {
  res.json({
    msg: "Welcome admin",
    user: req.user
  });

});








app.get("/admin/foodList", adminMiddleware, async (req, res) => {
  try {

    const allFoods = await Food.find().populate("user","username")
    if (allFoods.length === 0) {

      return res.status(404).json({
        msg: "Food not found"
      });

    }


    return res.status(200).json({
     allFoods
    });


  } catch (error) {

    return res.status(500).json({
      msg: error.message
    });

  }
})





app.get("/admin/list_for_travel", adminMiddleware,async (req, res) => {
  const allTravel = await Travel.find().populate("user","username");
  if (allTravel.length === 0) {
    return res.status(404).json({
      "msg": "no "
    })
  }
  return res.json({
    allTravel
  })
})

app.get("/admin/violationUsers", adminMiddleware, async (req, res) => {
  try {
    const violationUsers = await violationUser.find();

    return res.status(200).json({
      msg: "Violation users fetched successfully",
      violationUsers,
      total: violationUsers.length
    });

  } catch (error) {
    console.error("VIOLATION USERS ERROR:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
});

app.get("/admin/relaxList", adminMiddleware,async (req, res) => {
  const allRelax = await Relax.find().populate("user","username");
  if (allRelax.length === 0) {
    return res.status(404).json({
      "msg": "no "
    })
  }
  return res.json({
    allRelax
  })
})



app.get("/admin/comments",adminMiddleware,async(req,res)=>{
  const comments = await commentModel.find({
    status:"pending"
  }).populate("user","username image")

  return res.json({
    comments
  })
})

app.patch("/admin/profile/changePassword",adminMiddleware,async(req,res)=>{

try {
  
  const {currentPassword,newPassword,confirmNewPassword} = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      "msg":"Password dont match"
    })
  }

      const adminFind = await User.findById(req.user.id)
      if (!adminFind) {
        return res.status(404).json({
          "msg": "user not found"
        })
      }
      
      const adminCurrentPassword = await bcrypt.compare(currentPassword, adminFind.password)
      if(!adminCurrentPassword){
return res.status(401 ).json({
  "msg":"Wrong Password"
})
      }

      const adminNewPassword = await bcrypt.hash(newPassword,10);
      adminFind.password = adminNewPassword;
adminFind.save()
      return res.status(200).json({
        "msg":"admin password is already changed"
      })
} catch (error) {
  return res.status(500).json({
   "msg":"server error"
  })
}


})

app.get("/admin/settings",adminMiddleware,async(req,res)=>{
  try {
    let settings = await settingModel.findOne({
      user:req.user.id
    })


    if (!settings) {
      settings = await settingModel.create({
        user: req.user.id
      })
    }

    return res.status(200).json({
      settings
    })
  } catch (error) {
     console.log(error);

      return res.status(500).json({
        msg: "Server error"
      });
  }
});

app.patch("/admin/settings",adminMiddleware,async(req,res)=>{
  try {
   const{appearance,emailNotification,newComment,newPost,newLike,systemNotification} = req.body;

const updateData = {}
if(appearance){
  updateData["appearance.theme"] = appearance.theme
}


    if (emailNotification !== undefined) {

      updateData["notification.emailNotification"] =
        emailNotification;

    }

    if (newComment !== undefined) {

      updateData["notification.newComment"] =
        newComment;

    }

    if (newPost !== undefined) {

      updateData["notification.newPost"] =
        newPost;

    }

    if (newLike !== undefined) {

      updateData["notification.newLike"] =
        newLike;

    }

    if (systemNotification !== undefined) {

      updateData["notification.systemNotification"] =
        systemNotification;

    }

   const updateSetting = await settingModel.findOneAndUpdate(
    {
      user:  req.user.id
    },
    {
    $set:updateData
    },
    {
      returnDocument: 'after',
      upsert: true
    }
    
   ) 

   return res.status(200).json({
    msg:"Settings updated successfully",
    settings: updateSetting
   })
  } catch (error) {
    return res.status(500).json({
      msg:"Server Not Found"
    })
  }
})




app.get("/admin/notification",adminMiddleware,async(req,res)=>{
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const notification = await NotificationModel.find({
      user: req.user.id,
      type: { $in: ["like", "comment"] }
    })
    .populate("sender","username image")
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    const total = await NotificationModel.countDocuments(
      {
  user: req.user.id,
      type: "admin"
      }
    
    )
    const totalPages = Math.ceil(total/limit);
    return res.status(200).json({
      notification,
      currentPage: page,
      totalPages,
      total
    })
  } catch (error) {
    return res.status(500).json({
      msg:"server error"
    })
  }
})


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (options, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(options);
    } catch (error) {
      const status = error.status;

      const retryable =
        status === 503 ||
        status === 429 ||
        status === 500;

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.log(
        `Gemini API error ${status}. Retry ${attempt}/${maxAttempts} after ${delay}ms`
      );

      await sleep(delay);
    }
  }
};


app.post("/ai/check",optionalAuthMiddleware,async(req, res) => {
  try {

   let violation = null


   if(req.user){
    violation =  await violationUser.findOne({
      user: req.user.id
    });
   }


    if (violation?.blocked) {
      return res.status(403).json({
    violation: true,
    blocked: true,
    violationCount: violation.violationCount,
    message: "Your access to the chatbot has been blocked.",
    result: null
  });
    }



    const { message } = req.body;
    const foods = await Food.find().select("title short_description description price rating location").lean();
    const travels = await Travel.find().select("title short_description description price rating location").lean();
    const relaxes = await Relax.find().select("title short_description description price rating location").lean();
    const response = await generateWithRetry({
      model: "gemini-3.5-flash-lite",
        config: {
    responseMimeType: "application/json"
  },
      contents: `
Դու մեր կայքի AI chatbot-ն ես։

Քո հիմնական նպատակն է օգտատիրոջը տալ հստակ, օգտակար, բնական և ճշգրիտ պատասխաններ։

========================
1. ԼԵԶՈՒ
========================

Միշտ որոշիր օգտատիրոջ հաղորդագրության լեզուն և պատասխանիր ՆՈՒՅՆ լեզվով։

Հայերեն → հայերեն
Ռուսերեն → ռուսերեն
Անգլերեն → անգլերեն

Մի որոշիր օգտատիրոջ ազգությունը, քաղաքացիությունը կամ ծագումը։
Լեզուն որոշիր միայն հաղորդագրության բովանդակությունից։

Եթե օգտատերը խառնում է մի քանի լեզու,
օգտագործիր այն լեզուն, որը գերակշռում է հաղորդագրության մեջ։

Հայերեն հարցերի դեպքում օգտագործիր բնական և գրագետ արևելահայերեն։
Մի օգտագործիր մեքենայական թարգմանության ոճ։

========================
2. VIOLATION / ԱՆՊԱՏՇԱՃ ԼԵԶՈՒ
========================

Եթե հաղորդագրությունը պարունակում է՝

- հայհոյանք
- վիրավորանք
- նվաստացնող արտահայտություն
- գռեհիկ արտահայտություն
- սեռական բնույթի անպատշաճ արտահայտություն
- սպառնալիք
- ատելության կամ նվաստացման արտահայտություն

ապա՝

"violation": true

Violation-ի warning-ը ՄԻՇՏ գրիր օգտատիրոջ օգտագործած լեզվով։

Հայերեն՝
"Խնդրում ենք պահպանել հարգալից և պատշաճ հաղորդակցություն։"

Ռուսերեն՝
"Пожалуйста, соблюдайте уважительный и корректный стиль общения."

Անգլերեն՝
"Please maintain respectful and appropriate communication."

Սովորական քննադատությունը կամ դժգոհությունը violation մի համարիր,
եթե այն չի պարունակում վիրավորանք, հայհոյանք կամ այլ անպատշաճ բովանդակություն։

========================
3. ԿԱՅՔԻ ԲՈՎԱՆԴԱԿՈՒԹՅՈՒՆ
========================

Մեր կայքն ունի երեք հիմնական ուղղություն։

Travel — ճամփորդական ուղղություններ և վայրեր
Food — ուտեստներ և հայկական խոհանոց
Relax — հանգստի վայրեր և հանգստյան գոտիներ

Եթե օգտատիրոջ հարցը վերաբերում է այս բաժիններից որևէ մեկին,
փորձիր հասկանալ, թե որ բաժնի մասին է խոսքը։

========================
4. ՃՇԳՐՏՈՒԹՅՈՒՆ
========================

ԵՐԲԵՔ մի հորինիր մեր կայքի տվյալները։

Եթե backend-ը տրամադրել է կոնկրետ տվյալներ,
օգտագործիր այդ տվյալները։

Եթե backend-ը տվյալ չի տրամադրել,
մի պնդիր, որ այդ տվյալը գոյություն ունի մեր կայքում։

Մի հորինիր՝

- ռեստորաններ
- ուտեստներ
- ճանապարհորդական ուղղություններ
- հանգստյան վայրեր
- գներ
- հասցեներ
- վարկանիշներ
- հեռախոսահամարներ
- ծառայություններ
- աշխատանքային ժամեր

========================
5. ՏՎՅԱԼՆԵՐ ՉԿԱՆ
========================

Եթե օգտատերը հարցնում է Travel, Food կամ Relax թեմայով,
բայց համապատասխան տվյալներ backend-ից չեն տրամադրվել,
տեղեկացրու նրան, որ տվյալ պահին մեր հարթակում այդ տեղեկատվությունը չկա։

Մի ասա, որ ամբողջ աշխարհում նման վայր կամ ուտեստ գոյություն չունի։

Ասա միայն, որ ՄԵՐ ՀԱՐԹԱԿՈՒՄ տվյալ պահին այդ տեղեկատվությունը հասանելի չէ։

Օրինակ՝

Հայերեն՝
"Այս պահին մեր հարթակում այդ ուղղության վերաբերյալ տեղեկատվություն դեռ չունենք, սակայն հետագայում կարող են ավելացվել նոր ուղղություններ։"

Ռուսերեն՝
"В данный момент на нашей платформе пока нет информации об этом направлении, но в дальнейшем могут появиться новые направления."

Անգլերեն՝
"We currently don't have information about this destination on our platform, but new destinations may be added in the future."

Նույն սկզբունքը կիրառիր Food և Relax բաժինների համար։

========================
6. ՀԱՐՑԻ ԹԵՄԱՅԻ ՈՐՈՇՈՒՄ
========================

Փորձիր հասկանալ օգտատիրոջ հարցի նպատակը։

Հնարավոր թեմաներ՝

Travel
Food
Relax
General
Greeting
Recommendation
Information
Unknown

Օրինակ՝

"Որտե՞ղ գնալ հանգստանալու"
→ Relax / Recommendation

"Ի՞նչ հայկական ուտեստներ ունեք"
→ Food / Information

"Որտե՞ղ կարող եմ գնալ Հայաստանում"
→ Travel / Recommendation

========================
7. RECOMMENDATION
========================

Եթե օգտատերը խնդրում է խորհուրդ կամ առաջարկություն,
օգտագործիր միայն backend-ի տրամադրած համապատասխան տվյալները։

Եթե կան մի քանի համապատասխան տարբերակներ,
կարող ես ներկայացնել դրանք կարճ և հասկանալի ձևով։

Եթե համապատասխան տվյալներ չկան,
տեղեկացրու, որ տվյալ պահին մեր հարթակում համապատասխան տարբերակ չկա։

========================
8. CLARIFICATION
========================

Եթե հարցը չափազանց ընդհանուր է կամ հնարավոր չէ հասկանալ,
տուր մեկ կարճ ճշտող հարց։

Մի հարցրու միանգամից բազմաթիվ հարցեր։

Օրինակ՝

User:
"Ուզում եմ հանգստանալ։"

Assistant:
"Իհարկե 😊 Նախընտրո՞ւմ ես բնության գրկում հանգիստ, թե՞ ավելի ակտիվ հանգիստ։"

========================
9. CONVERSATION CONTEXT
========================

Հաշվի առ նախորդ հաղորդագրությունների կոնտեքստը։

Եթե օգտատերը շարունակում է նախորդ հարցի թեման,
մի պահանջիր կրկնել արդեն տրամադրված տեղեկությունը։

Օրինակ՝

User:
"Ուզում եմ գնալ Դիլիջան։"

Assistant:
"Ի՞նչ տեսակի հանգիստ ես նախընտրում։"

User:
"Բնության մեջ։"

Դու պետք է հասկանաս, որ "բնության մեջ"-ը վերաբերում է Դիլիջանին։

========================
10. GREETING
========================

Եթե օգտատերը պարզապես բարևում է,
պատասխանիր կարճ և ընկերական ձևով՝ նույն լեզվով։

Օրինակ՝

Հայերեն:
"Բարև 👋 Ինչո՞վ կարող եմ օգնել։"

Ռուսերեն:
"Здравствуйте 👋 Чем могу помочь?"

Անգլերեն:
"Hello 👋 How can I help you?"



Ողջույն տուր ՄԻԱՅՆ այն դեպքում, երբ օգտատիրոջ հիմնական հաղորդագրությունը պարզապես ողջույն է։
Եթե հաղորդագրությունը պարունակում է հարց, խնդրանք կամ տեղեկատվության պահանջ՝ ՄԻ ՈՂՋՈՒՆԻՐ և անմիջապես պատասխանիր օգտատիրոջ հարցին։
Եթե ողջույնը և հարցը միասին են՝ նույնպես ՄԻ ՈՂՋՈՒՆԻՐ և անմիջապես պատասխանիր հարցին։
ԵՐԲԵՔ մի սկսիր յուրաքանչյուր պատասխանը ողջույնով։

========================
11. OFF-TOPIC ՀԱՐՑԵՐ
========================

Եթե հարցը չի վերաբերում մեր կայքի Travel, Food կամ Relax ուղղություններին,
կարող ես պատասխանել որպես ընդհանուր AI օգնական,
եթե հարցը անվտանգ և սովորական տեղեկատվական հարց է։

Եթե հարցը պահանջում է տվյալներ, որոնք միայն մեր կայքի backend-ից կարող են հաստատվել,
մի հորինիր դրանք։

========================
12. ԳՈՐԾՈՂՈՒԹՅՈՒՆՆԵՐ
========================

Երբեք մի ասա, որ որևէ գործողություն կատարել ես,
եթե backend-ը չի հաստատել այդ գործողության հաջող կատարումը։

Օրինակ՝

Մի ասա՝
"Ես ջնջեցի քո հաշիվը։"

եթե backend-ը իրականում չի կատարել այդ գործողությունը։

========================
13. ՊԱՏԱՍԽԱՆԻ ՁԵՎԱՉԱՓ
========================

Միշտ վերադարձիր ՄԻԱՅՆ այս JSON կառուցվածքով։

{
  "violation": true կամ false,
  "message": "warning կամ սովորական պատասխան",
  "result": "AI պատասխանը կամ null"
}

Եթե violation = true՝

{
  "violation": true,
  "message": "warning",
  "result": null
}

Եթե violation = false՝

{
  "violation": false,
  "message": null,
  "result": "սովորական AI պատասխան"
}

Մի ավելացրու որևէ տեքստ JSON-ից դուրս։

========================
14. ՊԱՏԱՍԽԱՆՆԵՐԻ ՈՃ
========================

Պատասխանները պահիր՝

- բնական
- ընկերական
- հստակ
- օգտակար
- ոչ չափազանց երկար

Մի կրկնիր օգտատիրոջ հարցը առանց անհրաժեշտության։

Եթե հարցին հնարավոր է պատասխանել մեկ-երկու նախադասությամբ,
մի ստեղծիր երկար պատասխան։

Օգտագործիր emoji միայն այն դեպքում,
երբ դրանք բնական են տվյալ խոսակցության մեջ։

===================================
15. ՄՈՒՏՔ, ԳՐԱՆՑՈՒՄ և  ՎԵՐԻՖԻԿԱՑԻԱ
===================================

Տուր ինֆորմացիա թե ինչպես են գրանցվելու վերիֆիկացիայի մասին ինֆորմացիա հայտնիր
պատրաստել եմ այնպես որ Էլ․ հասցեին է գալու վերիֆիկացիայի կոդը
կարճ ասած ուղղորդես այդ հարցում մանրամասն։


contents: 
Դու մեր կայքի AI chatbot-ն ես։

... քո մնացած rules-երը ...

===================================
16. ՄԵՐ ՀԱՐԹԱԿԻ ԱՌԿԱ ՏՎՅԱԼՆԵՐԸ
===================================

Սրանք տվյալ պահին մեր database-ում առկա իրական post-երն են։

FOOD:
${JSON.stringify(foods)}

TRAVEL:
${JSON.stringify(travels)}

RELAX:
${JSON.stringify(relaxes)}

ՇԱՏ ԿԱՐԵՎՈՐ։

Օգտատիրոջը մեր կայքի post առաջարկելիս օգտագործիր ՄԻԱՅՆ վերևում տրամադրված տվյալները։

ԵՐԲԵՔ մի հորինիր post, title, price, location, rating կամ այլ տվյալ։

Եթե համապատասխան բաժնում տվյալների array-ը դատարկ է,
ասա, որ տվյալ պահին մեր հարթակում այդ բաժնի վերաբերյալ համապատասխան տեղեկատվություն չկա։

Եթե տվյալ բաժնում կա միայն 1 post,
կարող ես ասել, որ այս պահին մեր հարթակում հասանելի է այդ մեկ տարբերակը։

Եթե կան մի քանի post-եր,
կարող ես առաջարկել համապատասխան տարբերակները։

Օգտատիրոջ հարցը՝


${message}
      `,
    });

const text = response.text;
const result = JSON.parse(text);

let blocked = false;
let violationCount = 0;

if (result.violation === true && req.user) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const existingViolation = await violationUser.findOne({
    user: user._id
  });

  if (!existingViolation) {
    const newViolation = await violationUser.create({
      user: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber ?? null,
      reason: "Inappropriate language",
      violationCount: 1,
      blocked: false
    });

    violationCount = newViolation.violationCount;
  } else {
    existingViolation.violationCount += 1;

    violationCount = existingViolation.violationCount;

    if (violationCount >= 3) {
      existingViolation.blocked = true;
      existingViolation.blockedAt = new Date();
    }

    await existingViolation.save();
  }

  blocked = violationCount >= 3;
}

return res.status(blocked ? 403 : 200).json({
  violation: result.violation,
  violationCount,
  blocked,
  message: blocked
    ? "Դուք 3 անգամ խախտել եք կանոնները։ Ձեր մուտքը chatbot արգելափակված է։"
    : result.message,
  result: blocked ? null : result.result
});

  } catch (error) {
  console.log("========== AI ERROR ==========");
  console.log(error);
  console.log("MESSAGE:", error.message);
  console.log("NAME:", error.name);
  console.log("STACK:", error.stack);

    return res.status(500).json({
      message: "AI error"
    });
  }
});


app.post("/ai/food_advice",async(req,res)=>{
try {

 const {ingredients} = req.body;
 if(!ingredients.trim()){
  return res.status(400).json({
    msg:"incredients are required"
  })
 }

 const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
       config: {
    responseMimeType: "application/json",
  },
  contents: `
Դու պրոֆեսիոնալ խոհարար և AI խոհարարական օգնական ես։

Քո հիմնական նպատակն է օգտատիրոջ տրամադրած բաղադրիչների հիման վրա առաջարկել իրական, տրամաբանական և գործնական ուտեստ, որը օգտատերը կարող է պատրաստել իր նշած բաղադրիչներով։

ՕԳՏԱՏԻՐՈՋ ԲԱՂԱԴՐԻՉՆԵՐԸ
-----------------------
Օգտատերը նշել է հետևյալ բաղադրիչները՝
${ingredients}

ՀԻՄՆԱԿԱՆ ԿԱՆՈՆՆԵՐ
-----------------------

1. Առաջարկիր միայն իրական և տրամաբանական ուտեստ։

2. Ուտեստը պետք է հնարավոր լինի պատրաստել օգտատիրոջ նշած հիմնական բաղադրիչներով։

3. Մի առաջարկիր ուտեստ, որի հիմնական բաղադրիչը բացակայում է օգտատիրոջ ցուցակից։

4. Մի հորինիր տարօրինակ կամ անհավանական բաղադրիչների համադրություններ։

5. Եթե օգտատերը նշել է մի քանի բաղադրիչ, փորձիր հնարավորինս շատ օգտագործել դրանցից։

6. Կարող ես օգտագործել սովորական հիմնական խոհանոցային բաղադրիչներ միայն այն դեպքում, երբ դրանք տվյալ ուտեստի համար ոչ էական են։
Օրինակ՝ աղ, սև պղպեղ, ջուր, բուսական յուղ։

7. Չի թույլատրվում ավելացնել այնպիսի հիմնական բաղադրիչ, որի բացակայության դեպքում ուտեստը չի կարող պատրաստվել։

Օրինակ՝
Եթե օգտատերը ունի՝
"կարտոֆիլ, սոխ"

չի կարելի առաջարկել՝
"կարտոֆիլով և հավով ուտեստ",
քանի որ հավը օգտատիրոջ մոտ չկա։

8. Եթե նշված բաղադրիչներից հնարավոր է պատրաստել մի քանի տարբեր ուտեստ, ընտրիր ամենահարմար և իրատեսական տարբերակը։

9. Եթե բաղադրիչները բավարար չեն որևէ նորմալ ուտեստ պատրաստելու համար, ազնվորեն նշիր դա և առաջարկիր ամենապարզ հնարավոր տարբերակը։

10. Մի առաջարկիր այնպիսի բաղադրատոմս, որի պատրաստման համար անհրաժեշտ են բազմաթիվ լրացուցիչ բաղադրիչներ։

ԲԱՂԱԴՐԻՉՆԵՐԻ ՄՇԱԿՈՒՄ
-----------------------

Օգտատիրոջ կողմից նշված բաղադրիչները կարող են լինել տարբեր ձևերով։

Օրինակ՝
"eggs, potatoes, onion"
"ձու, կարտոֆիլ, սոխ"
"яйца, картошка, лук"

Դու պետք է հասկանաս այդ բաղադրիչների իմաստը և օգտագործես դրանք համապատասխան ձևով։

Եթե օգտատերը նշում է քանակություն, օրինակ՝
"3 eggs, 2 potatoes"

պահպանիր այդ քանակությունը recipe-ում։

Եթե քանակություն նշված չէ, առաջարկիր ողջամիտ քանակություն՝ հաշվի առնելով սովորական չափաբաժինը։

RECIPE-Ի ԿԱՌՈՒՑՎԱԾՔԸ
-----------------------

Պատասխանը պետք է պարունակի հետևյալ տեղեկատվությունը.

1. dish
   - Ուտեստի անվանումը։

2. description
   - Կարճ նկարագրություն։
   - Բացատրիր, թե ինչպիսի ուտեստ է և ինչու է հարմար նշված բաղադրիչների համար։

3. cookingTime
   - Մոտավոր պատրաստման ժամանակը։
   - Օրինակ՝ "25 minutes" կամ "25 րոպե"։

4. difficulty
   - Պատրաստման բարդությունը։
   - Օգտագործիր միայն՝
     "Easy"
     "Medium"
     "Hard"
   - Բայց պատասխանի լեզվին համապատասխան կարող ես թարգմանել դրանք։

5. ingredients
   - Տվյալ ուտեստի համար անհրաժեշտ բաղադրիչների ամբողջական ցուցակը։
   - Նշիր նաև քանակությունները, եթե հնարավոր է։

6. steps
   - Տուր պատրաստման մանրամասն քայլերը։
   - Յուրաքանչյուր քայլ պետք է լինի առանձին զանգվածի տարր։
   - Քայլերը պետք է լինեն տրամաբանական հերթականությամբ։
   - Մի գրիր չափազանց կարճ քայլեր։
   - Յուրաքանչյուր քայլում բացատրիր՝ ինչ պետք է անել և, անհրաժեշտության դեպքում, որքան ժամանակ։

7. tips
   - Տուր 2-4 օգտակար խոհարարական խորհուրդ։
   - Խորհուրդները պետք է կապված լինեն տվյալ ուտեստի հետ։
   - Մի գրիր ընդհանուր կամ անիմաստ խորհուրդներ։

ՊԱՏՐԱՍՏՄԱՆ ՔԱՅԼԵՐ
-----------------------

Քայլերը պետք է լինեն բավական մանրամասն, որպեսզի սկսնակ մարդը նույնպես կարողանա պատրաստել ուտեստը։

Օրինակ՝ վատ տարբերակ է՝
"Տապակել կարտոֆիլը։"

Ավելի լավ տարբերակ է՝
"Կարտոֆիլը մաքրիր, կտրատիր բարակ շերտերով և տապակիր միջին կրակի վրա մոտ 8-10 րոպե՝ ժամանակ առ ժամանակ խառնելով, մինչև այն սկսի փափկել և թեթև ոսկեգույն դառնալ։"

Մի բաց թող կարևոր պատրաստման փուլերը։

Եթե անհրաժեշտ է՝ նշիր.
- կրակի ուժգնությունը
- մոտավոր ժամանակը
- երբ ավելացնել հաջորդ բաղադրիչը
- ինչպես հասկանալ, որ տվյալ փուլը ավարտված է

ԼԵԶՎԻ ԿԱՆՈՆ
-----------------------

Պատասխանի լեզուն պետք է համապատասխանի օգտատիրոջ մուտքային լեզվին։

Եթե օգտատերը գրում է հայերեն՝ պատասխանիր հայերեն։

Եթե օգտատերը գրում է ռուսերեն՝ պատասխանիր ռուսերեն։

Եթե օգտատերը գրում է անգլերեն՝ պատասխանիր անգլերեն։

Մի խառնիր լեզուները։

Օգտատիրոջ ազգությունը մի ենթադրիր։
Որոշիր լեզուն միայն նրա գրած տեքստի հիման վրա։

JSON-Ի ՊԱՀԱՆՋՆԵՐ
-----------------------

Պատասխանը ՄԻՇՏ պետք է լինի միայն վավեր JSON։

Մի ավելացրու Markdown։

Մի ավելացրու \`\`\`json։

Մի ավելացրու բացատրություն JSON-ից առաջ։

Մի ավելացրու բացատրություն JSON-ից հետո։

Օգտագործիր հետևյալ կառուցվածքը՝

{
  "dish": "...",
  "description": "...",
  "cookingTime": "...",
  "difficulty": "...",
  "ingredients": [],
  "steps": [],
  "tips": []
}

Բոլոր դաշտերը պարտադիր են։

"ingredients"-ը պետք է լինի զանգված։

"steps"-ը պետք է լինի զանգված։

"tips"-ը պետք է լինի զանգված։

JSON-ը պետք է լինի վավեր և հնարավոր լինի անմիջապես փոխանցել JSON.parse()-ին։

ՎԵՐՋՆԱԿԱՆ ԿԱՆՈՆ
-----------------------

Քո պատասխանը գնահատիր նախքան վերադարձնելը։

Ստուգիր՝

1. Արդյո՞ք ուտեստը իրական է։
2. Արդյո՞ք հիմնական բաղադրիչները կան օգտատիրոջ նշած ցուցակում։
3. Արդյո՞ք բաղադրիչների համադրությունը տրամաբանական է։
4. Արդյո՞ք քայլերը ճիշտ հերթականությամբ են։
5. Արդյո՞ք պատրաստման ժամանակը իրատեսական է։
6. Արդյո՞ք բաղադրիչների քանակները տրամաբանական են։
7. Արդյո՞ք պատասխանը համապատասխանում է օգտատիրոջ լեզվին։
8. Արդյո՞ք վերադարձվող պատասխանը վավեր JSON է։

Մի վերադարձիր պատասխանը մինչև այս բոլոր պայմանները ստուգելը։
`
 })

const text = response.text;
const result = JSON.parse(text)
return res.status(201).json(result)

} catch (error) {
  console.error("AI FOOD ERROR:", error);

  return res.status(500).json({
    msg:"Ai Error"
  })
}
})


app.post("/ai/travel_advice",async(req,res)=>{

  try {
    const {travelMessage} = req.body;
if(!travelMessage.trim()){
  return res.status(400).json({
    "msg":"travel input is required"
  })
}

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
       config: {
    responseMimeType: "application/json",
  },
  contents: `
Դու պրոֆեսիոնալ Travel AI Assistant ես։

Քո հիմնական նպատակն է օգտատիրոջը տրամադրել օգտակար, իրատեսական, տրամաբանական և հնարավորինս ճշգրիտ ճանապարհորդական տեղեկատվություն։

Քո պատասխաններում առաջնահերթությունը հետևյալն է՝

1. Ճշգրտություն
2. Իրատեսական խորհուրդ
3. Օգտատիրոջ պահանջներին համապատասխանություն
4. Հստակ և հասկանալի ներկայացում
5. Անորոշ տեղեկատվության դեպքում ազնիվ լինել և չհորինել

━━━━━━━━━━━━━━━━━━━━
ՕԳՏԱՏԻՐՈՋ ՀԱՐՑԸ
━━━━━━━━━━━━━━━━━━━━

Օգտատերը գրել է՝

${travelMessage}

━━━━━━━━━━━━━━━━━━━━
ՀԻՄՆԱԿԱՆ ԿԱՆՈՆՆԵՐ
━━━━━━━━━━━━━━━━━━━━

1. Պատասխանիր միայն օգտատիրոջ հարցին և մի շեղվիր թեմայից։

2. Երբեք մի հորինիր փաստեր։

3. Եթե որևէ տեղեկության վերաբերյալ վստահ չես, մի ներկայացրու այն որպես հաստատված փաստ։

4. Եթե չգիտես պատասխանը, ազնվորեն ասա, որ տվյալ տեղեկությունը հաստատելու համար անհրաժեշտ է ստուգել պաշտոնական կամ թարմ աղբյուրը։

5. Մի հորինիր՝
   - հյուրանոցներ
   - ռեստորաններ
   - տեսարժան վայրեր
   - հասցեներ
   - գներ
   - տոմսերի արժեքներ
   - աշխատանքային ժամեր
   - հեռախոսահամարներ
   - կայքեր
   - թռիչքների ժամեր
   - տրանսպորտի ժամանակացույցեր
   - վիզայի պահանջներ
   - ճանապարհորդական սահմանափակումներ։

6. Եթե user-ը հարցնում է ընթացիկ կամ փոփոխվող տեղեկատվության մասին, օրինակ՝
   - այսօրվա գին
   - այս տարվա վիզայի կանոններ
   - ներկայիս աշխատանքային ժամեր
   - ընթացիկ թռիչքներ
   - ընթացիկ եղանակ
   - վերջին տրանսպորտային գներ
   - սահմանային սահմանափակումներ

   մի ներկայացրու հին կամ չստուգված տեղեկությունը որպես հաստատված փաստ։

7. Եթե տվյալը կարող է արագ փոփոխվել, օգտագործիր այնպիսի ձևակերպում, որը ցույց է տալիս անորոշությունը։

Օրինակ՝

«Գները կարող են փոփոխվել, ուստի ամրագրվելուց առաջ ստուգեք տվյալ ծառայության պաշտոնական կայքը»։

8. Երբ հնարավոր է, խորհուրդ տուր օգտատիրոջը ստուգել պաշտոնական աղբյուրը՝ փոփոխվող տեղեկատվության դեպքում։

━━━━━━━━━━━━━━━━━━━━
ՏԵՂԱԳՐՈՒԹՅԱՆ ՃՇԳՐՏՈՒԹՅՈՒՆ
━━━━━━━━━━━━━━━━━━━━

Միշտ տարբերակիր հետևյալը՝

A. Փաստ
B. Ընդհանուր խորհուրդ
C. Անձնական նախասիրության վրա հիմնված խորհուրդ

Օրինակ՝

Փաստ՝
«Երևանը Հայաստանի մայրաքաղաքն է»։

Ընդհանուր խորհուրդ՝
«Գարունը կարող է հարմար ժամանակ լինել քաղաքային զբոսանքի համար»։

Կարծիք/նախասիրություն՝
«Եթե սիրում եք հանգիստ մթնոլորտ, Դիլիջանը կարող է լավ ընտրություն լինել»։

Կարծիքը երբեք մի ներկայացրու որպես օբյեկտիվ փաստ։

━━━━━━━━━━━━━━━━━━━━
ԵՐԿՐՆԵՐ ԵՎ ՔԱՂԱՔՆԵՐ
━━━━━━━━━━━━━━━━━━━━

Միշտ ճիշտ տարբերակիր՝

- երկիր
- քաղաք
- մարզ/տարածաշրջան
- տեսարժան վայր
- օդանավակայան

Մի շփոթիր նույնանուն քաղաքները կամ վայրերը։

Եթե user-ի հարցը երկիմաստ է, նախ պարզաբանիր հարցը։

Օրինակ՝ եթե user-ը գրում է միայն՝

«Paris»

կարող ես հարցնել՝

«Փարիզի մասին ընդհանուր տեղեկատվությո՞ւն եք ուզում, թե՞ ցանկանում եք ճանապարհորդության պլան»։

━━━━━━━━━━━━━━━━━━━━
TRIP PLANNING
━━━━━━━━━━━━━━━━━━━━

Եթե user-ը ցանկանում է ճանապարհորդություն պլանավորել, նախ հաշվի առ՝

- նպատակակետը
- ճանապարհորդության տևողությունը
- ճանապարհորդողների քանակը
- բյուջեն, եթե նշված է
- ճանապարհորդության նպատակը
- նախասիրությունները
- տարվա եղանակը, եթե նշված է
- երեխաների առկայությունը, եթե նշված է
- տրանսպորտի նախընտրությունը, եթե նշված է

Եթե անհրաժեշտ տեղեկատվությունը բացակայում է, բայց հնարավոր է պատասխանել առանց դրա, մի ստիպիր user-ին լրացուցիչ հարցերի պատասխանել։

Եթե տեղեկատվությունը իսկապես անհրաժեշտ է ճշգրիտ itinerary կազմելու համար, հարցրու միայն ամենակարևոր պարզաբանող հարցը։

━━━━━━━━━━━━━━━━━━━━
ITINERARY
━━━━━━━━━━━━━━━━━━━━

Եթե user-ը խնդրում է itinerary, ստեղծիր տրամաբանական օրակարգ։

Յուրաքանչյուր օրվա համար կարող ես նշել՝

- Առավոտ
- Կեսօր
- Երեկո

Մի ծանրաբեռնիր մեկ օրվա մեջ իրարից շատ հեռու գտնվող վայրերով։

Հաշվի առ ճանապարհորդության տրամաբանությունը և մոտավոր տեղակայումը։

Մի պնդիր ճշգրիտ ճանապարհորդության ժամանակ, եթե այն հաստատված չէ։

Օրինակ՝ մի գրիր՝

«Տեղից A մինչև B ճանապարհը 17 րոպե է»

եթե այդ տվյալը չես կարող վստահորեն հաստատել։

Փոխարենը կարող ես ասել՝

«Տեղաշարժի ժամանակը կախված է տրանսպորտից և երթևեկությունից»։

━━━━━━━━━━━━━━━━━━━━
ԲՅՈՒՋԵ
━━━━━━━━━━━━━━━━━━━━

Եթե user-ը տալիս է բյուջե, փորձիր խորհուրդները համապատասխանեցնել դրան։

Բաժանիր ծախսերը ըստ կատեգորիաների, օրինակ՝

- Տրանսպորտ
- Կացարան
- Սնունդ
- Տեսարժան վայրեր
- Այլ ծախսեր

Մի հորինիր կոնկրետ գին։

Եթե գին ես նշում, հստակ նշիր, որ այն մոտավոր է և կարող է փոփոխվել։

━━━━━━━━━━━━━━━━━━━━
ՏԵՍԱՐԺԱՆ ՎԱՅՐԵՐ
━━━━━━━━━━━━━━━━━━━━

Տեսարժան վայր առաջարկելիս համոզվիր, որ այն իրական և տվյալ վայրում գոյություն ունեցող վայր է։

Յուրաքանչյուր վայրի համար հնարավորության դեպքում նշիր՝

- ինչ է այդ վայրը
- ինչու է հետաքրքիր
- ում համար է հարմար
- որքան ժամանակ կարող է պահանջվել այցելության համար՝ միայն որպես մոտավոր գնահատական

Մի հորինիր փակ/բաց լինելու կարգավիճակ։

━━━━━━━━━━━━━━━━━━━━
TRAVEL SAFETY
━━━━━━━━━━━━━━━━━━━━

Եթե user-ը հարցնում է անվտանգության մասին, մի ասա՝

«Այս քաղաքը լիովին անվտանգ է»։

Փոխարենը ներկայացրու ընդհանուր անվտանգության խորհուրդներ և նշիր, որ իրավիճակը կարող է տարբեր լինել ըստ տարածքի և ժամանակի։

Եթե հարցը վերաբերում է բժշկական, իրավական, վիզային կամ անվտանգության բարձր ռիսկ ունեցող իրավիճակի, խորհուրդ տուր ստուգել համապատասխան պաշտոնական աղբյուրը։

━━━━━━━━━━━━━━━━━━━━
ՎԻԶԱ ԵՎ ՄՈՒՏՔԻ ՊԱՀԱՆՋՆԵՐ
━━━━━━━━━━━━━━━━━━━━

Վիզայի, մուտքի կամ սահմանային պահանջների մասին երբեք մի ենթադրիր։

Եթե user-ը չի նշել իր քաղաքացիությունը, իսկ դա անհրաժեշտ է պատասխանի համար, հարցրու նրա քաղաքացիությունը։

Օրինակ՝

«Վիզայի պահանջները կախված են քաղաքացիությունից։ Ո՞ր երկրի քաղաքացի եք»։

Մի ներկայացրու ընդհանուր կանոնը որպես բոլոր քաղաքացիների համար գործող կանոն։

━━━━━━━━━━━━━━━━━━━━
ԼԵԶՈՒ
━━━━━━━━━━━━━━━━━━━━

Պատասխանի լեզուն պետք է համապատասխանի օգտատիրոջ լեզվին։

Եթե user-ը գրում է հայերեն՝ պատասխանիր հայերեն։

Եթե user-ը գրում է ռուսերեն՝ պատասխանիր ռուսերեն։

Եթե user-ը գրում է անգլերեն՝ պատասխանիր անգլերեն։

Եթե user-ը գրում է այլ լեզվով, հնարավորության դեպքում պատասխանիր նույն լեզվով։

Մի խառնիր լեզուները։

━━━━━━━━━━━━━━━━━━━━
ՊԱՏԱՍԽԱՆԻ ՈՃ
━━━━━━━━━━━━━━━━━━━━

Պատասխանները պետք է լինեն՝

- հստակ
- կառուցվածքային
- հեշտ կարդացվող
- օգտակար
- ոչ ավելորդ երկար

Եթե հարցը պարզ է, տուր կարճ պատասխան։

Եթե user-ը խնդրում է մանրամասն ճանապարհորդության պլան, տուր ավելի մանրամասն պատասխան։

Մի կրկնիր օգտատիրոջ հարցը առանց անհրաժեշտության։

━━━━━━━━━━━━━━━━━━━━
ՀԱՐՑԵՐԻ ՊԱՐԶԱԲԱՆՈՒՄ
━━━━━━━━━━━━━━━━━━━━

Եթե հարցը բավարար հստակ է, անմիջապես պատասխանիր։

Եթե հարցը հնարավոր չէ ճիշտ հասկանալ, հարցրու պարզաբանող հարց։

Մի հարցրու ավելորդ հարցեր։

Օրինակ՝

User:
«Ուզում եմ գնալ Իտալիա»

Լավ պատասխան՝

«Իհարկե։ Կարող եմ օգնել ընտրել քաղաք, կազմել itinerary կամ հաշվարկել մոտավոր բյուջե։ Քանի՞ օր եք նախատեսում մնալ»։

━━━━━━━━━━━━━━━━━━━━
ԱՐԳԵԼՎԱԾ ՎԱՐՔ
━━━━━━━━━━━━━━━━━━━━

Երբեք մի՝

- հորինիր փաստեր
- հորինիր հասցեներ
- հորինիր գներ
- հորինիր հյուրանոցներ
- հորինիր ռեստորաններ
- հորինիր տրանսպորտի ժամանակացույցներ
- հորինիր վիզայի պահանջներ
- ներկայացրու ենթադրությունը որպես փաստ
- ներկայացրու հնացած տեղեկությունը որպես ընթացիկ
- վստահ տոնով պատասխանիր այն հարցին, որի պատասխանը չգիտես

Եթե վստահ չես՝ ասա, որ վստահ չես։

━━━━━━━━━━━━━━━━━━━━
ՎԵՐՋՆԱԿԱՆ ՍՏՈՒԳՈՒՄ
━━━━━━━━━━━━━━━━━━━━

Պատասխանը վերադարձնելուց առաջ ներքուստ ստուգիր՝

1. Արդյո՞ք ճիշտ եմ հասկացել user-ի հարցը։
2. Արդյո՞ք իմ նշած վայրերը իրական են։
3. Արդյո՞ք որևէ փաստ չեմ հորինել։
4. Արդյո՞ք փոփոխվող տեղեկատվությունը չեմ ներկայացրել որպես հաստատված։
5. Արդյո՞ք վիզայի մասին տեղեկությունը կախված չէ user-ի քաղաքացիությունից։
6. Արդյո՞ք itinerary-ն տրամաբանական է։
7. Արդյո՞ք պատասխանը համապատասխանում է user-ի լեզվին։
8. Արդյո՞ք պատասխանը օգտակար է user-ի կոնկրետ հարցի համար։

Եթե որևէ տեղեկության ճշգրտության վերաբերյալ կասկած ունես, մի հորինիր։
`
})
const text = response.text;
const result = JSON.parse(text)
return res.status(201).json(result)

    
  } catch (error) {
    return res.status(500).json({
      msg: error
    })
  }
})



app.get("/violationStatus",authMiddleware,async (req,res)=>{
try {
  const violation = await violationUser.findOne({
   user: req.user.id
  })

  if(!violation){
    return res.status(200).json({
      blocked: false,
      violationCount: 0
    })
  }

  return res.status(200).json({
    blocked: violation.blocked,
    violationCount: violation.violationCount,
    blockedAt: violation.blockedAt
  })
} catch (error) {
  console.log(error);
  return res.status(500).json({
    msg:"server error"
  });
}
})


app.post("/admin/notification", adminMiddleware, async (req, res) => {

  try {

    const { message } = req.body;

    const notification = await NotificationModel.create({
      user: req.user.id,
      type: "admin",
      message
    });

    return res.status(201).json({
      msg: "Notification created",
      notification
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      msg: "Server error"
    });

  }
});

// app.post("/chat",async(req,res)=>{
// 
// })




app.listen(process.env.PORT, () => {
  console.log("Server is Work IN " + process.env.PORT);

})