import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userResetPassword } from "../../services/api";
import Toast from "../../components/utils/Toast";

export default function UserResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [toast, setToast] = useState({
  show: false,
  type: "success",
  message: "",
});

 /* ---------------- TOAST HANDLER ---------------- */
const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await userResetPassword({ email, otp, newPassword });
      showToast("success","Password reset successful");
       //alert("Password reset successful");
      navigate("/user/login");
    } catch (err) {
      setError("Invalid OTP or OTP expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-center">
          Reset Password
        </h2>

        <p className="text-xs text-center text-gray-500 mb-4">
          OTP will expire in <span className="font-semibold">10 minutes</span>
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="New Password (min 6 chars)"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
