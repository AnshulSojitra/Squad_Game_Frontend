import { useEffect, useState } from "react";
import { getGroundReviews } from "../../services/api";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ groundId }) {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [groundId]);

  const fetchReviews = async () => {
    try {
      const res = await getGroundReviews(groundId);
      setReviewsData(res.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  if (!reviewsData || reviewsData.totalReviews === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-2 text-white mb-4">
        <p className="text-lg font-semibold">
          ⭐ {reviewsData.avgRating} / 5
        </p>
        <p className="text-sm text-gray-500">
          ({reviewsData.totalReviews} reviews)
        </p>
      </div>

      {/* Reviews */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reviewsData.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
