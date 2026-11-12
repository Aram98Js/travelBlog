import Review from "../models/Review.js";

const addReviewController = async (req, res) => {
  try {
    const { rating, text, postModel } = req.body;
    const { postId } = req.params;

    if (
      !["Travel", "Food", "Relax"].includes(postModel) ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      typeof text !== "string" ||
      !text.trim()
    ) {
      return res.status(400).json({
        msg: "Invalid review data"
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      post: postId,
      postModel
    });

    if (existingReview) {
      return res.status(409).json({
        msg: "You already reviewed this post"
      });
    }

    const newReview = await Review.create({
      user: req.user.id,
      post: postId,
      postModel,
      rating,
      text: text.trim()
    });

    return res.status(201).json({
      msg: "Review created successfully",
      newReview
    });

  } catch (error) {
    console.error("Review error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        msg: "You already reviewed this post"
      });
    }

    return res.status(500).json({
      msg: "Internal server error"
    });
  }
};

export default addReviewController;