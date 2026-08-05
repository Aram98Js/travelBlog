import PatchCountController from "../controllers/PatchCountController.js";
import express from 'express'

const patchCountRouter = express.Router();
patchCountRouter.patch("/post/view/:category/:id",PatchCountController);
export default patchCountRouter