// import { useEffect } from "react";

// export default function Toast({ show, type = "info", message, onClose }) {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(onClose, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onClose]);

//   if (!show) return null;

//   const styles = {
//     success: "bg-green-600",
//     error: "bg-red-600",
//     info: "bg-blue-600",
//     warning: "bg-yellow-600 text-black",
//   };

//   return (
//     <div className="fixed top-5 right-5 z-50 animate-slide-in">
//       <div
//         className={`flex items-center justify-between gap-4 px-6 py-4 rounded-xl shadow-xl text-white min-w-[300px] ${styles[type]}`}
//       >
//         <span className="font-medium">{message}</span>
//         <button onClick={onClose} className="text-xl leading-none">×</button>
//       </div>
//     </div>
//   );
// }
import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export default function Toast({ show, type = "info", message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const config = {
    success: {
      bg: "from-emerald-500 to-green-600",
      icon: <CheckCircle size={20} />,
    },
    error: {
      bg: "from-red-500 to-rose-600",
      icon: <XCircle size={20} />,
    },
    info: {
      bg: "from-blue-500 to-indigo-600",
      icon: <Info size={20} />,
    },
    warning: {
      bg: "from-yellow-400 to-orange-500",
      icon: <AlertTriangle size={20} />,
    },
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[9999] pointer-events-none">
      <div
        className={`mt-20 pointer-events-auto
        flex items-center gap-4
        px-6 py-4
        rounded-2xl
        shadow-2xl
        text-white
        min-w-[320px]
        backdrop-blur-lg
        bg-gradient-to-r ${config[type].bg}
        animate-[fadeSlide_0.4s_ease-out]
        `}
      >
        <div className="opacity-90">{config[type].icon}</div>

        <span className="font-medium tracking-wide">{message}</span>

        <button
          onClick={onClose}
          className="ml-auto text-lg opacity-80 hover:opacity-100 transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
