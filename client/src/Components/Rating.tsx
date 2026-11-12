
import { useState } from "react";
import { Star } from "lucide-react";
import "./rating.scss";
import { useTranslation } from "react-i18next";

type RatingProps = {
  postId: string;
  postModel: "Travel" | "Food" | "Relax";
  onReviewAdded: () => void;
};

const Rating = ({
  onReviewAdded,
  postId,
  postModel
}: RatingProps) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation()
  const handleSubmit = async () => {
    if (rating === 0 || !text.trim()) {
      alert("Ընտրիր գնահատական և գրիր կարծիք");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Գնահատելու համար անհրաժեշտ է մուտք գործել");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/reviews/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rating,
            text: text.trim(),
            postModel
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || "Գնահատականը չպահպանվեց");
        return;
      }

      alert("Գնահատականը հաջողությամբ պահպանվեց");

      setRating(0);
      setText("");

      // Թարմացնում ենք գնահատականների ցուցակը
      onReviewAdded();

    } catch (error) {
      console.error("Rating error:", error);
      alert("Սերվերի հետ կապի սխալ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-container">
      <h3>{t("postDetails.ratePlace")}</h3>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={star <= rating ? "active" : ""}
            aria-label={`${star} աստղ`}
            disabled={loading}
          >
            <Star
              size={28}
              fill={star <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("postDetails.opinion")}
        disabled={loading}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || rating === 0 || !text.trim()}
      >
        {loading ? t("postDetails.inProcess") : t("postDetails.sendRating") }
      </button>
    </div>
  );
};

export default Rating;
