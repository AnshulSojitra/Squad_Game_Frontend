import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { superAdminLogin } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // 🔐 API CALL HERE
      // await superAdminLogin(form);
      const res = await superAdminLogin(form);
        localStorage.setItem("superAdminToken",res.data.token);
      setTimeout(() => {
        console.log("SuperAdmin logged in:", form);
        setLoading(false);
        navigate("/super-admin/dashboard")
      }, 1500);
    } catch (err) {
      setLoading(false);
      setErrors({
        general: "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Super Admin Login
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Secure access for system administrators
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border
                ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-indigo-500"
                }
                focus:outline-none`}
              placeholder="superadmin@boxarena.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border
                  ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-700 focus:border-indigo-500"
                  }
                  focus:outline-none`}
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* GENERAL ERROR */}
          {errors.general && (
            <p className="text-red-500 text-sm text-center">
              {errors.general}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
              text-white`}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
