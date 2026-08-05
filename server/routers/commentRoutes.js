import express from "express";
import commentController from "../controllers/commentController.js";
import authMiddleware from "../auth/authMiddleware.js";

const commentRouter = express.Router();
commentRouter.post(
    "/post/:postId",
    authMiddleware,
    commentController
);


export default commentRouter;