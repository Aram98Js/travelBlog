import mongoose from "mongoose";

const savedPlaceSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);


savedPlaceSchema.index(
  { user: 1, post: 1, postModel: 1 },
  { unique: true }
);

const SavedPlace = mongoose.model(
  "SavedPlace",
  savedPlaceSchema
);

export default SavedPlace;