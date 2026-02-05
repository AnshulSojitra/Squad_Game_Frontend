import { useEffect, useState } from "react";
import { getGrounds, deleteGround } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getGroundById ,updateGround , toggleGroundBlockApi} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ReviewList from "../../components/common/ReviewList";
import Pagination from "../../components/common/Pagination";

const IMAGE_BASE=process.env.REACT_APP_IMAGE_URL


export default function Grounds() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groundId = searchParams.get("id");
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGroundId, setSelectedGroundId] = useState(null);
  const PAGE_SIZE = 6; // show 6 grounds per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isBlocked, setIsBlocked] = useState(grounds.isBlocked);
 
// Filtering and Pagination
const filteredGrounds = grounds
  .filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) =>
    a.name.toLowerCase().startsWith(search.toLowerCase()) ? -1 : 1
  );

 const totalPages = Math.ceil(filteredGrounds.length / PAGE_SIZE);


  

const paginatedGrounds = filteredGrounds.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);


  const fetchGrounds = async () => {
    try {
      const res = await getGrounds();
      setGrounds(res.data);
      console.log(
  "FINAL IMAGE URL 👉",
  grounds.images?.[0]
    ? `${IMAGE_BASE}${grounds.images[0].imageUrl}`
    : "NO IMAGE"
);
    } catch (err) {
      alert("Failed to fetch grounds");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchGrounds();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedGroundId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteGround(selectedGroundId);
      setGrounds((prev) => prev.filter((g) => g.id !== selectedGroundId));
    } catch (err) {
      alert("Failed to delete ground");
    } finally {
      setShowConfirm(false);
      setSelectedGroundId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedGroundId(null);
  };



  if (loading) {
    return <p className="text-gray-600">Loading grounds...</p>;
  }
  
   
  // block ground togglr button 
  //   const handleToggle = async () => {
  //   if (loading) return;

  //   try {
  //     setLoading(true);

  //     const res = await toggleGroundBlockApi(grounds.id);

  //     // backend is source of truth
  //     setIsBlocked(res.data.isBlocked);
  //   } catch (error) {
  //     console.error("Toggle failed", error);
  //     alert("Failed to update ground status");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleToggle = async (groundId) => {
  try {
    const res = await toggleGroundBlockApi(groundId);

    // update only that ground
    setGrounds((prev) =>
      prev.map((g) =>
        g.id === groundId
          ? { ...g, isBlocked: res.data.isBlocked }
          : g
      )
    );
  } catch (error) {
    console.error("Toggle failed", error);
    alert("Failed to update ground status");
  }
};


  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Grounds Management</h1>
          <p className="text-gray-400">Manage all your sports grounds</p>
        </div>
       <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search ground by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
            className="w-80 px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-300"
          />
        {/* Add Ground Button (TOP RIGHT) */}
        <button
          onClick={() => navigate("/admin/addground")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">➕</span>
            Add Ground
          </span>
        </button>
       </div>
       </div>

       <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGrounds.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🏟️</div>
                  <p className="text-gray-400 text-lg">No grounds available</p>
                  <p className="text-gray-500 text-sm">Add your first ground to get started</p>
                </div>
              ) : (
                paginatedGrounds.map((ground) => (
                <div
                  key={ground.id}
                   onClick={() => navigate(`/admin/grounds/${ground.id}`)}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 cursor-pointer border border-gray-700"
                >
                  
                  {/* Image */}
                  <div className="h-48 w-full bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}${ground.images[0].imageUrl}`}
                      alt={ground.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ground.isBlocked 
                          ? 'bg-red-500/90 text-white' 
                          : 'bg-green-500/90 text-white'
                      }`}>
                        {ground.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-white">
                  {ground.name}
                </h3>

                <p className="text-sm text-gray-400">
                  📍 {[
                    ground.area,
                    ground.city,
                    ground.state,
                    ground.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                    🎮 {ground.game}
                  </span>

                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                    💰 ₹{ground.pricePerSlot}/Slot
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    ⏰ {ground.openingTime} – {ground.closingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    📞 {ground.contactNo}
                  </span>
                </div>
               {ground.amenities?.length > 0 && (
                  <div className="mt-2 mb-2">
                    <p className="text-xs text-gray-400 mb-1">Amenities</p>

                    <div className="flex flex-wrap gap-2">
                      {ground.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={amenity.id ?? index}
                          className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full"
                        >
                          {typeof amenity === "string" ? amenity : amenity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center border-t px-4 py-3">
                <button 
                  onClick={(e) => {
                    if (!ground.id) {
                      console.error("Ground ID missing", ground);
                      return;
                    }
                    e.stopPropagation();
                    navigate(`/admin/addground?id=${ground.id}`);
                    
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  ✏️ Edit
                </button>


                <button
                   onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(ground.id);
                }}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  🗑️ Delete
                </button>
                
                 {/* <div>
                    <p
                      className={`text-sm ${
                        isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isBlocked ? "Blocked" : "Active"}
                    </p>
                  </div> */}

                  {/* <ToggleSwitch
                    enabled={isBlocked}
                    onToggle={handleToggle}
                  /> */}

                  <p
                    className={`text-sm ${
                      ground.isBlocked ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {ground.isBlocked ? "Blocked" : "Active"}
                  </p>

                  <ToggleSwitch
                    enabled={ground.isBlocked}
                    onToggle={() => handleToggle(ground.id)}
                  />

              </div>
              
            </div>
            
          ))
        )}
       </div>

        {/* Pagination Controls */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      </div>
  
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Ground?"
        message="Are you sure you want to delete this ground? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
