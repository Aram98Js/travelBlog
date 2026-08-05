import express from "express";
import deleteRelaxPost from "../controllers/deleteRelaxPost.js";
const routerRelaxDelete = express.Router();
routerRelaxDelete.delete("/relax/:id", deleteRelaxPost);
export default routerRelaxDelete;