export default function ReviewCard({ review }) {
  const { rating, comment, createdAt, User } = review;

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src="https://ui-avatars.com/api/?name=Niraj+Soni&background=random"
          alt="user"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm">{User?.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Rating */}
      <p className="text-yellow-500 text-sm mb-1">
        ⭐ {rating} / 5
      </p>

      {/* Comment */}
      <p className="text-gray-700 text-sm">{comment}</p>
    </div>
  );
}
