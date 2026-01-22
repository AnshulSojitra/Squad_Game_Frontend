import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminGrounds , toggleGroundBlock } from "../../services/api";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import Pagination from "../../components/common/Pagination";

export default function SuperAdminAdminDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [grounds, setGrounds] = useState([]);


  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(grounds.length / ITEMS_PER_PAGE);

  const paginatedGrounds = grounds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  /* ---------------- FETCH ADMIN GROUNDS ---------------- */
  useEffect(() => {
    fetchAdminGrounds();
  }, []);

  const fetchAdminGrounds = async () => {
    const res = await getAdminGrounds(adminId);
    setAdmin(res.data.admin);
    setGrounds(res.data.grounds);
  };

  const handleToggleGroundBlock = async (ground) => {
  try {
    await toggleGroundBlock(ground.id);

    // Optimistic UI update
    setGrounds((prev) =>
      prev.map((g) =>
        g.id === ground.id
          ? { ...g, isBlocked: !g.isBlocked }
          : g
      )
    );
  } catch (error) {
    console.error(error);
    alert("Failed to update ground status");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-white mb-6">
        Admin Details
      </h2>

      {/* Admin Info Card */}
      {admin && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {admin.name}
          </h3>
          <p className="text-gray-600">{admin.email}</p>
          <p className="text-gray-600">{admin.phoneNumber}</p>
        </div>
      )}

      {/* Grounds Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Grounds
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Number</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Price / Slot</th>
                <th className="px-6 py-4">Active</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedGrounds.map((ground, index) => (
                <tr
                  key={ground.id}
                  onClick={() =>
                    navigate(`/super-admin/grounds/${ground.id}/bookings`)
                  }
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-6 py-4 text-gray-600">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {ground.name}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {ground.contactNo}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {ground.game}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {ground.city}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ₹{ground.pricePerSlot}
                  </td>

                  {/* <td className="px-6 py-4">
                    {ground.isActive ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        No
                      </span>
                    )}
                  </td> */}

                  {/* Active / Blocked */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${ground.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"}
                      `}
                    >
                      {ground.isBlocked ? "Blocked" : "Active"}
                    </span>

                    <ToggleSwitch
                      enabled={ground.isBlocked}
                      onToggle={() => handleToggleGroundBlock(ground)}
                    />
                  </td>
                </tr>
              ))}

              {grounds.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No grounds found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

    </div>
  );
}
