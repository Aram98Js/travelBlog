import express from "express";
import likeRelaxPatch from "../controllers/likeRelaxController.js";


const routerRelaxLikePatch = express.Router();
routerRelaxLikePatch.patch("/Relax/:id/like", likeRelaxPatch);
export default routerRelaxLikePatch;