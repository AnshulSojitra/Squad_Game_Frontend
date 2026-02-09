import { useEffect, useState } from "react";
import { getGroundReviews } from "../../services/api";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ groundId }) {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchReviews();
  }, [groundId]);

  if (loading) return <p className="text-gray-300">Loading reviews...</p>;

  if (!reviewsData || reviewsData.totalReviews === 0) {
    return <p className="text-gray-300">No reviews yet.</p>;
  }

  const total = reviewsData.totalReviews || 0;
  const counts = [5,4,3,2,1].map(r => ({ r, count: (reviewsData.reviews || []).filter(rv => rv.rating === r).length }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="bg-indigo-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{(reviewsData.avgRating || 0).toFixed(1)}</div>
          <div className="text-sm">{total} reviews</div>
        </div>

        <div className="flex-1">
          {counts.map(({ r, count }) => {
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={r} className="flex items-center gap-3 text-sm mb-2 text-white">
                <div className="w-8 text-sm">{r}★</div>
                <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-2 bg-yellow-400 rounded transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-10 text-right text-gray-500">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(reviewsData.reviews || []).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
