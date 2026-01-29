import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, completeProfile } from "../../services/api";

export default function UserLogin({ onClose }) {
  const navigate = useNavigate();

  // LOGIN → OTP → PROFILE
  const [step, setStep] = useState("LOGIN");

  const [login, setLogin] = useState("");
  const [otp, setOtp] = useState("");

  const [isNewUser, setIsNewUser] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isEmailLogin = login.includes("@");

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!login) return alert("Enter email or mobile");

    try {
      const res = await sendOtp(login);
      setIsNewUser(!!res.data.isNewUser);
      setStep("OTP");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  // const handleVerifyOtp = async () => {
  //   if (!otp) return alert("Enter OTP");

  //   try {
  //     const res = await verifyOtp({
  //       login,
  //       otp,
  //     });

  //     // EXISTING USER → LOGIN
  //     if (!res.data.isNewUser) {
  //       localStorage.setItem("userToken", res.data.token);
  //       localStorage.setItem("user", JSON.stringify(res.data.user));
  //       onClose?.();
  //       navigate("/");
  //       return;
  //     }

  //     // NEW USER → COMPLETE PROFILE
  //     setIsNewUser(true);
  //     setStep("PROFILE");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "OTP verification failed");
  //   }
  // };

  const handleVerifyOtp = async () => {
  if (!otp) return alert("Enter OTP");

  try {
    const res = await verifyOtp({
      login,
      otp,
    });

    // ✅ ALWAYS STORE TOKEN & USER
    localStorage.setItem("userToken", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // EXISTING USER → LOGIN COMPLETE
    if (!res.data.isNewUser) {
      onClose?.();
      navigate("/");
      return;
    }

    // NEW USER → COMPLETE PROFILE
    setIsNewUser(true);
    setStep("PROFILE");
  } catch (err) {
    alert(err.response?.data?.message || "OTP verification failed");
  }
};


const handleCompleteProfile = async () => {
  if (!firstName || !lastName) {
    return alert("Enter first and last name");
  }

  const payload = {
    name: `${firstName} ${lastName}`,
  };

  if (isEmailLogin) {
    payload.phoneNumber = phone;
  } else {
    payload.email = email;
  }

  try {
    const res = await completeProfile(payload);

    // ✅ UPDATE USER ONLY (token already exists)
    const existingUser = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem(
      "user",
      JSON.stringify({ ...existingUser, ...res.data.user })
    );

    onClose?.();
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Profile update failed");
  }
};

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login / Sign Up
        </h2>

        {step === "LOGIN" && (
          <>
            <input
              type="text"
              placeholder="Enter email or mobile number"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Verify & Continue
            </button>
          </>
        )}

        {step === "PROFILE" && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded-lg p-3 mb-3"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg p-3 mb-3"
            />

            {isEmailLogin ? (
              <input
                type="text"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg p-3 mb-3"
              />
            ) : (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3 mb-3"
              />
            )}

            <button
              onClick={handleCompleteProfile}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Complete Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
}

