import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeAdminPassword } from "../../services/api";
import Toast from "../../components/common/Toast";

export default function AdminChangePassword() {
  const navigate = useNavigate();

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

  /* ---------------- TOAST HANDLER ---------------- */
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
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
      await changeAdminPassword({
        currentPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

    //   alert("Password updated successfully");
        showToast("success","Password updated successfully");
      navigate("/admin/profile");
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
    <div className="min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4">
      <div className="h-full overflow-y-auto w-full max-w-md bg-white rounded-2xl shadow-2xl text-gray-800">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white text-center">
          <h2 className="text-2xl font-bold">Admin Change Password</h2>
          <p className="text-sm opacity-90 mt-1">
            Update your admin credentials securely
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {serverError && (
            <div className="text-sm text-red-400 bg-red-500/20 border border-red-500/30 px-4 py-3 rounded-xl">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* CURRENT PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.old ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, old: !show.old })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                >
                  {show.old ? "Hide" : "Show"}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-red-400 mt-2 animate-pulse">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, new: !show.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-sm font-medium text-indigo-600"
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
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 border rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, confirm: !show.confirm })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-sm font-medium text-indigo-600"
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
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                loading
                  ? "bg-gray-600 cursor-not-allowed scale-95"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
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
