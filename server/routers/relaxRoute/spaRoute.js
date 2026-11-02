import express from 'express'
import spaController from '../../controllers/relax-controller/spaController.js';

 const spaRouter = express.Router();
 spaRouter.post("/ai/relax/spa",spaController)

 export default spaRouter