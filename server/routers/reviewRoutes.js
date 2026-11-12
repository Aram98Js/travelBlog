import express from "express";
import addReviewController from "../controllers/ReviewController.js";

import getReviewsController from "../controllers/getReviewsController.js";
import authMiddleware from "../auth/authMiddleware.js";

const reviewRouter = express.Router();
const getReviewRouter = express.Router();
reviewRouter.post(
  "/reviews/:postId",
  authMiddleware,
  addReviewController
);
getReviewRouter.get(
  "/reviews/:postId",
  getReviewsController
);

export {reviewRouter,getReviewRouter};