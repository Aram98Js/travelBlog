import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Admin Register
export const adminRegister = async (req, res) => {
    try {

        const { username, email, password,birthDate,gender } = req.body;


        const existingAdmin = await User.findOne({
            email
        });


        if (existingAdmin) {
            return res.status(400).json({
                msg: "Admin already exists"
            });
        }


        const hashPass = await bcrypt.hash(password, 10);


        const newAdmin = await User.create({
            username,
            email,
            password: hashPass,
            birthDate,
            gender,
            role: "admin"
        });


        return res.status(201).json({
            msg: "Admin created successfully",

            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });


    } catch (error) {
        console.log("ADMIN REGISTER ERROR",error);
        
        return res.status(500).json({
            msg: "Server error",
                error: error.message
        });

    }
};




// Admin Login
export const adminLogin = async (req, res) => {

    try {
 console.log("ADMIN LOGIN BODY:", req.body);
        const { username, password } = req.body;


        const admin = await User.findOne({
            username,
            role: "admin"
        });


        if (!admin) {
            return res.status(404).json({
                msg: "Admin not found"
            });
        }



        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );


        if (!isMatch) {
            return res.status(401).json({
                msg: "Wrong password"
            });
        }



        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                role: admin.role
            },

            process.env.ADMIN_SECRET,

            {
                expiresIn: "1d"
            }
        );

        console.log("FOUND ADMIN:", admin);
console.log("ADMIN TOKEN DATA:",jwt.decode(token));

        return res.status(200).json({
            token,

            user:{
                username:admin.username,
                role:admin.role
            }
        });



    } catch(error){

        return res.status(500).json({
            msg:"Server error"
        });

    }

};




// Admin Dashboard info
export const getAdminDashboard = async(req,res)=>{

    try {

        return res.status(200).json({
            user:req.user
        });


    } catch(error){

        return res.status(500).json({
            msg:"Server error"
        });

    }

};