import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, sendOtp, verifyOtp } from "../../services/api";
import Loader from "../../components/utils/Loader";
import Toast from "../../components/utils/Toast";
import { useBoxArena } from "../../context/BoxArenaContext";
import { useTheme } from "../../context/ThemeContext";

export default function UserLogin({ onClose }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { setUserSession, cacheUserProfile } = useBoxArena();
  const [step, setStep] = useState("LOGIN");
  const [login, setLogin] = useState("");
  const [otp, setOtp] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isEmailLogin = login.includes("@");
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    if (!login) return showToast("error", "Enter email or mobile");
    if (isSendingOtp || resendCooldown > 0) return;

    try {
      setIsSendingOtp(true);
      await sendOtp(login);
      setStep("OTP");
      setResendCooldown(45);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showToast("error", "Enter OTP");
    if (isVerifyingOtp) return;

    try {
      setIsVerifyingOtp(true);
      const res = await verifyOtp({ login, otp });

      setUserSession(res.data.token, res.data.user);

      if (!res.data.isNewUser) {
        onClose?.();
        navigate("/");
        return;
      }

      setStep("PROFILE");
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!firstName || !lastName) {
      return showToast("error", "Enter first and last name");
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
      cacheUserProfile(res.data.user);

      onClose?.();
      navigate("/");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <>
      <div className={`h-screen flex flex-col ${isDarkMode ? "bg-[#0b1120]" : "bg-white"}`}>
     <main className="flex-1 flex items-center justify-center px-4">
  <div className="w-full max-w-md">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl p-6 relative shadow-2xl overflow-hidden">
            <button
              onClick={() => navigate("/")}
              className="absolute right-4 top-4 text-white text-xl"
              aria-label="Close"
            >
              x
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-white/10 rounded-full w-16 h-16 mb-3">
                <span className="text-2xl font-bold text-white">⚽</span>
              </div>
              <h2 className="text-white text-2xl font-extrabold">Get in the Game</h2>
              <p className="text-white/80 text-sm">
                Login or signup with OTP. Quick and secure.
              </p>
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
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white ${
                        isSendingOtp || resendCooldown > 0
                          ? "bg-indigo-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isSendingOtp ? (
                        <Loader variant="button" text="Sending..." />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 8 12 4.5 19.5 8 12 9.5z"
                            />
                          </svg>
                          {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : "Send OTP"}
                        </>
                      )}
                    </button>
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
                    className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold ${
                      isVerifyingOtp
                        ? "bg-indigo-300 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isVerifyingOtp ? (
                      <Loader variant="button" text="Verifying..." />
                    ) : (
                      "Verify and Continue"
                    )}
                  </button>

                  <div className="mt-3 text-center text-sm text-gray-500">
                    Didn't receive OTP?{" "}
                    {resendCooldown > 0 ? (
                      `Wait ${resendCooldown}s`
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="underline text-indigo-600"
                      >
                        Resend
                      </button>
                    )}
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
                      type="tel"
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Complete Registration
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        </main>
         {/* Bottom Strip
      <div className={`py-6 text-center text-xs transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120] text-gray-400 border border-gray-600' : 'bg-white text-gray-700 border border-gray-200'}`}>
        Designed & Developed with ❤️ by BoxArena Team
      </div> */}
      <footer className={`py-6 text-center text-xs transition-colors duration-300
  ${isDarkMode
    ? "bg-[#0b1120] text-gray-400 border-t border-gray-600"
    : "bg-white text-gray-700 border-t border-gray-200"}`}
>
  Designed & Developed with ❤️ by BoxArena Team
</footer>
      </div>
      

      

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
