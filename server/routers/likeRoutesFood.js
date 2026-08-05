import express from "express";
import patchLikeFood from "../controllers/likeFoodController.js";


const routerFoodLikePatch = express.Router();
routerFoodLikePatch.patch("/Food/:id/like", patchLikeFood);
export default routerFoodLikePatch;