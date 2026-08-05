import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import fs from "fs"
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
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

//for delete
app.use("/admin",routerFoodDelete)
app.use("/admin",routerRelaxDelete)
app.use("/admin",routerTravelDelete)

app.use(admin_router)

app.use("/admin/dashboard",routerDashBoard);

//for adding actions
app.use("/admin",routerFoodAdd)
app.use("/admin",routerRelaxAdd)
app.use("/admin",routerTravelAdd)

//For changing actions 
app.use("/admin", routerRelaxPatch);
app.use("/admin", routerFoodPatch);
app.use("/admin", routerTravelPatch);


//for like
app.use("/admin",routerTravelLikePatch)
app.use("/admin",routerFoodLikePatch)
app.use("/admin",routerRelaxLikePatch)


//for comment
app.use("/comment", commentRouter);


//for view count

app.use(patchCountRouter)

//mongoose connection
mongoose.connect(process.env.MONGOOSE_URI)

app.post("/userRegister",  registerValidator,
validate,  async (req, res) => {
  const { username, email, password } = req.body
  const hashPass = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    email,
    password: hashPass
  }

  await User.create(newUser);
  return res.json({
    newUser
  })
})




app.post("/userLogin", loginValidator,
validate, async (req, res) => {

try {

    console.log("LOGIN SECRET: ", process.env.SECRET);

    const { username, password } = req.body;


    const findUser = await User.findOne({ username });


    if (!findUser) {
        return res.status(404).json({
            msg:"User not found"
        });
    }


    const pwd = await bcrypt.compare(
        password,
        findUser.password
    );


    if (!pwd) {
        return res.status(401).json({
            msg:"Wrong Password"
        });
    }


    const token = jwt.sign(
        {
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            role: findUser.role
        },
        process.env.SECRET,
    );


    console.log(
        "USER TOKEN DATA:",
        jwt.decode(token)
    );


    return res.json({
        token
    });


} catch(error) {

    console.log(error);

    return res.status(500).json({
        msg:"Server error"
    });

}

});


app.get("/comment/post/:postId", async(req,res)=>{
  try {
 const postId = req.params.postId;
    const comments = await commentModel.find({
      post:postId
    }).populate("user","username")


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
const allPostTravel = await Travel.find();
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
  const allFoodPost = await Food.find();
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
  const allRelaxPost = await Relax.find();
  if (allRelaxPost.length === 0) {
    return res.status(404).json({
      "msg":"not found"
    })
  }
  return res.status(200).json({
    allRelaxPost
  })
})

app.get("/profile", authMiddleWare, (req, res) => {
  console.log(req.user);
  res.json({
    user: req.user
  })

})










app.get("/admin/dashboard", adminMiddleware, (req, res) => {
  res.json({
    msg: "Welcome admin",
    user: req.user
  });

});








app.get("/admin/foodList", async (req, res) => {
  try {

    const allFoods = await Food.find();


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





app.get("/admin/list_for_travel", async (req, res) => {
  const allTravel = await Travel.find();
  if (allTravel.length === 0) {
    return res.status(404).json({
      "msg": "no "
    })
  }
  return res.json({
    allTravel
  })
})



app.get("/admin/relaxList", async (req, res) => {
  const allRelax = await Relax.find();
  if (allRelax.length === 0) {
    return res.status(404).json({
      "msg": "no "
    })
  }
  return res.json({
    allRelax
  })
})






app.listen(process.env.PORT, () => {
  console.log("Server is Work IN " + process.env.PORT);

})