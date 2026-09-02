
import express from "express";
import upload from "../middleware/upload.js";
import addFoodAction from "../controllers/addFoodController.js";
import adminMiddleware from "../auth/adminMiddleware.js";
const routerFoodAdd = express.Router();
routerFoodAdd.post("/food",upload.single("image"),adminMiddleware,addFoodAction);
export default routerFoodAdd;