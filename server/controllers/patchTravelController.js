import ActivityModel from "../models/Activity.js";
import Travel from "../models/Travel.js";




const patchTravelPost = async (req,res)=>{

    try {
        const updateTravelPost = await Travel.findByIdAndUpdate( 
    req.params.id,
      {
            title:req.body.title,
            short_description:req.body.short_description,
            description:req.body.description,
            image:req.file ? req.file.path : ""
        },
      { new: true }
);
if (!updateTravelPost) {
    return res.status(404).json({
        "msg": "No found"
    })
}

    const activity = await ActivityModel.create({
        action:"Updated",
        type:"Travel",
        title:updateTravelPost.title
    });
return res.status(201).json({
    updateTravelPost
})

} catch (error) {
            return res.status(500).json({
            msg: "Server error"
        });  
    }
}
export default patchTravelPost