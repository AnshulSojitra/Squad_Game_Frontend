import { useEffect, useState } from "react";
import { getGrounds, deleteGround } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getGroundById ,updateGround , toggleGroundBlockApi} from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import ReviewList from "../../components/common/ReviewList";

const IMAGE_BASE=process.env.REACT_APP_IMAGE_URL


export default function Grounds() {
  const navigate = useNavigate();
  const pageSize = 5;
  const [searchParams] = useSearchParams();
  const groundId = searchParams.get("id");
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
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
    <div>


      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"> Grounds </h1>
       <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search ground by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>
        {/* Add Ground Button (TOP RIGHT) */}
        <button
          onClick={() => navigate("/admin/addground")}
          className="px-5 py-2 font-medium transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          ➕ Add Ground
        </button>
       </div>

       <div className="overflow-x-auto bg-gray shadow rounded-xl">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGrounds.length === 0 ? (
                <p className="col-span-full text-center text-gray-400">
                  No grounds available
                </p>
              ) : (
                paginatedGrounds.map((ground) => (
                // console.log("GROUND OBJECT 👉", ground);
                <div
                  key={ground.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  
                  {/* Image */}
                  <div className="h-40 w-full bg-gray-100">
                    <img
                      src={`${process.env.REACT_APP_IMAGE_URL}${ground.images[0].imageUrl}`}
                      alt={ground.name}
                      className="w-full h-full object-cover"
                    />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {ground.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {[
                    ground.area,
                    ground.city,
                    ground.state,
                    ground.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <div className="flex flex-wrap gap-2 text-sm mt-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                    {ground.game}
                  </span>

                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                    ₹{ground.pricePerSlot}/Slot
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  ⏰ {ground.openingTime} – {ground.closingTime}
                </p>

                <p className="text-sm text-gray-600">
                  📞 {ground.contactNo}
                </p>
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
                  onClick={() => {
                    if (!ground.id) {
                      console.error("Ground ID missing", ground);
                      return;
                    }
                    navigate(`/admin/addground?id=${ground.id}`);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>


                <button
                  onClick={() => openDeleteModal(ground.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
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
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
      {/* Reviews */}
           <div className="max-w-4xl mx-auto p-4">
                   <h1 className="text-xl font-bold mb-4 text-white">Ground Reviews</h1>
                   <ReviewList groundId={groundId} />
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
