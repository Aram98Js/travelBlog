import express from "express";
import upload from "../middleware/upload.js";
import patchFoodPost from "../controllers/patchFoodController.js";



const routerFoodPatch = express.Router();
routerFoodPatch.patch("/food/:id",upload.single("image"), patchFoodPost);
export default routerFoodPatch;