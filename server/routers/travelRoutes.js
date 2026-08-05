import express from "express";
import deleteTravelPost from "../controllers/deleteTravelPost.js";
const routerTravelDelete = express.Router();
routerTravelDelete.delete("/travel/:id", deleteTravelPost);
export default routerTravelDelete;