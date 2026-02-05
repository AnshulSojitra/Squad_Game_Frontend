import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminResetPassword } from "../../services/api";

export default function AdminResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: state?.email || "",
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminResetPassword(form);
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-500 hover:shadow-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
            🔒
          </div>
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-400">
            Enter the OTP sent to your email
          </p>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-center text-yellow-300">
            ⏰ OTP will expire in <span className="font-semibold text-yellow-200">10 minutes</span>
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/20 border border-red-500/30 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
              loading
                ? "bg-gray-600 cursor-not-allowed scale-95"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
