import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  toggleUserBlock,
} from "../../services/api";



export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


const handleToggleBlock = async (user) => {
  try {
    setLoadingId(user.id);
    await toggleUserBlock(user.id);   // ✅ SINGLE API
    await fetchUsers();
  } catch (error) {
    console.error("Block/unblock failed", error);
  } finally {
    setLoadingId(null);
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">All Users</h1>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/super-admin/users/${u.id}/bookings`)
                }
              >
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>

                <td className="p-3">
                  {u.isBlocked ? (
                    <span className="text-red-600 font-medium">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Active
                    </span>
                  )}
                </td>

                <td
                  className="p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleToggleBlock(u)}
                    disabled={loadingId === u.id}
                    className={`px-4 py-1 rounded text-white ${
                      u.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {loadingId === u.id
                      ? "Please wait..."
                      : u.isBlocked
                      ? "Unblock"
                      : "Block"}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
