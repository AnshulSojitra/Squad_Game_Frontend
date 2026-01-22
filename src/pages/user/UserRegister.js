import { useState } from "react";
import Input from "../../components/common/Input";
import { userRegister } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@([a-zA-Z]{4,})\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email =
          "Email domain must be at least 4 letters (e.g. gmail.com)";
      }
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await userRegister(form);
      navigate("/user/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-sm opacity-90 mt-1">
            Join BoxArena and start booking grounds
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-6">
          {serverError && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* NAME */}
            <div>
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Input
                label="Email Address"
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* PASSWORD WITH SHOW / HIDE */}
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
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2 pr-12 border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white
                transition-all duration-200
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }
              `}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/user/login")}
              className="text-indigo-600 font-medium hover:underline"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
