import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, completeProfile } from "../../services/api";
import Toast from "../../components/utils/Toast";

export default function UserLogin({ onClose }) {
  const navigate = useNavigate();

  // LOGIN → OTP → PROFILE
  const [step, setStep] = useState("LOGIN");

  const [login, setLogin] = useState("");
  const [otp, setOtp] = useState("");


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // network / UI states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // seconds until resend allowed

  const isEmailLogin = login.includes("@");
  const [toast, setToast] = useState({
  show: false,
  type: "success",
  message: "",
});


const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  /* ---------------- SEND OTP ---------------- */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    if (!login) return showToast("error","Enter email or mobile");
    if (isSendingOtp || resendCooldown > 0) return;

    try {
      setIsSendingOtp(true);
      await sendOtp(login);
      setStep("OTP");

      // cooldown to prevent repeated sends
      setResendCooldown(45);
    } catch (err) {
      showToast("error",err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
  if (!otp) return showToast("error","Enter OTP");
  if (isVerifyingOtp) return;

  try {
    setIsVerifyingOtp(true);
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
    setStep("PROFILE");
  } catch (err) {
    showToast("error",err.response?.data?.message || "OTP verification failed");
  } finally {
    setIsVerifyingOtp(false);
  }
};


const handleCompleteProfile = async () => {
  if (!firstName || !lastName) {
    return showToast("error","Enter first and last name");
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
    showToast("error",err.response?.data?.message || "Profile update failed");
  }
};

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 w-[420px] rounded-2xl p-6 relative shadow-2xl overflow-hidden">
        <button
          onClick={() => navigate("/")}
          className="absolute right-4 top-4 text-white text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center bg-white/10 rounded-full w-16 h-16 mb-3">
            <span className="text-2xl">⚽️</span>
          </div>
          <h2 className="text-white text-2xl font-extrabold">Get in the Game</h2>
          <p className="text-white/80 text-sm">Login or signup with an OTP. Quick, secure & made for players.</p>
        </div>

        <div className="bg-white rounded-xl p-4">

        {step === "LOGIN" && (
          <>
            <input
              type="text"
              placeholder="Enter email or mobile number"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp || resendCooldown > 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white ${isSendingOtp || resendCooldown > 0 ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isSendingOtp ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 8 12 4.5 19.5 8 12 9.5z"/></svg>
                )}

                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Send OTP'}
              </button>

              {/* quick override for dev/testing - hidden by default */}
              {false && resendCooldown > 0 && (
                <button onClick={() => { setResendCooldown(0); }} className="px-3 py-3 rounded-lg bg-white border">Force</button>
              )}
            </div>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className={`w-full flex items-center justify-center gap-2 ${isVerifyingOtp ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-3 rounded-lg font-semibold`}
            >
              {isVerifyingOtp ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : 'Verify & Continue'}
            </button>

            <div className="mt-3 text-center text-sm text-gray-500">
              Didn’t receive OTP? {resendCooldown > 0 ? `Wait ${resendCooldown}s` : <button onClick={handleSendOtp} className="underline text-indigo-600">Resend</button>}
            </div>
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
                type="integer"
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
  </div>

  <Toast
    show={toast.show}
    type={toast.type}
    message={toast.message}
    onClose={() => setToast({ ...toast, show: false })}
  />
    </>
  );
}

