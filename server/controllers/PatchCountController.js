import Food from "../models/Food.js";
import Relax from "../models/Relax.js";
import Travel from "../models/Travel.js";

const PatchCountController = async (req, res) => {
  try {
const {category,id} = req.params;
let Model;


if (category === "Relax") {
    Model = Relax;
    
}
if (category === "Travel") {
    Model = Travel
}if (category === "Food") {
    Model = Food
}

const updated = await Model.findByIdAndUpdate(
    id,
    {
        $inc: {viewsCount: 1}
    },
    {
        returnDocument: "after"
    }
)

if (!Model) {
    return res.status(404).json({
     "msg":"invalid category"
    })
}
  } catch (error) {
    return res.status(500).json({
      msg: "Server error"
    });
  }
};

export default PatchCountController