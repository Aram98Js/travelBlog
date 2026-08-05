import activityModel from "../models/Activity.js";
import Travel from "../models/Travel.js";



const  deleteTravelPost = async (req,res)=>{
    try {
        const deletedPost = await Travel.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({
                "message":"notFound"
            })
        }

      const newActiveTravelDeleting=  await activityModel.create({
         postId: deletedPost._id,
            action:"Deleted",
            type:"Travel",
            title: deletedPost.title
        })

        return res.status(200).json({
            "msg":"Deleted",
            newActiveTravelDeleting
        })
    } catch (error) {
        return res.status(500).json({
      message: "Server error"
    });
    }
}

export default deleteTravelPost