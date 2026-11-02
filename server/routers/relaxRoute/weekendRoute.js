import express from 'express'
import weekendController from '../../controllers/relax-controller/weekendController.js';

 const weekendRouter = express.Router();
 weekendRouter.post("/ai/relax/weekend",weekendController)

 export default weekendRouter