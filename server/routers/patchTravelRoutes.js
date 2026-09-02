import express from "express";
import upload from "../middleware/upload.js";
import patchTravelPost from "../controllers/patchTravelController.js";
import adminMiddleware from "../auth/adminMiddleware.js";


const routerTravelPatch = express.Router();
routerTravelPatch.patch("/travel/:id",upload.single("image"), adminMiddleware,patchTravelPost);
export default routerTravelPatch