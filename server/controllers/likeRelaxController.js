import Relax from "../models/Relax.js"


 
 const likeRelaxPatch = async (req,res)=>{

    try {
        const post = await Relax.findByIdAndUpdate(
    req.params.id,
       {$inc:{likesCount: 1}},
          { new: true }
);
if (!post) {
    return res.status(404).json({
        "msg":"Post Not Found"
    })
}

return res.status(200).json(post)
    
} catch (error) {
   return res.status(500).json({
            msg: "Server Error"
        }); 
}

 }

 export default likeRelaxPatch