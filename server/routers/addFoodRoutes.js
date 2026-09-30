
import express from "express";
import upload from "../middleware/upload.js";
import addFoodAction from "../controllers/addFoodController.js";
import adminMiddleware from "../auth/adminMiddleware.js";
const routerFoodAdd = express.Router();
routerFoodAdd.post("/food",adminMiddleware,upload.single("image"),addFoodAction);
export default routerFoodAdd;