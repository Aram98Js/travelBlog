
import express from "express";
import upload from "../middleware/upload.js";
import addRelaxAction from "../controllers/addRelaxController.js";

const routerRelaxAdd = express.Router();
routerRelaxAdd.post("/relax",upload.single("image"), addRelaxAction);
export default routerRelaxAdd;