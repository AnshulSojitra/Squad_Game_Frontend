import { useState } from "react";
import { useEffect } from "react";
import { addGround } from "../../services/api"; // make sure this import exists


export default function AddGround() {
  const [form, setForm] = useState({
    groundName: "",
    contact: "",
    pricePerHour: "",
    game: "",
    addressName: "",
    area: "",
    country: "",
    state: "",
    city: "",
    slots: [],
  });

  
  const [images, setImages] = useState([]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  const [slots, setSlots] = useState([]);



  const generateSlots = (start, end) => {
  if (!start || !end) return [];

  const slots = [];
  let startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);

  if (endDate <= startDate) return [];

  while (startDate < endDate) {
    let next = new Date(startDate);
    next.setHours(startDate.getHours() + 1);

    if (next > endDate) break;

    slots.push(
      `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
       ${next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );

    startDate = next;
  }

  return slots;
};


const handleAddSlot = () => {
  if (!slotStart || !slotEnd) {
    alert("Select start and end time");
    return;
  }

  // Opening / closing validation
  if (slotStart < openingTime || slotEnd > closingTime) {
    alert("Slot must be within opening and closing time");
    return;
  }

  // Sequential validation
  if (slots.length > 0) {
    const lastSlot = slots[slots.length - 1];
    if (slotStart !== lastSlot.end) {
      alert("Slot must start from previous slot's end time");
      return;
    }
  }

  if (slotStart >= slotEnd) {
    alert("End time must be after start time");
    return;
  }

  setSlots([...slots, { start: slotStart, end: slotEnd }]);
  setSlotStart("");
  setSlotEnd("");
};



useEffect(() => {
  const slots = generateSlots(startTime, endTime);
  setGeneratedSlots(slots);
  setSelectedSlots([]);
}, [startTime, endTime]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

    const validateForm = () => {
      if (!form.groundName || form.groundName.length < 3) {
        alert("Ground name must be at least 3 characters");
        return false;
      }

      if (!/^\d{10}$/.test(form.contact)) {
        alert("Contact number must be 10 digits");
        return false;
      }

      if (!form.pricePerHour || Number(form.pricePerHour) <= 0) {
        alert("Price per slot must be greater than 0");
        return false;
      }

      if (!form.game) {
        alert("Please select a game type");
        return false;
      }

      if (!form.addressName || !form.country || !form.state || !form.city) {
        alert("Please complete the address fields");
        return false;
      }

      if (!openingTime || !closingTime) {
        alert("Opening and closing time are required");
        return false;
      }

      if (slots.length === 0) {
        alert("Please add at least one time slot");
        return false;
      }

      if (images.length === 0) {
        alert("Please upload at least one image");
        return false;
      }

      return true;
    };


  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const formData = new FormData();

    // Basic fields
    formData.append("groundName", form.groundName);
    formData.append("contact", form.contact);
    formData.append("pricePerHour", form.pricePerHour);
    formData.append("game", form.game);

    // Address fields
    formData.append("addressName", form.addressName);
    formData.append("area", form.area);
    formData.append("country", form.country);
    formData.append("state", form.state);
    formData.append("city", form.city);

    // Time info
    formData.append("openingTime", openingTime);
    formData.append("closingTime", closingTime);

    // Slots (IMPORTANT → stringify)
    formData.append("slots", JSON.stringify(slots));

    // Images (multiple)
    images.forEach((img) => {
      formData.append("images", img);
    });

    // API call
    await addGround(formData);

    alert("Ground added successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to add ground");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-1">
          Add Ground
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter ground details carefully
        </p>

        <label className="block text-sm font-medium mb-1">Ground Details</label>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ground Name */}
          <input
            type="text"
            name="groundName"
            placeholder="Ground Name"
            className="input-style"
            onChange={handleChange}
          />

          {/* Contact */}
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            className="input-style"
            onChange={handleChange}
          />

          {/* Price */}
          <label className="block text-sm font-medium mb-1">Price per Slot (₹)</label>
          <input
            type="number"
            name="pricePerHour"
            placeholder="Price per slot (₹)"
            className="input-style"
            onChange={handleChange}
          />

          {/* Game Type */}
          <label className="block text-sm font-medium mb-1">Game Type</label>
          <select
            name="game"
            className="input-style"
            onChange={handleChange}
          >
            <option value="">Select Game</option>
            <option value="Cricket">Cricket</option>
            <option value="Badminton">Badminton</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
          </select>

          {/* Address */}
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="addressName"
            placeholder="Ground / House Name"
            className="input-style"
            onChange={handleChange}
          />
          <label className="block text-sm font-medium mb-1">Area</label>
          <input
            type="text"
            name="area"
            placeholder="Area Name"
            className="input-style"
            onChange={handleChange}
          />

          {/* Country / State / City */}
          <label className="block text-sm font-medium mb-1">Location</label>
          <select name="country" className="input-style">
            <option value="">Select Country</option>
          </select>

          <select name="state" className="input-style">
            <option value="">Select State</option>
          </select>

          <select name="city" className="input-style">
            <option value="">Select City</option>
          </select>

          {/* Time Slots */}
          <div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Opening Time</label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="input-style"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Closing Time</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="input-style"
                  />
                </div>
              </div>


              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Add Time Slot</p>

                <div className="grid grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs">Start Time</label>
                    <input
                      type="time"
                      value={slotStart}
                      onChange={(e) => setSlotStart(e.target.value)}
                      className="input-style"
                    />
                  </div>

                  <div>
                    <label className="text-xs">End Time</label>
                    <input
                      type="time"
                      value={slotEnd}
                      onChange={(e) => setSlotEnd(e.target.value)}
                      className="input-style"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Add Slot
                  </button>
                </div>
              </div>


              {slots.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Created Slots</p>

                  <div className="space-y-2">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        <span className="text-sm">
                          {slot.start} - {slot.end}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setSlots(slots.filter((_, i) => i !== index))
                          }
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


          </div>
          {/* Images */}
          <label className="block text-sm font-medium mb-1">Upload Images</label>
         <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            className="input-style"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-24 w-full object-cover rounded-lg border"
                />
              ))}
            </div>
          )}


          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
          >
            Add Ground
          </button>
        </form>
      </div>
    </div>
  );
}
