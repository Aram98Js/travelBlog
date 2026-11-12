
import { useEffect, useState, useCallback, Fragment } from "react";
import { useParams } from "react-router-dom";
import Rating from "../Components/Rating";
import "./postDetails.scss";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
type PostModel = "Travel" | "Food" | "Relax";

interface PostData {
  _id: string;
  title: string;
  short_description?: string;
  description: string;
  image: string;
  location?: {
    city: string;
    country: string;
  };
  price?: number;
  rating?: number;
  viewsCount?: number;
  likesCount?: number;
  commentCount?: number;
  createdAt?: string;
}

interface ReviewData {
  _id: string;
  rating: number;
  text: string;
  user?: {
    username: string;
    image?: string;
  } | null;
}

interface ReviewResponse {
  reviews: ReviewData[];
  totalReviews: number;
  averageRating: number;
}

const PostDetails = () => {
  const { category, id } = useParams();

  const [post, setPost] = useState<PostData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();
  const postModel: PostModel | null =
    category === "travel"
      ? "Travel"
      : category === "food"
      ? "Food"
      : category === "relax"
      ? "Relax"
      : null;

  const getReviews = useCallback(async () => {
    if (!id || !postModel) return;

    try {
      const response = await fetch(
        `http://localhost:3000/reviews/${id}?postModel=${postModel}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data: ReviewResponse = await response.json();

      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);

    } catch (error) {
      console.error("Reviews error:", error);
    }
  }, [id, postModel]);

  useEffect(() => {
  if (!id || !postModel) return;

  let cancelled = false;

  const getPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${category}/${id}`
      );

      if (!response.ok) {
        throw new Error("Post not found");
      }

      const data = await response.json();

      if (!cancelled) {
        setPost(data.post);
      }
    } catch (err) {
      console.error(err);

      if (!cancelled) {
        setError("Failed to load post");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  const loadData = async () => {
    await Promise.all([
      getPost(),
      getReviews()
    ]);
  };

  void loadData();

  return () => {
    cancelled = true;
  };
}, [category, id, postModel, getReviews]);

  if (!id || !postModel) {
    return <h2>Invalid post</h2>;
  }

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error || !post) {
    return <h2>{error || "Post not found"}</h2>;
  }

  return (
    <Fragment>
  <Helmet>
  <html lang={i18n.language} />

  <title>
    {t("postDetailsSEO.title", { title: post.title })}
  </title>

  <meta
    name="description"
    content={t("postDetailsSEO.description", {
      title: post.title
    })}
  />

  <meta
    name="keywords"
    content={t("postDetailsSEO.keywords", {
      title: post.title
    })}
  />

  <meta name="robots" content="index, follow" />

  <meta
    property="og:title"
    content={t("postDetailsSEO.title", {
      title: post.title
    })}
  />

  <meta
    property="og:description"
    content={t("postDetailsSEO.description", {
      title: post.title
    })}
  />

  <meta
    property="og:site_name"
    content={t("postDetailsSEO.siteName")}
  />

  <meta
    property="og:type"
    content="article"
  />

  <meta
    property="og:image"
    content={post.image}
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content={t("postDetailsSEO.title", {
      title: post.title
    })}
  />

  <meta
    name="twitter:description"
    content={t("postDetailsSEO.description", {
      title: post.title
    })}
  />
</Helmet>
 <main className="post-details">

      <div className="post-details__image">
        <img src={post.image} alt={post.title} />
      </div>

      <div className="post-details__content">

        <span className="post-category">
          {postModel}
        </span>

        <h1>{post.title}</h1>

        {post.short_description && (
          <h3>{post.short_description}</h3>
        )}

        {post.location && (
          <p className="post-location">
            📍 {post.location.city}, {post.location.country}
          </p>
        )}

        <div className="post-stats">
          <span>👁 {post.viewsCount ?? 0}</span>
          <span>❤️ {post.likesCount ?? 0}</span>
          <span>💬 {post.commentCount ?? 0}</span>
        </div>

        {post.price != null && (
          <p className="post-price">
            {t("postDetails.Price")} {post.price}
          </p>
        )}

        <div className="post-description">
          <h2> {t("postDetails.Description")}</h2>
          <p>{post.description}</p>
        </div>

        {post.createdAt && (
          <p className="post-date">
           {t("postDetails.Published")}{" "}
            {new Date(post.createdAt).toLocaleDateString("hy-AM")}
          </p>
        )}

        <section className="reviews-section">

          <h2>{t("postDetails.UserRatings")}</h2>

          <div className="review-summary">
            <strong>⭐ {averageRating} / 5</strong>
            <span>{totalReviews} {t("postDetails.Rating")}</span>
          </div>

          <Rating
            postId={post._id}
            postModel={postModel}
            onReviewAdded={getReviews}
          />

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>{t("postDetails.anyRatings")}</p>
            ) : (
              reviews.map((review) => (
                <article
                  className="review-card"
                  key={review._id}
                >
                  <h4>
                    {review.user?.username ?? "Օգտատեր"}
                  </h4>

                  <p>
                    {"⭐".repeat(review.rating)}
                  </p>

                  <p>{review.text}</p>
                </article>
              ))
            )}
          </div>

        </section>
      </div>
    </main>
    </Fragment>
   
  );
};

export default PostDetails;
