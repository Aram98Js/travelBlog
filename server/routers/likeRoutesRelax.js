import express from "express";
import likeRelaxPatch from "../controllers/likeRelaxController.js";
import authMiddleware from "../auth/authMiddleware.js";


const routerRelaxLikePatch = express.Router();
routerRelaxLikePatch.patch("/Relax/:id/like", authMiddleware,likeRelaxPatch);
export default routerRelaxLikePatch;