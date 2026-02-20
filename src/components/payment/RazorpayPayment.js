import axios from "axios";
import { useState } from "react";
import Toast from "../../components/utils/Toast";

const RazorpayPayment = ({ slotIds, selectedDate, amount }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
  show: false,
  type: "success",
  message: "",
});


const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  const handlePayment = async () => {
    if (!slotIds?.length || !selectedDate) {
      showToast("warning","Please select date and slots");
      return;
    }

    setLoading(true);

    try {
      /* ================== 1️⃣ CREATE ORDER ================== */
      const orderRes = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payments/razorpay/order`,
        {
          slotIds,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const { orderId, amount, currency, key } = orderRes.data;

      if (!orderId || !key) {
        throw new Error("Invalid order response");
      }

      /* ================== 2️⃣ RAZORPAY OPTIONS ================== */
      const options = {
        key,
        amount,
        currency,
        name: "BoxArena",
        description: "Ground Booking",
        order_id: orderId,

         

        handler: async function (response) {
          try {
            /* ================== 3️⃣ VERIFY PAYMENT ================== */
            await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/payments/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              }
            );

            showToast("success","Payment Successful 🎉");
            window.location.href = "/profile/mybooking";
          } catch (err) {
            console.error("Verification failed", err);
            showToast("error","Payment verification failed");
          }
        },
       method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
          },
       theme: {
             color: "#4d0099",
          },
     };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        showToast("warning",response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      showToast("success","Unable to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full mt-4 py-3 rounded-lg font-medium text-white
        ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
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

export default RazorpayPayment;
