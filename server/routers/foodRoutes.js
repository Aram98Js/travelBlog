import express from "express";
import deleteFoodPost from "../controllers/deleteFoodPost.js";
const routerFoodDelete = express.Router();
routerFoodDelete.delete("/food/:id", deleteFoodPost);
export default routerFoodDelete;

