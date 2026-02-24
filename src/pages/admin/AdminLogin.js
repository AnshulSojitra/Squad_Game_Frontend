import { useState } from "react";
import Input from "../../components/common/Input";
import Loader from "../../components/utils/Loader";
import { loginAdmin } from "../../services/api";
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
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 animate-fade-in">
        <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-500 hover:shadow-3xl hover:scale-105">
           {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Login
            </h2>
            <p className="text-xs text-gray-400">
              Enter admin credentials to continue
            </p>
          </div>

          {/* General Error */}
          {generalError && (
            <p className="text-red-600 text-sm text-center mb-4">
              {generalError}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@example.com"
            /> */}
            <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none text-black
                  ${errors.email ? "border-red-500" : "border-gray-300"}
                `}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

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
                  className={`input-style pr-12 text-black ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => navigate("/admin/forgot-password")}
                  className="text-sm text-indigo-600 hover:underline mt-3"
                >
                  Forgot Password?
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/3 -translate-y-1/2
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
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                loading
                  ? "bg-gray-600 cursor-not-allowed scale-95"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {loading ? (
                <Loader variant="button" text="Signing in..." />
              ) : (
                "Login"
              )}
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
