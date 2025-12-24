import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { addGround, updateGround, getGroundById } from "../../services/api";



export default function AddGround() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const groundId = searchParams.get("id");


  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    startTime: "",
    endTime: "",
    pricePerHour: "",
    game: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("contact", form.contact);
    formData.append("startTime", form.startTime);
    formData.append("endTime", form.endTime);
    formData.append("pricePerHour", form.pricePerHour);
    formData.append("game", form.game);

    // Only append image if user selected one (important for edit)
    if (image) {
      formData.append("image", image);
    }

    // 🔑 ADD vs EDIT logic
    if (groundId) {
      // EDIT existing ground
      await updateGround(groundId, formData);
    } else {
      // ADD new ground
      await addGround(formData);
    }

    navigate("/admin/grounds");
  } catch (err) {
    alert("Failed to save ground");
  } finally {
    setLoading(false);
  }
};


  return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                Add Ground
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                Enter ground details carefully
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ground Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ground Name
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border drop-shadow-sm"
                    />
                </div>

                {/* Contact */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                    </label>
                    <input
                    type="tel"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border drop-shadow-sm"
                    />
                </div>

                {/* Start Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                    </label>
                    <input
                    type="time"
                    name="startTime"
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 border shadow-sm border drop-shadow-sm"
                    />
                </div>

                {/* End Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                    </label>
                    <input
                    type="time"
                    name="endTime"
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 border drop-shadow-sm"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Hour (₹)
                    </label>
                    <input
                    type="number"
                    name="pricePerHour"
                    value={form.pricePerHour}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 border drop-shadow-sm"
                    />
                </div>

                {/* Game Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Game Type
                    </label>
                    <select
                    name="game"
                    value={form.game}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 border drop-shadow-sm"
                    >
                    <option value="">Select Game</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    </select>
                </div>
                </div>

                {/* Address */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <textarea
                    name="address"
                    rows="3"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 border drop-shadow-sm"
                />
                </div>

                {/* Image */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ground Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                    className="block w-full text-sm text-gray-600 border drop-shadow-sm"
                />
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-medium transition border drop-shadow-sm"
                >
                   {loading
                    ? "Saving..."
                    : groundId
                    ? "Update Ground"
                    : "Add Ground"}

                </button>
                </div>
            </form>
            </div>
        </div>
);
}
