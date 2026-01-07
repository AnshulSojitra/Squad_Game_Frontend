import { useState } from "react";
import Input from "../components/common/Input";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(form);

      console.log("Login Success:", res.data);

      // save token
      localStorage.setItem("adminToken", res.data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1
          className="text-xl font-bold text-indigo-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          GameGround
        </h1>

        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back to Home
        </button>
      </header>

      {/* ================= LOGIN FORM ================= */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Admin Login
          </h2>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">
              {error}
            </p>
          )}


          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        © {new Date().getFullYear()} GameGround. All rights reserved.
      </footer>
    </div>
  );
}
