
import express from "express";
import upload from "../middleware/upload.js";
import addRelaxAction from "../controllers/addRelaxController.js";
import adminMiddleware from "../auth/adminMiddleware.js";

const routerRelaxAdd = express.Router();
routerRelaxAdd.post("/relax",adminMiddleware,upload.single("image"),addRelaxAction);
export default routerRelaxAdd;