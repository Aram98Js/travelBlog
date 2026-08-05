import Travel from "../models/Travel.js"
import Food from "../models/Food.js"
import Relax from "../models/Relax.js"
import ActivityModel from "../models/Activity.js"

const getDashboard = async (req, res) => {
const [
latestTravel,
latestFood,
latestRelax,

travelCount,
foodCount,
relaxCount,

activity
] = await Promise.all([

Travel.find()
.sort({_id:-1})
.limit(5),

Food.find()
.sort({_id:-1})
.limit(10),

Relax.find()
.sort({_id:-1})
.limit(8),

Travel.countDocuments(),

Food.countDocuments(),

Relax.countDocuments(),


ActivityModel.find()
.sort({_id:-1})
.limit(10)

])



const totalPosts =
    travelCount +
    foodCount +
    relaxCount;


return res.status(200).json({

    totalPosts,

    stats:{
        travel:travelCount,
        food:foodCount,
        relax:relaxCount
    },


    posts:{
        travel:latestTravel,
        food:latestFood,
        relax:latestRelax
    },


    activity:activity

});

}

export default getDashboard