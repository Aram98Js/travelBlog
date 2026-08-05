import express from "express";
import upload from "../middleware/upload.js";
import patchRelaxPost from "../controllers/patchRelaxController.js";



const routerRelaxPatch = express.Router();
routerRelaxPatch.patch("/relax/:id",upload.single("image"), patchRelaxPost);
export default routerRelaxPatch;