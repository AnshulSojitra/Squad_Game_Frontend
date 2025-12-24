import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});


// CREATE - Register Admin
// export const registerAdmin = (data) => {
//   return api.post("/admin/register", data);
// };

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

// ADD GROUND
export const addGround = (formData) => {
  return api.post("/admin/grounds", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};

// GET all grounds
export const getGrounds = () => {
  return api.get("/admin/grounds", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};

// DELETE ground
export const deleteGround = (id) => {
  return api.delete(`/admin/grounds/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};

// GET single ground (for edit)
export const getGroundById = (id) => {
  return api.get(`/admin/grounds/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};

// UPDATE ground
export const updateGround = (id, formData) => {
  return api.put(`/admin/grounds/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
};

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
