import express from "express";
import upload from "../middleware/upload.js";
import addTravelAction from "../controllers/addTravelController.js";


const routerTravelAdd = express.Router();
routerTravelAdd.post("/travel",upload.single("image"), addTravelAction);
export default routerTravelAdd;