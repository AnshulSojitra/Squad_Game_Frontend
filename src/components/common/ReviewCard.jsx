import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  const { rating, comment, createdAt, User } = review;

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(User?.name || "User")}&background=random`}
          alt="user"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm">{User?.name}</p>
          <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
          <Star size={14} className="text-yellow-500" />
          <span className="ml-1 text-sm font-semibold">{rating}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm">{comment}</p>
    </div>
  );
}
