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
import settingModel from './models/SettingsSchema.js';
import ai from './config/gemini.js';

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
app.use(updateCommentRouter)

//mongoose connection
mongoose.connect(process.env.MONGOOSE_URI)














app.post("/userRegister",upload.single("image"),registerValidator,validate,
  async (req, res) => {
    console.log("REGISTER START");

    try {
      const {
        username,
        email,
        password,
        gender,
    
      } = req.body;
const birthDate = JSON.parse(req.body.birthDate);
      const hashPass = await bcrypt.hash(password, 10);


  if(password.length < 8){
    return res.status(409).json({
      path:"password",
      msg:"password is too short"
    })
  }

const existingUser = await User.findOne({username});

if(existingUser){
    const errorResponse = {
        test: "HELLO_FROM_register",
        path: "username",
        msg: "username already exists"
    };
    console.log(errorResponse);
    
  return res.status(409).json(errorResponse)
}

const existingEmail = await User.findOne({ email });

if (existingEmail) {
    const errorResponse = {
        test: "HELLO_FROM_register",
        path: "email",
        msg: "Email already exists"
    };
       console.log(errorResponse)
    return res.status(409).json(errorResponse);
}

      const newUser = {
        username,
        email,
        password: hashPass,
        gender,
        birthDate,
        image: req.file?.path ||""
      };
      const createdUser = await User.create(newUser);

      const notificationed = await NotificationModel.create({
        user: createdUser._id,
        message: "is Registered",
        isRead: false,
        notificationCount: 1
      });

      const unreadCount = await NotificationModel.countDocuments({
        user: createdUser._id,
        isRead: false
      });

      return res.status(201).json({
        createdUser,
        notificationed,
        unreadCount
      });

    } catch (error) {
      console.log("REGISTER ERROR:", error);

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

app.get("/profile", authMiddleWare, async (req, res) => {


  try {
    const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({
    "msg":"User NOt Found"
  })
}

  console.log(req.user);
  res.json({
    user
  })

  } catch (error) {
     return res.status(500).json({
      msg: error.message
    });
  }
  
})


app.patch("/profile", authMiddleWare, upload.single("image"), async (req, res) => {
  try {
    const { username, email } = req.body;

    const updateData = {};
     console.log("FILE:", req.file);
    if (username) {
      updateData.username = username;
    }

    if (email) {
      updateData.email = email;
    }
if (req.file){
  updateData.image = req.file.path
}
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
     { returnDocument: "after" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    return res.json({
      updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
})



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



app.post("/save_post/:category/:id",authMiddleWare,async(req,res)=>{

  try {
    const {category,id} = req.params;
    let post;
  if (category === "Travel") {
    post = await Travel.findById(id);
  }
  if (category === "Food") {
    post = await Food.findById(id);
  }
  if (category === "Relax") {
    post = await Relax.findById(id);
  }

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }
   const savedPosts = await saveModel.create({
      user: req.user.id,
      post:post._id,
      category: category
    }
    )

  return res.status(201).json({
    post,
    savedPosts
  })
  } catch (error) {
    return res.status(500).json({
      msg: "Server error"
    });
  }
  
})




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



app.post("/ai/check", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
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
${message}
      `,
    });

    const text = response.text;

    const result = JSON.parse(text);

    return res.status(200).json({
      violation: result.violation,
      message: result.message,
      result: result.result
    });

  } catch (error) {
    console.log("GEMINI ERROR:", error);

    return res.status(500).json({
      message: "AI error"
    });
  }
});



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