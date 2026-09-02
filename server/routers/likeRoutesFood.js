import express from "express";
import patchLikeFood from "../controllers/likeFoodController.js";
import authMiddleware from "../auth/authMiddleware.js";


const routerFoodLikePatch = express.Router();
routerFoodLikePatch.patch("/Food/:id/like",authMiddleware ,patchLikeFood);
export default routerFoodLikePatch;