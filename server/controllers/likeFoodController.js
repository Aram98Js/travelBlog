import Food from "../models/Food.js"

const patchLikeFood = async (req,res)=>{
    try {
        const post = await Food.findByIdAndUpdate(
        req.params.id,
       {$inc:{likesCount: 1}},
          { new: true }
    );
    if (!post) {
        return res.status(404).json({
            msg: "Post not found"
        })
    }
    
    return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({
            msg: "Server Error"
        });

    }
    

}

export default patchLikeFood