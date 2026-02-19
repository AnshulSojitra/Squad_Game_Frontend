import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeUserPassword } from "../../services/api";
import Toast from "../../components/common/Toast";
import BackButton from "../../components/common/BackButton";
import { useTheme } from "../../context/ThemeContext";

export default function UserChangePassword() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [toast, setToast] = useState({
  show: false,
  type: "success",
  message: "",
});


 /* ---------------- TOAST HANDLER ---------------- */
const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const e = {};

    if (!form.oldPassword) {
      e.oldPassword = "Current password is required";
    }

    if (!form.newPassword) {
      e.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      e.newPassword = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Please confirm your new password";
    } else if (form.newPassword !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await changeUserPassword({
        currentPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      //alert("Password updated successfully");
        showToast("success","Password updated successfully");
       navigate("/user/profile");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={`min-h-screen overflow-hidden flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-white via-blue-50 to-slate-100'} px-4`}>
      {/* FLOATING BACK BUTTON */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white text-center">
          <h2 className="text-2xl font-bold">Update Password</h2>
          <p className="text-sm opacity-90 mt-1">
            Keep your account secure
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-6">
          {serverError && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* CURRENT PASSWORD */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.old ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-12 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'}
                             focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, old: !show.old })}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                >
                  {show.old ? "Hide" : "Show"}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-12 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'}
                             focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, new: !show.new })}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                >
                  {show.new ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-12 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'}
                             focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, confirm: !show.confirm })
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                >
                  {show.confirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white
                transition-all
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }
              `}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
         <Toast
                  show={toast.show}
                  type={toast.type}
                  message={toast.message}
                  onClose={() => setToast({ ...toast, show: false })}
                />
      </div>
    </div>
  );
}
