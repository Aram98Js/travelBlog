import activityModel from "../models/Activity.js";
import Food from "../models/Food.js";




const  deleteFoodPost = async (req,res)=>{
    try {
        const deletedPost = await Food.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({
                "message":"notFound"
            })
        }

      const newActiveFoodDeleting=  await activityModel.create({
            postId: deletedPost._id,
            action:"Deleted",
            type:"Food",
            title: deletedPost.title
        })

        return res.status(200).json({
            "msg":"Deleted",
            newActiveFoodDeleting
        })
    } catch (error) {
        return res.status(500).json({
      message: "Server error"
    });
    }
}

export default deleteFoodPost