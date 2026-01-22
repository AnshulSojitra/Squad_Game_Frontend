import { useState } from "react";
import Input from "../../components/common/Input";
import { userLogin } from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/user/home";
  const [showPassword, setShowPassword] = useState(false);


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const [errors, setErrors] = useState({
  email: "",
  password: "",
  general: "",
});
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
     setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    if(!validate()) return;

    try {
      const res = await userLogin(form);

      // Save user token
      localStorage.setItem("userToken", res.data.token);

     navigate(from, { replace: true });
    } catch (err) {
      // setErrors(err.response?.data?.message || "Invalid credentials");
       setErrors((prev) => ({
      ...prev,
      general: err.response?.data?.message || "Login failed",
    }));
    
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
  let newErrors = {};

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!form.password.trim()) {
    newErrors.password = "Password is required";
  } else if (form.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  setErrors((prev) => ({ ...prev, ...newErrors }));
  return Object.keys(newErrors).length === 0;
};


  return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* ================= HEADER =================
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1
          className="text-xl font-bold text-indigo-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          BoxArena
        </h1>

        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back to Home
        </button>
      </header> */}

      {/* ================= LOGIN FORM ================= */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
         {/* className="flex flex-1 items-center justify-center px-4" */}
        {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4"></div> */}
        {/* <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg"> */}
           <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-6">
            User Login
          </h2>

          {/* Error Message */}
          {errors.general && (
                <p className="text-red-600 text-sm mb-4 text-center">
                  {errors.general}
                </p>
              )}


          <form onSubmit={handleLogin} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="player@gmail.com"
                className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none text-black
                  ${errors.email ? "border-red-500" : "border-gray-300"}
                `}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>


            <div className="mb-4 text-white">
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
                  className="input-style pr-16 text-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                            text-xs font-medium text-gray-500
                            hover:text-indigo-600 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

              <button
                type="button"
                onClick={() => navigate("/user/forgot-password")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/user/UserRegister")}
                className="text-indigo-600 hover:underline"
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        © {new Date().getFullYear()} BoxArena. All rights reserved.
      </footer>
    </div>
  );
}
