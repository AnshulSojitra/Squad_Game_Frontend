function ToggleSwitch({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // VERY IMPORTANT (prevents row click)
        onToggle();
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${enabled ? "bg-red-500" : "bg-green-500"}
      `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${enabled ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
export default ToggleSwitch;