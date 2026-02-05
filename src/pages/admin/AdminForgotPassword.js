import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminForgotPassword } from "../../services/api";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await adminForgotPassword(email);
      setMessage(res.data.message);

      // Go to reset password page
      setTimeout(() => {
        navigate("/admin/reset-password", {
          state: { email },
        });
      }, 1500);
    } catch (err) {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-500 hover:shadow-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
            🔑
          </div>
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-400">
            Enter your admin email to receive OTP
          </p>
        </div>

        {message && (
          <div className="text-sm text-center mb-6 text-green-400 bg-green-500/20 border border-green-500/30 px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                Sending OTP...
              </span>
            ) : (
              "Send Reset Code"
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
