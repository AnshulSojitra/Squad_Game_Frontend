import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addGround , updateGround , getGroundById } from "../../services/api"; // make sure this import exists
import { getCountries, getStatesByCountry, getCitiesByState } from "../../services/api";
import { useSearchParams } from "react-router-dom";




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
    slots: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  
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

  // setSlots([...slots, { start: slotStart, end: slotEnd }]);
   setSlots((prev) => [
    ...prev,
    { start: slotStart, end: slotEnd }
  ]);

  setSlotStart("");
  setSlotEnd("");
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
    });

    setOpeningTime(g.openingTime);
    setClosingTime(g.closingTime);
    setSlots(
        (g.Slots || []).map(slot => ({
          start: slot.startTime,
          end: slot.endTime,
        }))
      );
      
      setImages(g.images);
      

// Load states and cities based on existing data
    const statesRes = await getStatesByCountry(g.country);
    setStates(statesRes.data);

    const citiesRes = await getCitiesByState(g.state);
    setCities(citiesRes.data);
  };

console.log("EDIT MODE:", groundId);


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



  // setExistingImages(g.images || []);


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

        if (!form.game) {
          newErrors.game = "Please select a game type";
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


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
      };

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const formData = new FormData();

    // Basic fields
    formData.append("name", form.groundName);
    formData.append("contactNo", form.contact);
    formData.append("pricePerSlot", form.pricePerHour);
    formData.append("game", form.game);

    // Address fields
    // formData.append("addressName", form.addressName);
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
    // images.forEach((img) => {
    //   formData.append("images", img);
    // });
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
      alert("Ground updated successfully");
    } else {
      await addGround(formData);
      alert("Ground added successfully");
    }
    navigate("/admin/grounds");
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

          {/* Price */}
          <label className="block text-sm font-medium mb-1">Price per Slot (₹)</label>
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

          {/* Game Type */}
          <label className="block text-sm font-medium mb-1">Game Type</label>
          <select
            name="game"
            className="input-style"
            onChange={(e) =>
              setForm({ ...form, game: e.target.value })
            }
            value={form.game}
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
                    {slots.map((slots, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        <span className="text-sm">
                          {slots.start} - {slots.end}
                        </span>

                        <button
                          type="button"
                          onClick={() =>{
                            console.log("slot.................",slots)
                            
                            setSlots(slots.filter((_, i) => i !== index))}
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


          {/* {images.length > 0 && (
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
          )} */}

          {isEdit && images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img) => (
                  <img
                    key={img.id}
                    
                    src={`https://imgs.search.brave.com/jtENFihhAr-Ew6NvAfw7SmtHrVacGvyNgo280nYKv70/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvY2xv/dWR5LWJsdWUtcy0y/dnIxbTJrNTU0cGM0/ZWRoLmpwZw`}
                    className="h-24 w-full object-cover rounded-lg border"
                    alt="preview"
                    />
                ))}
              </div>
            )}
            
            {/* {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_IMAGE_URL}${img.imageUrl}`}
                    alt="preview"
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            )} */}



          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
          >
             {groundId ? "Update Ground" : "Add Ground"}
          </button>
        </form>
      </div>
    </div>
  );
};