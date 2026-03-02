import Loader from "../utils/Loader";

const formatMoney = (amount = 0, currency = "INR") => {
  const value = Number(amount || 0) / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `Rs ${value.toFixed(2)}`;
  }
};

export default function GamePaymentDetailsModal({
  open,
  onClose,
  onPay,
  loading = false,
  details,
}) {
  if (!open || !details) return null;

  const {
    groundName,
    sport,
    date,
    totalTeams,
    playersPerTeam,
    pricePerPlayer,
    selectedSlotLabels = [],
    order,
  } = details;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-1">Confirm Payment</h3>
        <p className="text-slate-400 mb-6">Review game and payment details</p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Ground</span>
            <span className="text-white font-semibold">{groundName}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Sport</span>
            <span className="text-white font-semibold">{sport}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Date</span>
            <span className="text-white font-semibold">{date}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Total Teams</span>
            <span className="text-white font-semibold">{totalTeams}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Players Per Team</span>
            <span className="text-white font-semibold">{playersPerTeam}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Price Per Player</span>
            <span className="text-white font-semibold">Rs {pricePerPlayer}</span>
          </div>
          <div className="text-slate-300">
            <p className="mb-1">Selected Slots</p>
            <div className="flex flex-wrap gap-2">
              {selectedSlotLabels.length > 0 ? (
                selectedSlotLabels.map((slot) => (
                  <span
                    key={slot}
                    className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    {slot}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">No slots selected</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-medium">Payable Amount</span>
            <span className="text-white text-xl font-bold">
              {formatMoney(order?.amount, order?.currency)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPay}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
          >
            {loading ? <Loader variant="button" text="Processing..." /> : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
