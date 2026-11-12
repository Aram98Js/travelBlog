import Review from "../models/Review.js";
import SavedPlace from "../models/SavedPlace.js";
import saveModel from "../models/SavePosts.js";
import Trip from "../models/Trip.js";


const ProfileStatsController = async(req,res)=>{
try {
    const userId = req.user.id
      const [trips, reviews, savedPlaces] = await Promise.all([
      Trip.countDocuments({ user: userId }),
      Review.countDocuments({ user: userId }),
      saveModel.countDocuments({ user: req.user.id })
    ]);
        return res.status(200).json({
      trips,
      reviews,
      savedPlaces
    });
} catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Internal server error"
    }); 
}
}

export default ProfileStatsController