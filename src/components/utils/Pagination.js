import { useTheme } from "../../context/ThemeContext";
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const { isDarkMode } = useTheme();

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1; // pages around current

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">

      {/* PREVIOUS */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
          currentPage === 1
            ? `${isDarkMode ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'}`
            : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'}`
        }`}
      >
        ‹ Prev
      </button>

      {/* PAGE NUMBERS */}
      {getPages().map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-2 text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
              page === currentPage
                ? `${isDarkMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-600 text-white border-indigo-600'}`
                : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'}`
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
          currentPage === totalPages
            ? `${isDarkMode ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'}`
            : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'}`
        }`}
      >
        Next ›
      </button>
    </div>
  );
}
