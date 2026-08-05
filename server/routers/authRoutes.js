import express from "express";

import {
    userRegister,
    userLogin
} from "../controllers/authController.js";

import {
    registerValidator,
    loginValidator
} from "../validators/authValidator.js";

import validate from "../middleware/validate.js";

const router = express.Router();



router.post(
    "/register",
    registerValidator,
    validate,
    userRegister
);



router.post(
    "/login",
    loginValidator,
    validate,
    userLogin
);
