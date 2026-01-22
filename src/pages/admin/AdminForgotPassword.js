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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your admin email to receive OTP
        </p>

        {message && (
          <p className="text-sm text-center mb-4 text-indigo-600">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Sending OTP..." : "Confirm Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
