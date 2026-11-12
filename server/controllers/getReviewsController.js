import mongoose from "mongoose";
import Review from "../models/Review.js";

const getReviewsController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postModel } = req.query;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        msg: "Invalid post ID"
      });
    }

    if (!["Travel", "Food", "Relax"].includes(postModel)) {
      return res.status(400).json({
        msg: "Invalid post model"
      });
    }

    const reviews = await Review.find({
      post: postId,
      postModel
    })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    const averageRating =
      totalReviews > 0
        ? Number((totalRating / totalReviews).toFixed(1))
        : 0;

    return res.status(200).json({
      reviews,
      totalReviews,
      averageRating
    });

  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      msg: "Internal server error"
    });
  }
};

export default getReviewsController;