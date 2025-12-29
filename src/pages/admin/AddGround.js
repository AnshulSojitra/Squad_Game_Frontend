import { useState } from "react";
import { useEffect } from "react";
import { addGround } from "../../services/api"; // make sure this import exists
import { getCountries, getStatesByCountry, getCitiesByState } from "../../services/api";


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

  const [errors, setErrors] = useState({});


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

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);




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
   getCountries().then((res) => setCountries(res.data));
}, [startTime, endTime]);


  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
};


const handleCountryChange = async (e) => {
  const countryId = e.target.value;
  setForm({ ...form, country: countryId, state: "", city: "" });
  setStates([]);
  setCities([]);

  const res = await getStatesByCountry(countryId);
  setStates(res.data);
};


const handleStateChange = async (e) => {
  const stateId = e.target.value;
  setForm({ ...form, state: stateId, city: "" });
  setCities([]);

  const res = await getCitiesByState(stateId);
  setCities(res.data);
};



  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };


      const validateForm = () => {
        const newErrors = {};

        if (!form.groundName || form.groundName.length < 3) {
          newErrors.groundName = "Ground name must be at least 3 characters";
        }

        if (!/^\d{10}$/.test(form.contact)) {
          newErrors.contact = "Contact number must be 10 digits";
        }

        if (!form.pricePerHour || Number(form.pricePerHour) <= 0) {
          newErrors.pricePerHour = "Price must be greater than 0";
        }

        if (!form.game) {
          newErrors.game = "Please select a game type";
        }

        if (!form.addressName) {
          newErrors.addressName = "Ground / House name is required";
        }

        if (!form.country) {
          newErrors.country = "Country is required";
        }

        if (!form.state) {
          newErrors.state = "State is required";
        }

        if (!form.city) {
          newErrors.city = "City is required";
        }

        if (!openingTime) {
          newErrors.openingTime = "Opening time is required";
        }

        if (!closingTime) {
          newErrors.closingTime = "Closing time is required";
        }

        if (slots.length === 0) {
          newErrors.slots = "Please add at least one slot";
        }

        if (images.length === 0) {
          newErrors.images = "Please upload at least one image";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-4 text-black">
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
          {errors.groundName && (
            <p className="text-red-500 text-xs mt-1">{errors.groundName}</p>
          )}

          {/* Contact */}
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            className="input-style"
            onChange={handleChange}
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
          )}

          {/* Price */}
          <label className="block text-sm font-medium mb-1">Price per Slot (₹)</label>
          <input
            type="number"
            name="pricePerHour"
            placeholder="Price per slot (₹)"
            className="input-style"
            onChange={handleChange}
          />
          {errors.pricePerHour && (
            <p className="text-red-500 text-xs mt-1">{errors.pricePerHour}</p>
          )}

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
          {errors.game && (
              <p className="text-red-500 text-xs mt-1">{errors.game}</p>
            )}

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
          <select
                name="country"
                className="input-style"
                onChange={handleCountryChange}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
           </select>

          <select
          name="state"
          className="input-style"
          onChange={handleStateChange}
          disabled={!states.length}
         >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

          <select
            name="city"
            className="input-style"
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
                  {errors.openingTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.openingTime}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Closing Time</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="input-style"
                  />
                  {errors.openingTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.openingTime}</p>
                )}
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
                  {errors.slots && (
                      <p className="text-red-500 text-xs mt-1">{errors.slots}</p>
                    )}

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
          {errors.images && (
            <p className="text-red-500 text-xs mt-1">{errors.images}</p>
          )}


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
