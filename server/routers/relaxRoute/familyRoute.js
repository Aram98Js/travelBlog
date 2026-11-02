import express from 'express'
import familyController from '../../controllers/relax-controller/famillyController.js';

 const familyRouter = express.Router();
 familyRouter.post("/ai/relax/family",familyController)

 export default familyRouter