
import commentModel from "../models/comment.js";
import Travel from "../models/Travel.js";
import Food from "../models/Food.js";
import Relax from "../models/Relax.js";

const updateCommentStatus = async (req, res) => {
  try {

    const { commentId } = req.params;
    const { status } = req.body;

    if (
      status !== "approved" &&
      status !== "rejected"
    ) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const comment = await commentModel.findByIdAndUpdate(
      commentId,
      {
        status
      },
      {
        new: true
      }
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    const approvedCount = await commentModel.countDocuments({
      post: comment.post,
      status: "approved"
    });

    console.log("COMMENT ID:", comment._id);
    console.log("POST ID:", comment.post);
    console.log("CATEGORY:", comment.category);
    console.log("APPROVED COUNT:", approvedCount);


    let updatedPost;


    switch (comment.category) {
      case "Travel":
        updatedPost = await Travel.findByIdAndUpdate(
          comment.post,
          {
            $set: {
              commentCount: approvedCount
            }
          },
          {
            new: true
          }
        );
        break;
      case "Food":
        updatedPost = await Food.findByIdAndUpdate(
          comment.post,
          {
            $set: {
              commentCount: approvedCount
            }
          },
          {
            new: true
          }
        );

        break;


      case "Relax":

        updatedPost = await Relax.findByIdAndUpdate(
          comment.post,
          {
            $set: {
              commentCount: approvedCount
            }
          },
          {
            new: true
          }
        );

        break;


      default:

        return res.status(400).json({
          message: "Invalid category"
        });
    }


    console.log("UPDATED POST:", updatedPost);


    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }


    return res.json({
      message: `Comment ${status}`,
      comment,
      commentCount: approvedCount,
      post: updatedPost
    });

  } catch (error) {

    console.log("UPDATE COMMENT ERROR:", error);

    return res.status(500).json({
      message: error.message
    });

  }
};

export default updateCommentStatus;