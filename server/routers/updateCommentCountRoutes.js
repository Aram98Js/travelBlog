
import express from "express";
import updateCommentStatus from "../controllers/updatedCommentCount.js";
import adminMiddleware from "../auth/adminMiddleware.js";

const updateCommentRouter = express.Router()
updateCommentRouter.patch("/admin/comments/:commentId",adminMiddleware,updateCommentStatus);

export default updateCommentRouter