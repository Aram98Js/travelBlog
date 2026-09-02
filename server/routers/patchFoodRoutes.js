import express from "express";
import upload from "../middleware/upload.js";
import patchFoodPost from "../controllers/patchFoodController.js";
import adminMiddleware from "../auth/adminMiddleware.js";



const routerFoodPatch = express.Router();
routerFoodPatch.patch("/food/:id",upload.single("image"), adminMiddleware ,patchFoodPost);
export default routerFoodPatch;