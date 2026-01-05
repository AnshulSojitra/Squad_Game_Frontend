import { useEffect } from "react";

export default function Toast({ show, type = "info", message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-600 text-black",
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div
        className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl shadow-xl text-white min-w-[300px] ${styles[type]}`}
      >
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="text-xl leading-none">×</button>
      </div>
    </div>
  );
}
