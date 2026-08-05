
import express from "express";
import upload from "../middleware/upload.js";
import addFoodAction from "../controllers/addFoodController.js";
const routerFoodAdd = express.Router();
routerFoodAdd.post("/food",upload.single("image"), addFoodAction);
export default routerFoodAdd;