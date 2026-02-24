import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/utils/Loader";
import { userForgotPassword } from "../../services/api";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await userForgotPassword(email);
      setMessage(res.data.message);

      // move to reset page after short delay
      setTimeout(() => {
        navigate("/user/reset-password/:token", { state: { email } });
      }, 1500);
    } catch (err) {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {message && (
          <p className="text-sm text-center mb-4 text-green-600">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? <Loader variant="button" text="Sending OTP..." /> : "Confirm Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
