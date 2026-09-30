import express from "express";
import upload from "../middleware/upload.js";
import addTravelAction from "../controllers/addTravelController.js";
import adminMiddleware from "../auth/adminMiddleware.js";


const routerTravelAdd = express.Router();
routerTravelAdd.post("/travel",adminMiddleware,upload.single("image"),addTravelAction);
export default routerTravelAdd;