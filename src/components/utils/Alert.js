export default function Alert({ type = "info", message, onClose }) {
  const styles = {
    info: "bg-blue-900 text-blue-200 border-blue-400",
    success: "bg-green-900 text-green-200 border-green-400",
    danger: "bg-red-900 text-red-200 border-red-400",
    warning: "bg-yellow-900 text-yellow-200 border-yellow-400",
    dark: "bg-gray-800 text-gray-200 border-gray-500",
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${styles[type]}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
