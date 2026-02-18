import { createPaymentOrder, verifyPayment } from "../../services/api";
import { useNavigate , useState } from "react-router-dom";
import Toast from "../../components/common/Toast";


const PaymentButton = ({ slotIds, date }) => {
  const navigate = useNavigate();
    const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  // Disable button if selection is invalid
  const isDisabled = !date || !slotIds || slotIds.length === 0;

  const handlePayment = async () => {
    // 🛑 Safety guard
    if (!date || slotIds.length === 0) {
      showToast("error","Please select date and slots");
      return;
    }

    try {
      // 1️⃣ Create Razorpay order (BACKEND)
      const data  = await createPaymentOrder({
        slotIds,
        date,
      });

      // 2️⃣ Razorpay checkout options
      const options = {
        key: data.key, // public Razorpay key from backend
        amount: data.amount, // amount in paise
        currency: data.currency,
        order_id: data.orderId,
        name: "BoxArena",
        description: "Ground Booking Payment",

        handler: async function (response) {
          try {
            // 3️⃣ Verify payment (BACKEND)
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              showToast("success","Payment Successful 🎉");
              navigate("/my-bookings");
            } else {
              showToast("error","Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showToast("error","Payment verification failed");
          }
        },

        theme: {
          color: "#0f172a",
        },
      };

      // 4️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      showToast("warning",
        error.response?.data?.message ||
          "Unable to initiate payment. Please try again."
      );
    }
  };

  return (
    <>
    <button
      onClick={handlePayment}
      disabled={isDisabled}
      className={`w-full mt-3 py-3 rounded-lg font-medium transition-colors
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-black hover:bg-gray-800 text-white"
        }`}
    >
      Pay Now
    </button>
    {/* {toast.show && <Toast type={toast.type} message={toast.message} />} */}
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
       />
    </>
  );
};

export default PaymentButton;
