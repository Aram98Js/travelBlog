import express from "express";
import patchTravelLike from "../controllers/likeTravelController.js";

const routerTravelLikePatch = express.Router();
routerTravelLikePatch.patch("/Travel/:id/like", patchTravelLike);
export default routerTravelLikePatch;