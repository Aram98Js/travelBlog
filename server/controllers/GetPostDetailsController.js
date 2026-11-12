import mongoose from "mongoose";

import Travel from "../models/Travel.js";
import Food from "../models/Food.js";
import Relax from "../models/Relax.js";

const getPostDetailsController = async (req, res) => {
  try {
    const { category, id } = req.params;

    console.log("CATEGORY:", category);
    console.log("POST ID:", id);

    const models = {
      travel: Travel,
      food: Food,
      relax: Relax
    };

    const Model = models[category?.toLowerCase()];

    if (!Model) {
      return res.status(400).json({
        msg: "Invalid category"
      });
    }

    console.log("MODEL:", Model.modelName);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "Invalid post ID"
      });
    }

    const post = await Model.findById(id).lean();

    console.log("FOUND POST:", post);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }

    return res.status(200).json({
      post
    });

  } catch (error) {
    console.error("POST DETAILS ERROR:", error);

    return res.status(500).json({
      msg: "Internal server error"
    });
  }
};

export default getPostDetailsController;