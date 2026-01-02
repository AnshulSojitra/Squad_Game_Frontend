import { useEffect, useState } from "react";
import { getGrounds, deleteGround } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getGroundById ,updateGround } from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";

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

    
  // Filtering and Pagination
  const filteredGrounds = grounds.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedGrounds = filteredGrounds.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ground?")) return;

    try {
      await deleteGround(id);

      // remove from UI
      setGrounds((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert("Failed to delete ground");
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading grounds...</p>;
  }
  
    

  return (
    <div>


      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"> Grounds </h1>

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
              {grounds.length === 0 ? (
                <p className="col-span-full text-center text-gray-400">
                  No grounds available
                </p>
              ) : (
                grounds.map((ground) => (
                // console.log("GROUND OBJECT 👉", ground);
                <div
                  key={ground.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  
                  {/* Image */}
                  <div className="h-40 w-full bg-gray-100">
                    <img
                      src={
                        ground.images?.[0]
                          ? `${IMAGE_BASE}${ground.images[0].imageUrl}`
                          : "/placeholder.png"
                      }
                      alt={ground.name}
                      className="w-full h-full object-cover"
                    />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
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
                    ₹{ground.pricePerSlot}/hr
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  ⏰ {ground.openingTime} – {ground.closingTime}
                </p>

                <p className="text-sm text-gray-600">
                  📞 {ground.contactNo}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center border-t px-4 py-3">
                {/* <button
                  onClick={() =>
                    navigate(`/admin/addground?id=${ground._id}`)
                  }
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button> */}
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
              </div>
            </div>
            
          ))
        )}
      </div>

        {/* Pagination Controls */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-black border rounded text-white"
          >
            Prev
          </button>

          <button
            disabled={page * pageSize >= filteredGrounds.length}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-black border rounded text-white"
          >
            Next
          </button>
        </div>
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
