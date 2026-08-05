import jwt from "jsonwebtoken";

function adminMiddleware(req,res,next){
try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
          msg: "Authorization header missing"

        })
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg:"token missing"
        })
    }
    const decoded = jwt.verify(
        token,
        process.env.ADMIN_SECRET
    )

    if (decoded.role !=="admin") {
        return res.status(403).json({
            msg:"access denied"
        })
    }
    req.user = decoded;
    next()
} catch (error) {
        return res.status(401).json({
            msg:"Invalid token"
        });
}
}

export default adminMiddleware