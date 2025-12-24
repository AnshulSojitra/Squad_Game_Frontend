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


export default api;
