import ActivityModel from "../models/Activity.js";
import Food from "../models/Food.js";




const patchFoodPost = async (req,res)=>{
const oldFood = await Food.findById(req.params.id);

if (!oldFood) {
  return res.status(404).json({
    msg: "Food not found"
  });
}
    try {
        const updateFoodPost = await Food.findByIdAndUpdate( 
    req.params.id,
      {
            title:req.body.title,
            short_description:req.body.short_description,
            description:req.body.description,
            rating: req.body.rating,
            location: JSON.parse(req.body.location),
            image:req.file ? req.file.path : oldFood.image
        },
      { new: true }
);
if (!updateFoodPost) {
    return res.status(404).json({
        "msg": "No found"
    })
}

    const activity = await ActivityModel.create({
        action:"Updated",
        type:"Food",
        title:updateFoodPost.title
    });
return res.status(201).json({
    updateFoodPost
})

} catch (error) {
            return res.status(500).json({
            msg: "Server error"
        });  
    }
}
export default patchFoodPost