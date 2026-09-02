import express from "express";
import patchTravelLike from "../controllers/likeTravelController.js";
import authMiddleware from "../auth/authMiddleware.js";

const routerTravelLikePatch = express.Router();
routerTravelLikePatch.patch("/Travel/:id/like",authMiddleware,patchTravelLike);
export default routerTravelLikePatch;