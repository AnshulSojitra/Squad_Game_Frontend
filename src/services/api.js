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
  req.headers["Content-Type"] = "application/json";
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
// <=============================================== SUPER ADMIN ================================================>

/* ================= SUPER ADMIN LOGIN ================= */
export const superAdminLogin = (data) => {
  return api.post("/super-admin/login", data)
};


/* ================= USERS ================= */

// get all users
export const getAllUsers = () => API.get("/super-admin/users");

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


// Admin Registration
export const createAdmin = (data) => {
  return API.post("/super-admin/admins", data);
}

// get all admins
export const getAllAdmins = () =>
  API.get("/super-admin/admins");

// delete admin
export const deleteAdminBySuperAdmin = (adminId) => {
  return API.delete(`/super-admin/admin/${adminId}`
  );
};


// get grounds by admin
export const getAdminGrounds = (adminId) =>
  API.get(`/super-admin/admins/${adminId}/grounds`);

// Get ground bookings by ground
export const getGroundBookings = (groundId) =>
  API.get(`/super-admin/grounds/${groundId}/bookings`);

// Block and Unblock 
export const toggleAdminBlock = (adminId) =>
  API.patch(`/super-admin/admin/block/${adminId}`);

export const toggleGroundBlock = (groundId) =>
  API.patch(`/super-admin/ground/block/${groundId}`);

// Get all grounds (Super Admin)
export const getAllGroundsSupAdi = () => {
  return API.get(`/super-admin/grounds`);
};

// all details of super admin
export const getSuperAdminProfile = () => {
  // const token = localStorage.getItem("superAdminToken");

  return API.get("/super-admin/me", {
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });
};




export const deleteUser = (userId) => {
  const token = localStorage.getItem("superAdminToken");
  API.delete(`/super-admin/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};





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

//  TOGGLE BLOCK ADMIN
export const toggleGroundBlockApi = (groundId) => {
  return api.patch(`/admin/grounds/block/${groundId}`, {}, {
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
  return api.get(`/admin/grounds/${id}`, {
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
  headers: { "ngrok-skip-browser-warning": "true", }
});

export const getStatesByCountry = (countryId) =>
  api.get(`/location/states/${countryId}`, {
    headers: { "ngrok-skip-browser-warning": "true", }
  });

export const getCitiesByState = (stateId) =>
  api.get(`/location/cities/${stateId}`, {
    headers: { "ngrok-skip-browser-warning": "true", }
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

// admin change passwoed 
export const changeAdminPassword = (data) => {
  const token = localStorage.getItem("adminToken");

  return api.put("/admin/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ADMIN FORGOT PASSWORD
export const adminForgotPassword = (email) => {
  return api.post("/admin/forgot-password", { email });
};

// ADMIN RESET PASSWORD
export const adminResetPassword = ({ email, otp, newPassword }) => {
  return api.post("/admin/reset-password", {
    email,
    otp,
    newPassword,
  });
};

/* -------- GAMES -------- */

// Get all games
export const getGames = () => {
  const token = localStorage.getItem("adminToken");
  return api.get("/admin/games", {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
  });
};

// Add game
export const addGame = (data) => {
  const token = localStorage.getItem("adminToken");
  return api.post("/admin/games", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
  });
};

// Delete game
export const deleteGame = (id) => {
  const token = localStorage.getItem("adminToken");
  return api.delete(`/admin/games/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    },
  });
};

// ADMIN DASHBOARD STATS
export const getAdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  return api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ADMIN BOOKINGS CHART
export const getAdminBookingsChart = (days) => {
  const token = localStorage.getItem("adminToken");

  return api.get("/admin/charts/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      days, // 👈 matches backend
    },
  });
};


// ADMIN REVENUE CHART
export const getAdminRevenueChart = (days) => {
  const token = localStorage.getItem("adminToken");

  return api.get("/admin/charts/revenue", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      days,
    },
  });
};


// ADMIN GROUNDS CHART
export const getAdminGroundsChart = (days) => {
  const token = localStorage.getItem("adminToken");

  return api.get("/admin/charts/grounds", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      days,
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

export const getPublicGroundById = (id, date) => {
  return api.get(`/grounds/${id}`, {
    params: date ? { date } : {}, // ✅ IMPORTANT
  });
};




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

export const changeUserPassword = (data) => {
  const token = localStorage.getItem("userToken");

  return api.put("/user/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET ground reviews (public)
export const getGroundReviews = (groundId) => {
  return api.get(`/grounds/${groundId}/reviews`);
}


// SUBMIT GROUND REVIEWS
export const submitGroundReview = (groundId, data) => {
  const token = localStorage.getItem("userToken");

  return api.post(`/grounds/${groundId}/reviews`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};



// USER FORGOT PASSWORD
export const userForgotPassword = (email) => {
  return api.post("/user/forgot-password", { email });
};

// User reset password
export const userResetPassword = ({ email, otp, newPassword }) => {
  return api.post("/user/reset-password", {
    email,
    otp,
    newPassword,
  });
};

// send OTP in Email
export const sendOtp = (login) => {
  return api.post("/user/send-otp", { login });
};

// Verify OTP in Email
export const verifyOtp = (payload) => {
  return api.post("/user/verify-otp", payload);
};


/* ================= COMPLETE PROFILE ================= */
export const completeProfile = (data) => {
  const token = localStorage.getItem("userToken");
  // data = { name, email OR phoneNumber }
  return api.put("/user/complete-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

// CHANGE USER NAME
export const changeUserName = (name) => {
  const token = localStorage.getItem("userToken");

  return api.put(
    "/user/change-name",
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// SUPER ADMIN – DELETE GROUND
export const deleteGroundBySuperAdmin = (groundId) => {
  return API.delete(`/super-admin/ground/${groundId}`);
};

// SUPER ADMIN DASHBOARD
export const getSuperAdminDashboard = () => {
  return API.get("/super-admin/dashboard");
};


//PAYMENT ORDER
export const createPaymentOrder = (data) => {
  const token = localStorage.getItem("userToken");
  api.post("/payments/razorpay/order", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

//VERIFY PAYMENT
export const verifyPayment = (data) => {
  const token = localStorage.getItem("userToken");
  api.post("/payments/razorpay/verify", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}



export default api;

