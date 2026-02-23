import { useState } from "react";

export default function RateVenueModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return alert("Please select a rating");
    onSubmit({ rating, feedback });
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Rate this Venue
        </h2>

        {/* ⭐ Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer ${
                (hover || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* 📝 Feedback */}
        <textarea
          placeholder="What can be improved?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm resize-none h-24 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
