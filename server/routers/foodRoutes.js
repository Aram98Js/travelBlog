import express from "express";
import deleteFoodPost from "../controllers/deleteFoodPost.js";
import adminMiddleware from "../auth/adminMiddleware.js";
const routerFoodDelete = express.Router();
routerFoodDelete.delete("/food/:id", adminMiddleware,deleteFoodPost);
export default routerFoodDelete;

