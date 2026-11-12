

import express from 'express';
import authMiddleware from '../auth/authMiddleware.js';
import getPostDetailsController from '../controllers/GetPostDetailsController.js';

const getPostDetailRouter = express.Router();
getPostDetailRouter.get("/posts/:category/:id",getPostDetailsController);
export default getPostDetailRouter