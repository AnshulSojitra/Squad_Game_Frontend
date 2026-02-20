import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeAdminPassword } from "../../services/api";
import Toast from "../../components/utils/Toast";

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
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_20px_45px_rgba(15,23,42,0.8)] border border-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-7 text-white text-center">
          <h2 className="text-2xl font-bold tracking-wide">
            Admin Change Password
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Update your admin credentials securely
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-7 space-y-6 bg-slate-900/60">
          <p className="text-xs text-slate-300/90 bg-slate-800/60 border border-slate-700/70 rounded-2xl px-4 py-3 leading-relaxed">
            For your security, make sure your new password is at least{" "}
            <span className="font-semibold text-indigo-300">6 characters</span>{" "}
            long and is different from your previous passwords.
          </p>

          {serverError && (
            <div className="text-sm text-red-200 bg-red-500/15 border border-red-500/40 px-4 py-3 rounded-2xl">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CURRENT PASSWORD */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.old ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-600/80 bg-slate-800/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all duration-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, old: !show.old })}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-semibold uppercase tracking-wide text-indigo-300 hover:text-white transition-colors duration-150"
                >
                  {show.old ? "Hide" : "Show"}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-600/80 bg-slate-800/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all duration-200"
                  placeholder="Create a new password"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, new: !show.new })}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-semibold uppercase tracking-wide text-indigo-300 hover:text-white transition-colors duration-150"
                >
                  {show.new ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-600/80 bg-slate-800/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all duration-200"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, confirm: !show.confirm })
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-semibold uppercase tracking-wide text-indigo-300 hover:text-white transition-colors duration-150"
                >
                  {show.confirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-3 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-slate-700 text-slate-300 cursor-not-allowed opacity-80"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/40 hover:shadow-xl hover:from-indigo-500/95 hover:to-purple-500/95 hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
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
