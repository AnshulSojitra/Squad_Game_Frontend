import { useEffect, useState } from "react";

export default function ShowMore({
  items = [],
  initialCount = 5,
  increment = 5,
  renderItem,
  containerClassName = "",
  buttonClassName = "",
  buttonLabel = "Show More",
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [items, initialCount]);

  const safeItems = Array.isArray(items) ? items : [];
  const visibleItems = safeItems.slice(0, visibleCount);
  const hasMore = visibleCount < safeItems.length;

  return (
    <div className="space-y-4">
      <div className={containerClassName}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4 pb-6">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + increment, safeItems.length))
            }
            className={
              buttonClassName ||
              "px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            }
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
