import { useEffect, useState } from "react";
import { getUserProfile, changeUserName } from "../../services/api";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        const user = res.data.user || res.data;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || user.phoneNumber || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  /* ================= SAFE USER PARSER ================= */
  const getSafeStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  /* ================= SAVE NAME ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await changeUserName(formData.name);
      // HTTP 200 = success

      const storedUser = getSafeStoredUser();

      const updatedUser = {
        ...storedUser,
        name: res.data.name,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setFormData((prev) => ({
        ...prev,
        name: res.data.name,
      }));

      // notify navbar/sidebar
      window.dispatchEvent(new Event("userUpdated"));

      setStatus("success");
    } catch (err) {
      console.error("Failed to update name:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24">
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg
                         text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600
                         rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              disabled
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600
                         rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* STATUS */}
          {status === "success" && (
            <p className="text-sm text-green-400 text-center">
              ✅ Name updated successfully
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-400 text-center">
              ❌ Failed to update name
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:from-indigo-700 hover:to-purple-700
                       text-white py-3 rounded-lg font-semibold
                       transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
