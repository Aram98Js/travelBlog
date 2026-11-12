import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "postModel"
    },

    postModel: {
      type: String,
      enum: ["Travel", "Food", "Relax"],
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);


reviewSchema.index(
  { user: 1, post: 1, postModel: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;