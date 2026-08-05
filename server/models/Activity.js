import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({

    action:{
        type:String
    },

    type:{
        type:String
    },

    title:{
        type:String
    },
},
{
    timestamps:true
}
)


const ActivityModel = mongoose.model("Activity",activitySchema)
 export default ActivityModel;