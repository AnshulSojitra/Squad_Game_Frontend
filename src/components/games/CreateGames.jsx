import { useEffect, useState } from "react";
import {
  createGameApi,
  getPublicGround,
  getPublicGroundById,
  verifyPayment,
} from "../../services/api";
import Loader from "../utils/Loader";
import Toast from "../utils/Toast";
import gamesList from "../constants/gamesList";
import GamePaymentDetailsModal from "../payment/GamePaymentDetailsModal";
import { useTheme } from "../../context/ThemeContext";

export default function CreateGames({ open, onClose, onGameCreated }) {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [availableGrounds, setAvailableGrounds] = useState([]);
  const [groundsLoading, setGroundsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedGroundDetails, setSelectedGroundDetails] = useState(null);
  const [groundDetailsLoading, setGroundDetailsLoading] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    groundId: "",
    slotIds: [],
    date: "",
    totalTeams: 2,
    playersPerTeam: "",
    pricePerPlayer: "",
  });

  const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

  const extractGroundSports = (ground) => {
    const rawValues = [];
    if (ground?.game) rawValues.push(ground.game);
    if (ground?.sport) rawValues.push(ground.sport);
    if (Array.isArray(ground?.games)) rawValues.push(...ground.games);
    if (Array.isArray(ground?.sports)) rawValues.push(...ground.sports);

    return rawValues
      .flatMap((value) => {
        if (!value) return [];
        if (typeof value === "string") return [value];
        if (typeof value === "object") return [value.name, value.game, value.sport].filter(Boolean);
        return [String(value)];
      })
      .map(normalizeText);
  };

  const groundSupportsSport = (ground, sport) => {
    const selectedSport = normalizeText(sport);
    if (!selectedSport) return true;
    const sports = extractGroundSports(ground);

    return sports.some(
      (sportName) =>
        sportName === selectedSport ||
        sportName.includes(selectedSport) ||
        selectedSport.includes(sportName)
    );
  };

  const getGroundId = (ground) => ground?._id ?? ground?.id;

  const selectedGround = availableGrounds.find(
    (ground) => String(getGroundId(ground)) === String(formData.groundId)
  );

  const toDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const minDate = toDateInputValue(today);
  const maxDateObj = new Date(today);
  const resolvedAdvanceBookingDays =
    selectedGroundDetails?.advanceBookingDays ?? selectedGround?.advanceBookingDays ?? 0;
  const advanceBookingDays = Number(resolvedAdvanceBookingDays);
  maxDateObj.setDate(today.getDate() + (Number.isNaN(advanceBookingDays) ? 0 : advanceBookingDays));
  const maxDate = toDateInputValue(maxDateObj);

  const formatTime12 = (time) => {
    if (!time) return "";
    const [h = "0", m = "00"] = String(time).split(":");
    const hour = Number(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const resetState = () => {
    setFormData({
      name: "",
      sport: "",
      groundId: "",
      slotIds: [],
      date: "",
      totalTeams: 2,
      playersPerTeam: "",
      pricePerPlayer: "",
    });
    setCreateStep(1);
    setAvailableGrounds([]);
    setAvailableSlots([]);
    setSelectedGroundDetails(null);
    setPaymentModalData(null);
  };

  const handleClose = () => {
    onClose?.();
    resetState();
  };

  const handleSportSelect = async (sport) => {
    setFormData((prev) => ({ ...prev, sport, groundId: "" }));
    setCreateStep(2);

    try {
      setGroundsLoading(true);
      const response = await getPublicGround();
      const groundsArray = Array.isArray(response.data) ? response.data : [];
      const filteredGrounds = groundsArray.filter((ground) =>
        groundSupportsSport(ground, sport)
      );
      setAvailableGrounds(filteredGrounds);
    } catch (error) {
      console.error("Failed to fetch grounds", error);
      setToast({ show: true, type: "error", message: "Failed to load grounds" });
      setAvailableGrounds([]);
    } finally {
      setGroundsLoading(false);
    }
  };

  const handleGroundSelect = (groundId) => {
    setFormData((prev) => ({ ...prev, groundId, date: "", slotIds: [] }));
    setAvailableSlots([]);
    setSelectedGroundDetails(null);
    setCreateStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date" && value) {
      if (value < minDate || value > maxDate) {
        setToast({
          show: true,
          type: "error",
          message: `Please select a date between ${minDate} and ${maxDate}`,
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { slotIds: [] } : {}),
    }));
  };

  const handleSlotToggle = (slotId) => {
    setFormData((prev) => ({
      ...prev,
      slotIds: prev.slotIds.includes(slotId)
        ? prev.slotIds.filter((id) => id !== slotId)
        : [...prev.slotIds, slotId],
    }));
  };

  useEffect(() => {
    const fetchSelectedGroundDetails = async () => {
      if (!open || !formData.groundId || createStep !== 3) {
        setSelectedGroundDetails(null);
        return;
      }

      try {
        setGroundDetailsLoading(true);
        const response = await getPublicGroundById(formData.groundId);
        setSelectedGroundDetails(response.data || null);
      } catch (error) {
        console.error("Failed to fetch ground details", error);
        setSelectedGroundDetails(null);
      } finally {
        setGroundDetailsLoading(false);
      }
    };

    fetchSelectedGroundDetails();
  }, [open, formData.groundId, createStep]);

  useEffect(() => {
    const fetchGroundSlots = async () => {
      if (!open || !formData.groundId || !formData.date || createStep !== 3) {
        setAvailableSlots([]);
        return;
      }

      try {
        setSlotsLoading(true);
        const response = await getPublicGroundById(formData.groundId, formData.date);
        setAvailableSlots(Array.isArray(response.data?.slots) ? response.data.slots : []);
      } catch (error) {
        console.error("Failed to fetch slots", error);
        setAvailableSlots([]);
        setToast({ show: true, type: "error", message: "Failed to load slots" });
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchGroundSlots();
  }, [open, formData.groundId, formData.date, createStep]);

  const handleCreateGame = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.sport || !formData.groundId || !formData.slotIds.length) {
      setToast({
        show: true,
        type: "error",
        message: "Please enter tournament name, select sport, ground, and at least one slot",
        message: "Please enter tournament name, select sport, ground, and at least one slot",
      });
      return;
    }

    if (!formData.date || !formData.playersPerTeam || !formData.pricePerPlayer) {
      setToast({ show: true, type: "error", message: "Please fill in all details" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: String(formData.name).trim(),
        sport: formData.sport,
        groundId: Number(formData.groundId),
        slotIds: formData.slotIds.map(Number),
        totalTeams: Number(formData.totalTeams),
        playersPerTeam: Number(formData.playersPerTeam),
        pricePerPlayer: Number(formData.pricePerPlayer),
        date: formData.date,
      };

      const response = await createGameApi(payload);
      const order = response?.data?.order;

      if (!order?.id) throw new Error("Invalid order response from create tournament API");

      const selectedSlotLabels = availableSlots
        .filter((slot) => formData.slotIds.includes(Number(slot.id)))
        .map((slot) => `${formatTime12(slot.startTime)} - ${formatTime12(slot.endTime)}`);

      setPaymentModalData({
        payload,
        order,
        key:
          response?.data?.key ||
          response?.data?.razorpayKey ||
          response?.data?.razorpay_key_id ||
          null,
        groundName: selectedGround?.name || "Selected Ground",
        gameName: formData.name,
        sport: formData.sport,
        date: formData.date,
        totalTeams: formData.totalTeams,
        playersPerTeam: formData.playersPerTeam,
        pricePerPlayer: formData.pricePerPlayer,
        selectedSlotLabels,
      });
    } catch (error) {
      console.error("Error creating tournament", error);
      setToast({ show: true, type: "error", message: "Failed to create tournament" });
      console.error("Error creating tournament", error);
      setToast({ show: true, type: "error", message: "Failed to create tournament" });
    } finally {
      setLoading(false);
    }
  };

  const handleGamePayment = async () => {
    if (!paymentModalData?.order?.id) {
      setToast({ show: true, type: "error", message: "Payment order not found" });
      return;
    }

    const razorpayKey =
      process.env.REACT_APP_RAZORPAY_KEY_ID ||
      process.env.REACT_APP_RAZORPAY_KEY ||
      paymentModalData?.key;

    if (!razorpayKey) {
      setToast({
        show: true,
        type: "error",
        message: "Razorpay key is missing. Set REACT_APP_RAZORPAY_KEY_ID or return key from backend.",
      });
      return;
    }

    try {
      setPaymentLoading(true);
      if (!window.Razorpay) throw new Error("Razorpay SDK is not loaded");

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: paymentModalData.order.amount,
        currency: paymentModalData.order.currency || "INR",
        name: "BoxArena",
        description: "Game Creation Payment",
        order_id: paymentModalData.order.id,
        handler: async (paymentResponse) => {
          try {
            await verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            setToast({ show: true, type: "success", message: "Payment successful. Tournament created!" });
            setToast({ show: true, type: "success", message: "Payment successful. Tournament created!" });
            onGameCreated?.();
            handleClose();
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
            setToast({ show: true, type: "error", message: "Payment verification failed" });
          } finally {
            setPaymentLoading(false);
          }
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      });

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failed", response?.error);
        setToast({
          show: true,
          type: "error",
          message: response?.error?.description || "Payment failed",
        });
        setPaymentLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Unable to initiate payment", error);
      setToast({ show: true, type: "error", message: "Unable to initiate payment" });
      setPaymentLoading(false);
    }
  };

  if (!open) {
    return (
      <>
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4">
        <div className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}>
          {createStep === 1 && (
            <div className="p-5 sm:p-8">
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Sport</h2>
              <p className={isDarkMode ? 'text-slate-400 mb-6' : 'text-slate-600 mb-6'}>Choose a sport for your tournament</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {gamesList.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleSportSelect(game.name)}
                    className={`p-6 bg-gradient-to-br border rounded-xl text-center transition-all transform hover:scale-105 ${
                      isDarkMode
                        ? 'from-slate-800 to-slate-900 border-slate-700 hover:border-indigo-500'
                        : 'from-white to-slate-50 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span className="text-3xl mb-3 block">{game.icon}</span>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.name}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleClose}
                className={`w-full mt-6 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Cancel
              </button>
            </div>
          )}

          {createStep === 2 && (
            <div className="p-5 sm:p-8">
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Ground</h2>
              <p className={isDarkMode ? 'text-slate-400 mb-6' : 'text-slate-600 mb-6'}>
                Choose a ground for <span className="text-indigo-400 font-semibold">{formData.sport}</span>
              </p>

              {groundsLoading ? (
                <Loader variant="simple" text="Loading grounds..." fullScreen={false} />
              ) : availableGrounds.length === 0 ? (
                <div className="text-center py-10">
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No grounds available for this sport</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {availableGrounds.map((ground) => (
                    <button
                      key={getGroundId(ground)}
                      onClick={() => handleGroundSelect(getGroundId(ground))}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-indigo-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      <p className="font-semibold">{ground.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{ground.city}, {ground.state}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Rs {ground.pricePerSlot}/slot</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setCreateStep(1)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleClose}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {createStep === 3 && selectedGround && (
            <div className="p-5 sm:p-8">
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tournament Details</h2>
              <p className={isDarkMode ? 'text-slate-400 mb-6' : 'text-slate-600 mb-6'}>
                Ground: <span className="text-indigo-400 font-semibold">{selectedGround.name}</span>
              </p>

              <form onSubmit={handleCreateGame} className="space-y-6">
                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tournament Name</label>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tournament Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter tournament name"
                    placeholder="Enter tournament name"
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={minDate}
                    max={maxDate}
                    disabled={groundDetailsLoading}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }` }
                    required
                  />
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {groundDetailsLoading
                      ? "Loading booking range..."
                      : `Select date from ${minDate} to ${maxDate}`}
                  </p>
                </div>

                {formData.date && (
                  <div>
                    <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Slots</label>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Select time slots for your tournament</p>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Select time slots for your tournament</p>

                    {slotsLoading ? (
                      <Loader variant="simple" text="Loading slots..." fullScreen={false} />
                    ) : availableSlots.length === 0 ? (
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No slots available for selected date</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => {
                          const slotId = Number(slot.id);
                          const isSelected = formData.slotIds.includes(slotId);
                          const isBooked = !Boolean(slot.available);

                          return (
                            <button
                              key={slotId}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleSlotToggle(slotId)}
                              className={`p-3 rounded-lg border transition-all font-semibold ${
                                isBooked
                                ? isDarkMode ? "bg-slate-900 border-rose-900 text-rose-300 cursor-not-allowed" : "bg-slate-100 border-rose-200 text-rose-700 cursor-not-allowed"
                                : isSelected
                                  ? "bg-indigo-600 border-indigo-500 text-white"
                                  : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-400" : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400"
                              }`}
                            >
                              <span className="block">
                                {formatTime12(slot.startTime)} - {formatTime12(slot.endTime)}
                              </span>
                              {isBooked && (
                                <span className="block text-[11px] uppercase tracking-wide mt-1">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Total Teams</label>
                  <input
                    type="number"
                    name="totalTeams"
                    min="2"
                    value={formData.totalTeams}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Players Per Team</label>
                  <input
                    type="number"
                    name="playersPerTeam"
                    min="1"
                    value={formData.playersPerTeam}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Price Per Player (Rs)</label>
                  <input
                    type="number"
                    name="pricePerPlayer"
                    value={formData.pricePerPlayer}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
                      isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
                >
                  {loading ? <Loader variant="button" text="Creating tournament..." /> : "Create Tournament"}
                  {loading ? <Loader variant="button" text="Creating tournament..." /> : "Create Tournament"}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(2)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <GamePaymentDetailsModal
        open={Boolean(paymentModalData)}
        details={paymentModalData}
        loading={paymentLoading}
        onClose={() => setPaymentModalData(null)}
        onPay={handleGamePayment}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
