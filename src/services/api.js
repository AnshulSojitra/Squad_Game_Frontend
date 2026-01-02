import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // your backend base URL
  // baseURL: "https://indissolubly-unadmonitory-pinkie.ngrok-free.dev/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

// CREATE - Register Admin
// export const registerAdmin = (data) => {
//   return api.post("/admin/register", data);
// };

// Attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// READ - Login Admin
export const loginAdmin = (data) => {
  return api.post("/admin/login", data);
};

// UPDATE - Update Admin
export const updateAdmin = (id, data) => {
  return api.put(`/admin/${id}`, data);
};

// DELETE - Delete Admin
export const deleteAdmin = (id) => {
  return api.delete(`/admin/${id}`);
};

/* ================= USER APIs ================= */

// CREATE - User Registration
export const userRegister = (data) => {
  return api.post("/user/register", data);
};

// READ - User Login
export const userLogin = (data) => {
  return api.post("/user/login", data);
};

// READ - Get user bookings
export const getMyBookings = (token) => {
  return api.get("/user/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/* -------- GROUNDS -------- */

// Add ground
export const addGround = (formData) => {
  const token = localStorage.getItem("adminToken");

  return api.post("/admin/grounds", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all grounds
export const getGrounds = () => {
  const token = localStorage.getItem("adminToken");
  return api.get("/admin/grounds", {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
  });
};

// Get single ground
export const getGroundById = (id) => {
  return api.get(`/admin/grounds/${id}`,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

//Delete ground
export const deleteGround = (id) => {
  return api.delete(`/admin/grounds/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

// Update ground
export const updateGround = (id, formData) =>
  api.put(`/admin/grounds/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "multipart/form-data",
    },
  });

// LOCATION APIs
export const getCountries = () => api.get("/location/countries", {
  headers:{"ngrok-skip-browser-warning": "true",}
});

export const getStatesByCountry = (countryId) =>
  api.get(`/location/states/${countryId}`, {
  headers:{"ngrok-skip-browser-warning": "true",}
});

export const getCitiesByState = (stateId) =>
  api.get(`/location/cities/${stateId}`, {
  headers:{"ngrok-skip-browser-warning": "true",}
});

/* -------- BOOKINGS -------- */

// CREATE BOOKING
export const createBooking = (data) => {
  return api.post("/user/bookings", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};

// GET BOOKINGS (My Bookings)
export const getUserBookings = () => {
  return api.get("/user/bookings", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};

export default api;
