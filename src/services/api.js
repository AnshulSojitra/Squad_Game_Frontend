import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // your backend base URL
  // baseURL: "https://indissolubly-unadmonitory-pinkie.ngrok-free.dev/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});


const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// attach super admin token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("superAdminToken");
  req.headers["ngrok-skip-browser-warning"] = "true";
  req.headers["Content-Type"] = "multipart/form-data";
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
// <=============================================== SUPER ADMIN ================================================>

/* ================= SUPER ADMIN LOGIN ================= */
export const superAdminLogin = (data) => {
  return api.post("/super-admin/login", data);
};

/* ================= USERS ================= */

// get all users
export const getAllUsers = () => API.get("/super-admin/users");

// block / unblock user
// export const toggleUserBlock = (userId) =>
//   API.patch(`/super-admin/users/${userId}/toggle-block`);
// export const blockUser = (userId) =>
//   API.patch(`/super-admin/users/${userId}/block`);
export const toggleUserBlock = (userId) =>
  API.patch(`/super-admin/user/block/${userId}`);


export const unblockUser = (userId) =>
  API.patch(`/super-admin/users/${userId}/unblock`);

/* ================= USER BOOKINGS ================= */

// get bookings of a user
export const SupAdigetUserBookings = (userId) =>
  API.get(`/super-admin/users/${userId}/bookings`);


export const cancelBookingBySuperAdmin = (bookingId) => {
   API.patch(`/super-admin/bookings/${bookingId}/cancel`);
};

// Get all bookings (Super Admin)
export const getAllBookingsBySuperAdmin = () => {
  return API.get("/super-admin/bookings");
};


// get all admins
export const getAllAdmins = () =>
  API.get("/super-admin/admins");

// get grounds by admin
export const getAdminGrounds = (adminId) =>
  API.get(`/super-admin/admins/${adminId}/grounds`);

export const getGroundBookings = (groundId) =>
  API.get(`/super-admin/grounds/${groundId}/bookings`);

export const toggleAdminBlock = (adminId) =>
  API.patch(`/super-admin/admin/block/${adminId}`);



// <=============================================== ADMIN ================================================>

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

// Admin Profile
export const getAdminProfile = () => {
  return api.get("/admin/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
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


// <===== ADMIN SHOWING USER GROUND BOOKING ========>
// ================= ADMIN BOOKINGS =================
export const getAdminBookings = () => {
  return api.get("/admin/bookings", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};




/* ===================================================== USER APIs ======================================================== */

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

export const getUserProfile = () => {
  const token = localStorage.getItem("userToken");

  return api.get("/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/* -------- BOOKINGS -------- */

// Get single ground for booking

export const getPublicGround = () => {

  return api.get("/grounds", {
    headers: {
      "ngrok-skip-browser-warning": "true"
    },
  });
};

// confirm booking
export const confirmBooking = (payload) => {
  console.log(localStorage.getItem("userToken"));
  
  return api.post("/bookings", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};

export const getPublicGroundById = (id) =>{
 return api.get(`/grounds/${id}`);
}


// GET BOOKINGS (My Bookings)
export const getUserBookings = () => {
  return api.get("/bookings/my", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};

// Cancel booking (user)
export const cancelUserBooking = (bookingId) => {
  return api.put(
    `/bookings/${bookingId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
};



export default api;

