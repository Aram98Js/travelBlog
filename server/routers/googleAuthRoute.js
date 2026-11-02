import express from "express";
import googleAuthController from "../controllers/googleAuthController.js";

const googleAouthRouter = express.Router();

googleAouthRouter.post("/auth/google", googleAuthController);

export default googleAouthRouter;