import activityModel from "../models/Activity.js";
import Relax from "../models/Relax.js"


const  deleteRelaxPost = async (req,res)=>{
    try {
        const deletedPost = await Relax.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({
                "message":"notFound"
            })
        }

      const newActiveRelaxDeleting =  await activityModel.create({
        postId: deletedPost._id,
            action:"Deleted",
            type:"Relax",
            title: deletedPost.title
        })

        return res.status(200).json({
            "msg":"Deleted",
            newActiveRelaxDeleting
        })
    } catch (error) {
        return res.status(500).json({
      message: "Server error"
    });
    }
}

export default deleteRelaxPost