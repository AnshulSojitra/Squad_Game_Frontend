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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-xs text-center text-gray-500 mb-4">
          OTP will expire in <span className="text-red-500">10 minutes</span>
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border rounded-lg px-4 py-2 bg-gray-100"
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
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
    </div>
  );
}
