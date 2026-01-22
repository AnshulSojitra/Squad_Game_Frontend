import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGroundsSupAdi , toggleGroundBlock } from "../../services/api";
import Pagination from "../../components/common/Pagination";
import ToggleSwitch from "../../components/common/ToggleSwitch";




const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;

export default function SuperAdminGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  
  const totalPages = Math.ceil(grounds.length / ITEMS_PER_PAGE);

  const paginatedGrounds = grounds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  /* ================= FETCH GROUNDS ================= */
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
       // const res = await getAllGroundsSupAdi(); // ✅ FIXED
       // setGrounds(res.data);          // backend returns array
      const res = await getAllGroundsSupAdi();

      // ✅ SAFELY extract array
      const groundsArray =
        res.data?.grounds ||
        res.data?.data ||
        res.data ||
        [];

      setGrounds(Array.isArray(groundsArray) ? groundsArray : []);
      } catch (err) {
        console.error("Failed to load grounds", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  //================= TOGGLE BLOCK GROUNDS ================= //
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

  if (loading) {
    return (
      <p className="text-center mt-10 text-white">
        Loading grounds...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <h1 className="text-2xl font-bold mb-8 text-white">
        All Grounds
      </h1>

      {grounds.length === 0 ? (
        <p className="text-center text-gray-400">
          No grounds found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedGrounds.map((ground) => (
            <div
              key={ground.id}
              onClick={() =>
                navigate(`/super-admin/grounds/${ground.id}/bookings`)
              }
              className="bg-white rounded-2xl overflow-hidden shadow-lg
                         hover:shadow-2xl transition-all cursor-pointer
                         hover:-translate-y-1"
            >
              {/* IMAGE */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={
                    ground.images?.[0]
                      ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
                      : "/placeholder.png"
                  }
                  alt={ground.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* DETAILS */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {ground.name}
                </h3>
                <div className="text-sm text-gray-500">
                   Ground Owner :
                
                  <h6 className="text-lg font-semibold text-gray-900">
                  {ground.admin.name}
                </h6>
                  </div>

                <p className="text-sm text-gray-500">
                  {[ground.area, ground.city, ground.state, ground.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <p className="text-sm text-gray-600">
                  ⏰ {ground.openingTime} – {ground.closingTime}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {ground.game}
                  </span>

                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    ₹{ground.pricePerSlot}/slot
                  </span>
                </div>

                {/* AMENITIES */}
                {ground.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {ground.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a.id}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {a.name}
                      </span>
                    ))}
                    {ground.amenities.length > 4 && (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                        +{ground.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* FOOTER */}
                <div className="pt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        ground.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {ground.isBlocked ? "Blocked" : "Active"}
                  </span>

                  <span className="text-sm font-medium text-indigo-600">
                    View bookings →
                  </span>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${ground.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"}
                        `}
                      >
                        {ground.isBlocked ? "Blocked" : "Active"}
                      </span> */}

                      <ToggleSwitch
                        enabled={ground.isBlocked}
                        onToggle={() => handleToggleGroundBlock(ground)}
                      />
                </div>    
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />

    </div>
  );
}
