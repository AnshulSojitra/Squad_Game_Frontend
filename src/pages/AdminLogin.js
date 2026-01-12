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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setGeneralError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      } else {
        const domainName = form.email.split("@")[1]?.split(".")[0];
        if (!domainName || domainName.length < 4) {
          newErrors.email =
            "Email domain must be at least 4 characters";
        }
      }
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= HANDLE LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const res = await loginAdmin(form);

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setGeneralError(
        err.response?.data?.message || "Invalid email or password"
      );
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
        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-1">
            Admin Login
          </h2>

          <p className="text-xs text-gray-500 text-center mb-6">
            Enter admin credentials to continue
          </p>

          {/* General Error */}
          {generalError && (
            <p className="text-red-600 text-sm text-center mb-4">
              {generalError}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@example.com"
            />

            {/* PASSWORD WITH TOGGLE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-style pr-12 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-indigo-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }
              `}
            >
              {loading ? "Signing in..." : "Login"}
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
