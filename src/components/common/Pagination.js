// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex justify-center items-center gap-2 mt-8">
//       {/* PREV */}
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 rounded-lg border text-sm
//                    disabled:opacity-40 bg-gray-100"
//       >
//         Prev
//       </button>

//       {/* PAGES */}
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-3 py-1 rounded-lg border text-sm font-medium
//             ${
//               page === currentPage
//                 ? "bg-indigo-600 text-white border-indigo-600"
//                 : "bg-white hover:bg-gray-100"
//             }`}
//         >
//           {page}
//         </button>
//       ))}

//       {/* NEXT */}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 rounded-lg border text-sm
//                    disabled:opacity-40 bg-gray-100"
//       >
//         Next
//       </button>
//     </div>
//   );
// }
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
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
        className="px-3 py-1 rounded-lg border text-sm
                   bg-white hover:bg-gray-400 text-black"
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
            className={`px-3 py-1 rounded-lg border text-sm font-medium
              ${
                page === currentPage
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-gray-100 text-black"
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
        className="px-3 py-1 rounded-lg border text-sm
                   bg-white hover:bg-gray-400 text-black"
      >
        Next ›
      </button>
    </div>
  );
}
