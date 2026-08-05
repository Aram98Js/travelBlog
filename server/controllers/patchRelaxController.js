import ActivityModel from "../models/Activity.js";
import Relax from "../models/Relax.js"



const patchRelaxPost = async (req,res)=>{

    try {
        const updateRelaxPost = await Relax.findByIdAndUpdate( 
    req.params.id,
      {
            title:req.body.title,
            short_description:req.body.short_description,
            description:req.body.description,
            image:req.file ? req.file.path : ""
        },
      { new: true }
);
if (!updateRelaxPost) {
    return res.status(404).json({
        "msg": "No found"
    })
}

    const activity = await ActivityModel.create({
        action:"Updated",
        type:"Relax",
        title:updateRelaxPost.title
    });
return res.status(201).json({
    updateRelaxPost
})

} catch (error) {
            return res.status(500).json({
            msg: "Server error"
        });  
    }
}
export default patchRelaxPost