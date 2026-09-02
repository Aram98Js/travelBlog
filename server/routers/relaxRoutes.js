import express from "express";
import deleteRelaxPost from "../controllers/deleteRelaxPost.js";
import adminMiddleware from "../auth/adminMiddleware.js";
const routerRelaxDelete = express.Router();
routerRelaxDelete.delete("/relax/:id", adminMiddleware ,deleteRelaxPost);
export default routerRelaxDelete;