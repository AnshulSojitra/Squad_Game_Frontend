// import axios from "axios";
// import { useState } from "react";

// const RazorpayPayment = ({ amount, bookingId, user, selectedDate, onPaymentSuccess }) => {
//   const [isProcessing, setIsProcessing] = useState(false);
  
//   const loadPayment = async () => {
//     if (!user || !amount || !bookingId || bookingId.length === 0) {
//       alert("Missing booking details. Please try again.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // 1️⃣ Create Order (Backend)
//       const { data: order } = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/payments/order`,
//         {
//           amount: Math.round(amount),
//           slotIds: bookingId,
//           date: selectedDate,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       // 2️⃣ Razorpay Options
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY,
//         amount: order.amount,
//         currency: "INR",
//         name: "Squad Game - Ground Booking",
//         description: "Sports Ground Booking Payment",
//         order_id: order.id,

//         handler: async function (response) {
//           try {
//             // 3️⃣ Verify Payment (Backend)
//             const verifyResponse = await axios.post(
//               `${process.env.REACT_APP_API_BASE_URL}/payments/verify`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 slotIds: bookingId,
//                 date: selectedDate,
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//                 },
//               }
//             );

//             alert("Payment Successful 🎉");
//             if (onPaymentSuccess) {
//               onPaymentSuccess(verifyResponse.data);
//             } else {
//               window.location.href = "/user/bookings";
//             }
//           } catch (err) {
//             console.error("Payment verification error:", err);
//             alert("Payment verification failed. Please contact support.");
//           }
//         },

//         prefill: {
//           name: user?.name || "",
//           email: user?.email || "",
//           contact: user?.phone || "",
//         },

//         method: {
//           upi: true,
//           card: true,
//           netbanking: true,
//           wallet: true,
//         },

//         theme: {
//           color: "#0f172a",
//         },
//       };

//       // 4️⃣ Open Razorpay
//       const rzp = new window.Razorpay(options);

//       rzp.on("payment.failed", function (response) {
//         console.error("Payment failed:", response.error);
//         alert(response.error?.description || "Payment failed. Please try again.");
//         setIsProcessing(false);
//       });

//       rzp.open();
//     } catch (err) {
//       console.error("Payment initiation error:", err);
//       alert(err.response?.data?.message || "Unable to initiate payment");
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <button
//       onClick={loadPayment}
//       disabled={isProcessing}
//       className={`w-full mt-4 sm:mt-6 px-6 py-2 sm:py-3 text-white rounded-lg font-medium text-sm sm:text-base transition-colors ${
//         isProcessing
//           ? "bg-gray-400 cursor-not-allowed"
//           : "bg-green-600 hover:bg-green-700"
//       }`}
//     >
//       {isProcessing ? "Processing..." : `Pay ₹${amount}`}
//     </button>
//   );
// };

// export default RazorpayPayment;
import axios from "axios";
import { useState } from "react";

const RazorpayPayment = ({ slotIds, selectedDate, amount }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!slotIds?.length || !selectedDate) {
      alert("Please select date and slots");
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

            alert("Payment Successful 🎉");
            window.location.href = "/profile/mybooking";
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed");
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
        alert(response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full mt-4 py-3 rounded-lg font-medium text-white
        ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
