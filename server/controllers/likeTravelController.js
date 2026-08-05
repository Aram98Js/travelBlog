import Travel from "../models/Travel.js";

const patchTravelLike = async (req, res) => {
try {
      const post = await Travel.findByIdAndUpdate(
        req.params.id,
        {$inc:{likesCount: 1}},
        {new: true}
    );

    if (!post) {
        return res.status(404).json({
            msg: "Post not found"
        });
    }



    return res.status(200).json(post);
} catch (error) {
     return res.status(404).json({
        "msg":"Post Not Found"
    })
}
  
};

export default patchTravelLike;