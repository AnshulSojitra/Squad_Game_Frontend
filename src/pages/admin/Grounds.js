import { useEffect, useState } from "react";
import { getGrounds, deleteGround } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getGroundById } from "../../services/api";


export default function Grounds() {
  const navigate = useNavigate();
  const pageSize = 5;
  const [searchParams] = useSearchParams();
  const groundId = searchParams.get("id");
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    startTime: "",
    endTime: "",
    pricePerHour: "",
    game: "",
  });


  const fetchGrounds = async () => {
    try {
      const res = await getGrounds();
      setGrounds(res.data);
    } catch (err) {
      alert("Failed to fetch grounds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrounds();
  }, []);

  useEffect(() => {
  if (groundId) {
    const fetchGround = async () => {
      try {
        const res = await getGroundById(groundId);
        setForm({
          name: res.data.name,
          address: res.data.address,
          contact: res.data.contact,
          startTime: res.data.startTime,
          endTime: res.data.endTime,
          pricePerHour: res.data.pricePerHour,
          game: res.data.game,
        });
      } catch (err) {
        alert("Failed to load ground");
      }
    };

    fetchGround();
  }
}, [groundId]);

// Filtering and Pagination
const filteredGrounds = grounds.filter((g) =>
  g.name.toLowerCase().includes(search.toLowerCase())
);

const paginatedGrounds = filteredGrounds.slice(
  (page - 1) * pageSize,
  page * pageSize
);



  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ground?")) return;

    try {
      await deleteGround(id);
      setGrounds(grounds.filter((g) => g._id !== id));
    } catch (err) {
      alert("Failed to delete ground");
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading grounds...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grounds</h1>

        <button
          onClick={() => navigate("/admin/add-ground")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add Ground
        </button>
      </div>

        <input
          type="text"
          placeholder="Search by ground name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 mb-4"
        />


      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Game</th>
              <th className="p-3">Price/hr</th>
              <th className="p-3">Timing</th>
              <th className="p-3">Contact</th>
              <th className="p-3 text-center">Actions</th>
              <th className="p-3">Image</th>
            </tr>
          </thead>

          <tbody>
            {grounds.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No grounds available
                </td>
              </tr>
            ) : (
              grounds.map((ground) => (
                <tr key={ground._id} className="border-t">
                  <td className="p-3 font-medium">{ground.name}</td>
                  <td className="p-3 text-center">{ground.game}</td>
                  <td className="p-3 text-center">₹{ground.pricePerHour}</td>
                  <td className="p-3 text-center">
                    {ground.startTime} - {ground.endTime}
                  </td>
                  <td className="p-3 text-center">{ground.contact}</td>
                  <td className="p-3">
                    <img
                      src={`http://localhost:5000/uploads/${ground.image}`}
                      alt={ground.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>


                  <td className="p-3 flex justify-center gap-3">
                    {/* Edit */}
                    <button
                    onClick={() =>
                      navigate(`/admin/add-ground?id=${ground._id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>


                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(ground._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
         <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <button
            disabled={page * pageSize >= filteredGrounds.length}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
