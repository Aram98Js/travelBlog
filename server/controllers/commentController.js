import commentModel from "../models/comment.js";
import Food from "../models/Food.js";
import Relax from "../models/Relax.js";
import Travel from "../models/Travel.js";


const commentController = async (req,res)=>{

    try {

        const {text,category} = req.body;
        const {postId} = req.params;
        const newComment = await commentModel.create({
            user:req.user.id,
            post:postId,
            text,
          category
        });

       switch (category) {
        case "Travel":
            await Travel.findByIdAndUpdate(postId,{
                $inc:{
                    commentCount: 1
                },
            
            })
            break;
       
        case "Food":
            await Food.findByIdAndUpdate(postId,{
                $inc:{
                    commentCount: 1
                },
            
            })
            break;
        case "Relax":
            await Relax.findByIdAndUpdate(postId,{
                $inc:{
                    commentCount: 1
                },
            
            })
            break;
       
        default:
            break;
       }

  

        return res.status(201).json({
            newComment
        });
    } catch(error) {

        return res.status(500).json({
            message:error.message
        });

    }

}


export default commentController;