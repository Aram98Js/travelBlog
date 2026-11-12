import express from "express"
import authMiddleware from "../auth/authMiddleware.js";
import ProfileStatsController from "../controllers/ProfileStatsController.js";

const profileStatRouter = express.Router();
profileStatRouter.get("/profile/stats",authMiddleware,ProfileStatsController);
export default profileStatRouter