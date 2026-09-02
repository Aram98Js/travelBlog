import { validationResult } from "express-validator";

const validate = (req,res,next)=>{

const errors = validationResult(req);
if (!errors.isEmpty()) {
    const error = errors.array()[0]
    return res.status(400).json({
        path: error.path,
        msg: error.msg
    })
}

    next()
}

export default validate