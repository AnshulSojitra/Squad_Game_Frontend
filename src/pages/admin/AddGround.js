import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addGround , updateGround , getGroundById } from "../../services/api"; // make sure this import exists
import { getCountries, getStatesByCountry, getCitiesByState } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import Toast from "../../components/common/Toast";
import LocationPicker from "../../components/common/LocationPicker";



export default function AddGround() {
  const [form, setForm] = useState({
    groundName: "",
    contact: "",
    pricePerHour: "",
    game: "",
    area: "",
    country: "",
    state: "",
    city: "",
    locationUrl: "",
    slots: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [slots, setSlots] = useState([]);

  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");


  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  


  const [searchParams] = useSearchParams();
  const groundId = searchParams.get("id");
  const isEdit = Boolean(groundId);
  const id = searchParams.get("id");

  const [images, setImages] = useState([]);           // new uploaded files
  const [existingImages, setExistingImages] = useState([]); // images from backend
  const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL;
  const [toast, setToast] = useState({
  show: false,
  type: "success",
  message: "",
});

  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);

  const [advanceBookingDays, setAdvanceBookingDays] = useState("");






const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

// for Amenities
const handleAddAmenity = () => {
  if (!amenityInput.trim()) return;

  if (amenities.length >= 10) {
    setErrors((prev) => ({
      ...prev,
      amenities: "Maximum 10 amenities allowed",
    }));
    return;
  }

  if (amenities.includes(amenityInput.trim())) return;

  setAmenities([...amenities, amenityInput.trim()]);
  setAmenityInput("");
};

// remove amenities
const handleRemoveAmenity = (index) => {
  setAmenities(amenities.filter((_, i) => i !== index));
};


const handleAddSlot = () => {
  // Determine start time
  const startTime =
    slots.length === 0
      ? slotStart
      : slots[slots.length - 1].end;

  if (!startTime || !slotEnd) {
     showToast("error", "Select start and end time");
    // alert("Select start and end time");
    return;
  }

  // Opening / closing validation
  if (startTime < openingTime || slotEnd > closingTime) {
    showToast("error", "Slot must be within opening and closing time");
    //alert("Slot must be within opening and closing time");
    return;
  }

  if (startTime >= slotEnd) {
    showToast("error", "End time must be after start time");
    //alert("End time must be after start time");
    return;
  }

  setSlots((prev) => [
    ...prev,
    {
      id: Date.now(),
      start: startTime,
      end: slotEnd,
    },
  ]);

  // IMPORTANT: reset ONLY end time
  setSlotEnd("");
};


const removeSlot = (indexToRemove) => {
  setSlots(prevSlots =>
    prevSlots.filter((_, index) => index !== indexToRemove)
  );
};



// 1. Load countries once
useEffect(() => {
  getCountries().then((res) => setCountries(res.data));
}, []);



useEffect(() => {
  if (!groundId) return;

  const fetchGroundForEdit = async () => {
    const res = await getGroundById(groundId);
    const g = res.data;
    const normalizedSlots = Array.isArray(g.Slots)
  ? g.Slots.map((s) => ({
      id: s.id,
      start: s.startTime,
      end: s.endTime,
    }))
  : [];

  

setSlots(normalizedSlots);


    console.log("EDIT DATA", res.data);
console.log(`${process.env.REACT_APP_IMAGE_URL}${res.data.images[0].imageUrl}`);
    setForm({
      groundName: g.name,
      contact: g.contactNo,
      pricePerHour: g.pricePerSlot,
      game: g.game,
      area: g.area,
      country: g.country,
      state: g.state,
      city: g.city,
      // locationUrl: g.locationUrl || "",
      latitude: g.lat,
      longitude: g.lng,
    });

    setAmenities(
      g.amenities?.map(a =>
        typeof a === "string" ? a : a.name
      ) || []
    );


    setOpeningTime(g.openingTime);
    setClosingTime(g.closingTime);
      
      setSlots(
        (g.Slots || []).map(slot => ({
           start: slot.startTime,
           end: slot.endTime,
         }))
      );

      setImages(g.images);
    setExistingImages(g.images || []);


    setLocation({
      lat: Number(g.latitude),
      lng: Number(g.longitude),
    });

  

// Load states and cities based on existing data
    const statesRes = await getStatesByCountry(g.country);
    setStates(statesRes.data);

    const citiesRes = await getCitiesByState(g.state);
    setCities(citiesRes.data);

    setAdvanceBookingDays(g.advanceBookingDays ?? 0);


    
  };

console.log("EDIT MODE:", groundId);
console.log("SLOTS STATE 👉", slots, Array.isArray(slots));



  fetchGroundForEdit();
}, [groundId]);


  const handleChange = (e) => {
  // setForm({ ...form, [e.target.name]: e.target.value });
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
  const files = Array.from(e.target.files);
  setImages(files);
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

        if (!form.game || form.game.trim().length < 3) {
          newErrors.game = "game name must be atleast of 3 letters";
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
        // if (
        //   !form.locationUrl ||
        //   (!form.locationUrl.includes("google.com/maps") &&
        //   !form.locationUrl.includes("maps.app.goo.gl"))
        // ) {
        //   newErrors.locationUrl = "Please enter a valid Google Maps link";
        // }

        if (!openingTime) {
          newErrors.openingTime = "Opening time is required";
        }

        if (!closingTime) {
          newErrors.closingTime = "Closing time is required";
        }

        if (slots.length === 0) {
          newErrors.slots = "Please add at least one slot";
        }
        if (amenities.length === 0) {
          newErrors.amenities = "Please add at least one amenity";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
      };

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

   // ⛔ Prevent multiple submissions
  if (loading) return;


  try {

    setLoading(true); // LOCK BUTTON

    const formData = new FormData();

    // Basic fields
    formData.append("groundName", form.groundName);
    formData.append("contact", form.contact);
    formData.append("pricePerHour", form.pricePerHour);
    formData.append("game", form.game);

    // Address fields
    // formData.append("addressName", form.addressName);
    formData.append("area", form.area);
    formData.append("country", form.country);
    formData.append("state", form.state);
    formData.append("city", form.city);
    // formData.append("locationUrl", form.locationUrl); // ✅ REQUIRED
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);

    
    // Amenities
    formData.append("amenities", JSON.stringify(amenities));


    // Time info
    formData.append("openingTime", openingTime);
    formData.append("closingTime", closingTime);

    // Slots (IMPORTANT → stringify)
    formData.append("slots", JSON.stringify(slots));

    formData.append("advanceBookingDays", advanceBookingDays);


    if (images.length > 0) {
      images.forEach(img => {
    formData.append("images", img);
  });
}


    console.log("FORM DATA VALUES:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

    // API call
    if (groundId) {
    await updateGround(groundId, formData);
    showToast("success", "Ground updated successfully");
  } else {
    await addGround(formData);
    showToast("success", "Ground added successfully");
  }

  setTimeout(() => {
    navigate("/admin/grounds");
  }, 1200);

} catch (err) {
  console.error(err);
  showToast("error", "Failed to save ground");
  setLoading(false); // UNLOCK BUTTON
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
            value={form.groundName}
             onChange={(e) =>
              setForm({ ...form, groundName: e.target.value })
            }
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
            value={form.contact}
            onChange={(e) =>
              setForm({ ...form, contact: e.target.value })
            }
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
          )}

          

          <label className="block text-sm font-medium mb-1">
            Game Type
          </label>

          <input
            type="text"
            name="game"
            placeholder="e.g. Cricket, Pickleball, Tennis"
            className="input-style"
            value={form.game}
            onChange={(e) =>
              setForm({ ...form, game: e.target.value })
            }
          />

          {errors.game && (
            <p className="text-red-500 text-xs mt-1">
              {errors.game}
            </p>
          )}
          {/* {errors.game && (
              <p className="text-red-500 text-xs mt-1">{errors.game}</p>
            )} */}

          {/* Address */}
          <label className="block text-sm font-medium mb-1">Address</label>
          <label className="block text-sm font-medium mb-1">Area</label>
          <input
            type="text"
            name="area"
            placeholder="Area Name"
            className="input-style"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />

          {/* Country / State / City */}
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
                name="country"
                className="input-style"
                onChange={handleCountryChange}
                value={form.country}
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
          value={form.state}
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
            value={form.city}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>


          {/* <label className="block text-sm font-medium mb-1">
            Google Maps Location Link
          </label>

          <input
            type="url"
            name="locationUrl"
            placeholder="https://maps.google.com/?q=..."
            className="input-style"
            value={form.locationUrl}
            onChange={(e) =>
              setForm({ ...form, locationUrl: e.target.value })
            }
          /> */}

          <label className="block text-sm font-medium mb-2">
            Select Ground Location
          </label>

          <LocationPicker
            value={location}
            onChange={(coords) => setLocation(coords)}
          />


          {errors.locationUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.locationUrl}</p>
          )}



            {/* Amenities */}
              <label className="block text-sm font-medium mb-1">
                Amenities (Max 10)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="e.g. Parking, Washroom"
                  className="input-style flex-1"
                />

                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-indigo-600 text-white px-4 rounded-lg"
                >
                  Add
                </button>
              </div>

              {errors.amenities && (
                <p className="text-red-500 text-xs mt-1">{errors.amenities}</p>
              )}

              {/* Amenities List */}
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {amenities.map((a, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}


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
                        value={
                          slots.length === 0
                            ? slotStart
                            : slots[slots.length - 1].end
                        }
                        disabled={slots.length > 0}
                        onChange={(e) => setSlotStart(e.target.value)}
                        className={`input-style ${
                          slots.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
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
                  
                    {slots.map((slot,index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        <span className="text-sm">
                          {slot.start} - {slot.end}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              <label className="block text-sm font-medium mb-1">
                Advance Booking Allowed (Days)
              </label>

              <input
                type="number"
                min="0"
                placeholder="e.g. 7"
                value={advanceBookingDays}
                onChange={(e) => setAdvanceBookingDays(e.target.value)}
                className="input-style"
              />

              <p className="text-xs text-gray-500">
                player can book up to {advanceBookingDays || 0} days in advance
              </p>



              {/* Price */}
          <label className="block text-sm font-medium mb-1 my-6">Price per Slot (₹)</label>
          <input
            type="number"
            name="pricePerHour"
            placeholder="Price per slot (₹)"
            className="input-style"
            value={form.pricePerHour}
            onChange={(e) =>
              setForm({ ...form, pricePerHour: e.target.value })
            }
          />
          {errors.pricePerHour && (
            <p className="text-red-500 text-xs mt-1">{errors.pricePerHour}</p>
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
         




          {/* New Image Previews */}
          {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={`${IMAGE_BASE}${img.imageUrl}`}
                    className="h-24 w-full object-cover rounded-lg border"
                    alt="preview"
                    />
                ))}
              </div>
            )}
            

            {loading && (
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <span className="animate-spin">⏳</span>
                  Please wait, adding ground...
                </div>
             )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"}
            `}
          >
            {loading ? "Saving Ground..." : groundId ? "Update Ground" : "Add Ground"}
          </button>

        </form>
       
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />

      </div>
    </div>
  );
};