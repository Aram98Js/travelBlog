import express from "express";

import {
    adminRegister,
    adminLogin,
    getAdminDashboard
} from "../controllers/adminController.js";


import adminMiddleware from "../auth/adminMiddleware.js";


const admin_router = express.Router();



// Create admin
admin_router.post(
    "/adminRegister",
    adminRegister
);



// Admin login
admin_router.post(
    "/adminLogin",
    adminLogin
);



// Admin protected route
admin_router.get(
    "/dashboard",
    adminMiddleware,
    getAdminDashboard
);



export default admin_router;