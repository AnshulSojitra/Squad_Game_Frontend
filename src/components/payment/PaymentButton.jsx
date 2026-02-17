// import { createPaymentOrder, verifyPayment } from "../../services/api";
// import { useNavigate } from "react-router-dom";

// const PaymentButton = ({ slotIds, date }) => {
//   const navigate = useNavigate();
//     const isDisabled = !date || slotIds.length === 0;


//   const handlePayment = async () => {
//     try {
//       // 1️⃣ Create Order
//       const { data } = await createPaymentOrder({
//         slotIds,
//         date
//       });

//       const options = {
//         key: data.key, // Razorpay key from backend
//         amount: data.amount,
//         currency: data.currency,
//         order_id: data.orderId,
//         name: "BoxArena",
//         description: "Ground Booking",
//         handler: async function (response) {
//           // 2️⃣ Verify payment
//           const verifyRes = await verifyPayment({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           });

//           if (verifyRes.data.success) {
//             alert("Payment Successful 🎉");
//             navigate("/my-bookings");
//           } else {
//             alert("Payment verification failed");
//           }
//         },
//         theme: {
//           color: "#0f172a"
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();

//     } catch (error) {
//       console.error(error);
//       alert("Payment failed");
//     }
//   };
// //   if (!date || slotIds.length === 0) {
// //   alert("Please select date and slots");
// //   return;
// // }


//   return (
//     // <button
//     //   onClick={handlePayment}
//     //   className="px-4 py-2 bg-black text-white rounded"
//     // >
//     //   Pay Now
//     // </button>
//        <button
//       onClick={handlePayment}
//       disabled={isDisabled}
//       className="px-4 py-2 bg-black text-white rounded"
//     //   className={`w-full mt-3 py-3 rounded-lg font-medium
//     //     ${isDisabled
//     //       ? "bg-gray-400 cursor-not-allowed"
//     //       : "bg-black text-white hover:bg-gray-800"
//     //     }`}
//     >
//       Pay Now
//     </button>
//   );
// };

// export default PaymentButton;
import { createPaymentOrder, verifyPayment } from "../../services/api";
import { useNavigate } from "react-router-dom";

const PaymentButton = ({ slotIds, date }) => {
  const navigate = useNavigate();

  // Disable button if selection is invalid
  const isDisabled = !date || !slotIds || slotIds.length === 0;

  const handlePayment = async () => {
    // 🛑 Safety guard
    if (!date || slotIds.length === 0) {
      alert("Please select date and slots");
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
              alert("Payment Successful 🎉");
              navigate("/my-bookings");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed");
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
      alert(
        error.response?.data?.message ||
          "Unable to initiate payment. Please try again."
      );
    }
  };

  return (
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
  );
};

export default PaymentButton;
