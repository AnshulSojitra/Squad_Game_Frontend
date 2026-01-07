import { useState } from "react";
import Input from "../../components/common/Input";
import { userLogin } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
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
      const res = await userLogin(form);

      // Save user token
      localStorage.setItem("userToken", res.data.token);

      navigate("/user/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-900">
    //   <div className="bg-white p-8 rounded-xl w-full max-w-md">
    //     <button
    //       onClick={() => navigate("/")}
    //       className="absolute top-4 left-4 text-sm text-gray-300 hover:text-white flex items-center gap-1"
    //     >
    //       ← back
    //     </button>
    //     <h2 className="text-2xl font-bold text-center mb-6">
    //       User Login
    //     </h2>

    //     {error && (
    //       <p className="text-red-600 text-sm text-center mb-4">{error}</p>
    //     )}

    //     <form onSubmit={handleLogin}>
    //       <Input
    //         label="Email"
    //         type="email"
    //         name="email"
    //         value={form.email}
    //         onChange={handleChange}
    //       />

    //       <Input
    //         label="Password"
    //         type="password"
    //         name="password"
    //         value={form.password}
    //         onChange={handleChange}
    //       />

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
    //       >
    //         {loading ? "Logging in..." : "Login"}
    //       </button>
    //         <div className="text-sm text-center mt-4"> 
    //         Don't have an account?{" "}
    //         <button
    //           type="button"
    //           onClick={() => navigate("/user/UserRegister")}
    //           className="text-indigo-600 hover:underline"
    //         >
    //           Register here
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
        <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* ================= HEADER ================= */}
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
      </header>

      {/* ================= LOGIN FORM ================= */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            User Login
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
