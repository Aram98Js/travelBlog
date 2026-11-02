import express from 'express'
import natureController from '../../controllers/relax-controller/natureController.js';

 const natureRouter = express.Router();
 natureRouter.post("/ai/relax/nature",natureController)

 export default natureRouter