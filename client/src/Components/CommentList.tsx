import { useEffect, useState } from "react";
import "./commnentList.scss"
interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    username: string;
    image?:string
  }| null;
}

interface PropsPostID {
  postId: string;
}

const CommentList = ({ postId }: PropsPostID) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async () => {
      const response = await fetch(`http://localhost:3000/comment/post/${postId}`);

      const data = await response.json();
      setComments(data.comments);
    };

    getComments();
  }, [postId]);

  return (
    <>
      {comments.map((comment) => (
        <div key={comment._id} className="comment-card">
          <div className="comment-header">
            <img className="avatar" src={comment.user?.image} alt="" />

            <div className="user-info">
              <h4>{comment.user?.username || "Unknown User"}</h4>
              <span>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="comment-text">
            {comment.text}
          </p>
        </div>
      ))}
    </>
  );
};

export default CommentList;