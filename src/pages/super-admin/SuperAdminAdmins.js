import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdmins, toggleAdminBlock } from "../../services/api";

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  /* ---------------- Toggle Component ---------------- */
  function ToggleSwitch({ enabled, onToggle }) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // 🚨 stop row click
          onToggle();
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${enabled ? "bg-red-500" : "bg-green-500"}
        `}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${enabled ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    );
  }

  /* ---------------- Fetch Admins ---------------- */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.admins);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Toggle Block / Unblock ---------------- */
  const handleToggleBlock = async (admin) => {
    try {
      await toggleAdminBlock(admin.id);

      // Optimistic UI update
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id
            ? { ...a, isBlocked: !a.isBlocked }
            : a
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Admins
      </h2>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {admins.map((admin, index) => (
                <tr
                  key={admin.id}
                  onClick={() =>
                    navigate(`/super-admin/admins/${admin.id}`)
                  }
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {admin.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {admin.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {admin.role}
                    </span>
                  </td>

                  {/* Status + Toggle */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          admin.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {admin.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <ToggleSwitch
                      enabled={admin.isBlocked}
                      onToggle={() => handleToggleBlock(admin)}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
