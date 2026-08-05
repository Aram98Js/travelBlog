import express from "express";
import upload from "../middleware/upload.js";
import patchTravelPost from "../controllers/patchTravelController.js";


const routerTravelPatch = express.Router();
routerTravelPatch.patch("/travel/:id",upload.single("image"), patchTravelPost);
export default routerTravelPatch