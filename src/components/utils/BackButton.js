import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-white/80 backdrop-blur
        border border-gray-200
        shadow-sm
        hover:bg-white hover:shadow-md
        active:scale-95
        transition
      "
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}
