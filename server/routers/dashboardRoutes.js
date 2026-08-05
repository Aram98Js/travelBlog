import express from "express";
import getDashboard from "../controllers/getDashboard.js";
const routerDashBoard = express.Router();
routerDashBoard.get("/posts",  getDashboard);
export default routerDashBoard;