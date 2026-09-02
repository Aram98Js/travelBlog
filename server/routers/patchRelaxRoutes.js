import express from "express";
import upload from "../middleware/upload.js";
import patchRelaxPost from "../controllers/patchRelaxController.js";
import adminMiddleware from "../auth/adminMiddleware.js";



const routerRelaxPatch = express.Router();
routerRelaxPatch.patch("/relax/:id",upload.single("image"), adminMiddleware,patchRelaxPost);
export default routerRelaxPatch;