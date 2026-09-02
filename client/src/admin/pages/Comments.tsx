import { Fragment, useEffect, useState } from "react";
import "./Comments.scss";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import adminFetch from "../adminFetch";
import { useNavigate } from "react-router-dom";

type Comment = {
  _id: string;
  text: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;

  user: {
    _id: string;
    username: string;
    image?:string
  };

  post: {
    _id: string;
  };
};

const Comments = () => {
  const {t} = useTranslation()
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate()

  useEffect(()=>{
  const getComments = async () => {
    try {


      const response = await adminFetch("http://localhost:3000/admin/comments",navigate);



      if (!response) return
      const data = await response.json();
      setComments(data.comments);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


getComments()
},[])

  const handleStatusChange = async (
    commentId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("data_token");

      const response = await fetch(
        `http://localhost:3000/admin/comments/${commentId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="comments-page">Loading...</div>;
  }

  return (
    <Fragment>
       <Helmet>
      <title>
     {t("adminTitle.titleAdminComment")}
      </title>
      
      
      <meta
      name="description"
      content="
      Admin Panel for managing, reviewing, approving, and rejecting user comments
      "
      />
          </Helmet>
          <div className="comments-page">

      <div className="comments-page__header">
        <div>
          <h1>{t("commentHeader")}</h1>

          <p>
            {t("commentParagraph")}
          </p>
        </div>

        <div className="comments-count">
          {comments.length} Pending
        </div>
      </div>


      {comments.length === 0 ? (

        <div className="empty-comments">
          <h2>{t("commentModalHeader")}</h2>

          <p>
            {t("commentModalParagraph")}
          </p>
        </div>

      ) : (

        <div className="comments-list">

          {comments.map((comment) => (

            <div
              className="comment-card"
              key={comment._id}
            >

              <div className="comment-card__top">

                <div className="comment-user">

                  <div className="comment-avatar">
                   <img
    src={comment.user.image || "/user.png"}
    alt={comment.user.username}
  />

                  </div>

                  <div>
                    <h3>
                      {comment.user.username}
                    </h3>

                    <span>
                      {new Date(
                        comment.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                </div>


                <span className="comment-status">
                  {comment.status}
                </span>

              </div>


              <div className="comment-card__body">

                <p>
                  {comment.text}
                </p>

              </div>


              <div className="comment-card__info">

                <span>
                  Category: {comment.category}
                </span>

                <span>
                  Post ID: {comment._id}
                </span>

              </div>


              <div className="comment-card__actions">

                <button
                  className="approve"
                  onClick={() =>
                    handleStatusChange(
                      comment._id,
                      "approved"
                    )
                  }
                >
                  {t("aprove")}
                </button>


                <button
                  className="reject"
                  onClick={() =>
                    handleStatusChange(
                      comment._id,
                      "rejected"
                    )
                  }
                >
                   {t("reject")}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
    </Fragment>
    
  );
};

export default Comments;