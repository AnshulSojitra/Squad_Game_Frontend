import { createContext, useContext, useEffect, useState } from "react";
import {
  getAdminBookings,
  getAdminDashboard,
  getAdminProfile,
  getAllAdmins,
  getAllBookingsBySuperAdmin,
  getAllGamesBySuperAdmin,
  getAllGroundsSupAdi,
  getAllUsers,
  getGrounds,
  getMyGames,
  getMyJoinedGames,
  getOpenGames,
  getSuperAdminProfile,
  getUserBookings,
  getUserProfile,
} from "../services/api";

const BoxArenaContext = createContext(null);

const REFRESH_INTERVAL_MS = 45000;

const getStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getArrayPayload = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeUserProfile = (payload) => payload?.user ?? payload ?? null;
const normalizeAdminProfile = (payload) => payload ?? null;
const normalizeSuperAdminProfile = (payload) => payload ?? null;
const normalizeUserBookings = (payload) => payload?.data ?? payload ?? [];
const normalizeAdminDashboard = (payload) => payload ?? null;

export function BoxArenaProvider({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem("userToken") || "");
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [superAdminToken, setSuperAdminToken] = useState(
    () => localStorage.getItem("superAdminToken") || ""
  );

  const [userProfile, setUserProfile] = useState(() => getStoredJson("user"));
  const [adminProfile, setAdminProfile] = useState(() => getStoredJson("admin"));
  const [superAdminProfile, setSuperAdminProfile] = useState(null);

  const [openGames, setOpenGames] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [myCreatedGames, setMyCreatedGames] = useState([]);
  const [myJoinedGames, setMyJoinedGames] = useState([]);

  const [adminGrounds, setAdminGrounds] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminDashboard, setAdminDashboard] = useState(null);

  const [superAdminUsers, setSuperAdminUsers] = useState([]);
  const [superAdminAdmins, setSuperAdminAdmins] = useState([]);
  const [superAdminGrounds, setSuperAdminGrounds] = useState([]);
  const [superAdminBookings, setSuperAdminBookings] = useState([]);
  const [superAdminGames, setSuperAdminGames] = useState([]);

  const [loading, setLoading] = useState({
    userProfile: false,
    openGames: false,
    userBookings: false,
    myCreatedGames: false,
    myJoinedGames: false,
    adminProfile: false,
    adminGrounds: false,
    adminBookings: false,
    adminDashboard: false,
    superAdminProfile: false,
    superAdminUsers: false,
    superAdminAdmins: false,
    superAdminGrounds: false,
    superAdminBookings: false,
    superAdminGames: false,
  });

  const setLoadingFlag = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const cacheUserProfile = (profile) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user");
    }
  };

  const cacheAdminProfile = (profile) => {
    setAdminProfile(profile);
    if (profile) {
      localStorage.setItem("admin", JSON.stringify(profile));
    } else {
      localStorage.removeItem("admin");
    }
  };

  const clearUserState = () => {
    cacheUserProfile(null);
    setUserBookings([]);
    setMyCreatedGames([]);
    setMyJoinedGames([]);
  };

  const clearAdminState = () => {
    cacheAdminProfile(null);
    setAdminGrounds([]);
    setAdminBookings([]);
    setAdminDashboard(null);
  };

  const clearSuperAdminState = () => {
    setSuperAdminProfile(null);
    setSuperAdminUsers([]);
    setSuperAdminAdmins([]);
    setSuperAdminGrounds([]);
    setSuperAdminBookings([]);
    setSuperAdminGames([]);
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    setUserToken("");
    clearUserState();
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
    clearAdminState();
  };

  const logoutSuperAdmin = () => {
    localStorage.removeItem("superAdminToken");
    setSuperAdminToken("");
    clearSuperAdminState();
  };

  const setUserSession = (token, profile = null) => {
    localStorage.setItem("userToken", token);
    setUserToken(token);
    if (profile) {
      cacheUserProfile(profile);
    }
  };

  const setAdminSession = (token, profile = null) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
    if (profile) {
      cacheAdminProfile(profile);
    }
  };

  const setSuperAdminSession = (token, profile = null) => {
    localStorage.setItem("superAdminToken", token);
    setSuperAdminToken(token);
    if (profile) {
      setSuperAdminProfile(profile);
    }
  };

  const refreshUserProfile = async () => {
    if (!localStorage.getItem("userToken")) return null;
    try {
      setLoadingFlag("userProfile", true);
      const res = await getUserProfile();
      const profile = normalizeUserProfile(res.data);
      cacheUserProfile(profile);
      return profile;
    } catch (error) {
      logoutUser();
      return null;
    } finally {
      setLoadingFlag("userProfile", false);
    }
  };

  const refreshOpenGames = async () => {
    try {
      setLoadingFlag("openGames", true);
      const res = await getOpenGames();
      setOpenGames(getArrayPayload(res?.data, ["games"]));
    } catch (error) {
      setOpenGames([]);
    } finally {
      setLoadingFlag("openGames", false);
    }
  };

  const refreshUserBookings = async () => {
    if (!localStorage.getItem("userToken")) return;
    try {
      setLoadingFlag("userBookings", true);
      const res = await getUserBookings();
      setUserBookings(normalizeUserBookings(res.data));
    } catch (error) {
      setUserBookings([]);
    } finally {
      setLoadingFlag("userBookings", false);
    }
  };

  const refreshMyCreatedGames = async () => {
    if (!localStorage.getItem("userToken")) return;
    try {
      setLoadingFlag("myCreatedGames", true);
      const res = await getMyGames();
      setMyCreatedGames(getArrayPayload(res?.data, ["games"]));
    } catch (error) {
      setMyCreatedGames([]);
    } finally {
      setLoadingFlag("myCreatedGames", false);
    }
  };

  const refreshMyJoinedGames = async () => {
    if (!localStorage.getItem("userToken")) return;
    try {
      setLoadingFlag("myJoinedGames", true);
      const res = await getMyJoinedGames();
      setMyJoinedGames(getArrayPayload(res?.data, ["games"]));
    } catch (error) {
      setMyJoinedGames([]);
    } finally {
      setLoadingFlag("myJoinedGames", false);
    }
  };

  const refreshAdminProfile = async () => {
    if (!localStorage.getItem("adminToken")) return null;
    try {
      setLoadingFlag("adminProfile", true);
      const res = await getAdminProfile();
      const profile = normalizeAdminProfile(res.data);
      cacheAdminProfile(profile);
      return profile;
    } catch (error) {
      logoutAdmin();
      return null;
    } finally {
      setLoadingFlag("adminProfile", false);
    }
  };

  const refreshAdminGrounds = async () => {
    if (!localStorage.getItem("adminToken")) return;
    try {
      setLoadingFlag("adminGrounds", true);
      const res = await getGrounds();
      setAdminGrounds(getArrayPayload(res?.data));
    } catch (error) {
      setAdminGrounds([]);
    } finally {
      setLoadingFlag("adminGrounds", false);
    }
  };

  const refreshAdminBookings = async () => {
    if (!localStorage.getItem("adminToken")) return;
    try {
      setLoadingFlag("adminBookings", true);
      const res = await getAdminBookings();
      setAdminBookings(getArrayPayload(res?.data));
    } catch (error) {
      setAdminBookings([]);
    } finally {
      setLoadingFlag("adminBookings", false);
    }
  };

  const refreshAdminDashboard = async () => {
    if (!localStorage.getItem("adminToken")) return;
    try {
      setLoadingFlag("adminDashboard", true);
      const res = await getAdminDashboard();
      setAdminDashboard(normalizeAdminDashboard(res.data));
    } catch (error) {
      setAdminDashboard(null);
    } finally {
      setLoadingFlag("adminDashboard", false);
    }
  };

  const refreshSuperAdminProfile = async () => {
    if (!localStorage.getItem("superAdminToken")) return null;
    try {
      setLoadingFlag("superAdminProfile", true);
      const res = await getSuperAdminProfile();
      const profile = normalizeSuperAdminProfile(res.data);
      setSuperAdminProfile(profile);
      return profile;
    } catch (error) {
      logoutSuperAdmin();
      return null;
    } finally {
      setLoadingFlag("superAdminProfile", false);
    }
  };

  const refreshSuperAdminUsers = async () => {
    if (!localStorage.getItem("superAdminToken")) return;
    try {
      setLoadingFlag("superAdminUsers", true);
      const res = await getAllUsers();
      setSuperAdminUsers(getArrayPayload(res?.data, ["users"]));
    } catch (error) {
      setSuperAdminUsers([]);
    } finally {
      setLoadingFlag("superAdminUsers", false);
    }
  };

  const refreshSuperAdminAdmins = async () => {
    if (!localStorage.getItem("superAdminToken")) return;
    try {
      setLoadingFlag("superAdminAdmins", true);
      const res = await getAllAdmins();
      setSuperAdminAdmins(getArrayPayload(res?.data, ["admins"]));
    } catch (error) {
      setSuperAdminAdmins([]);
    } finally {
      setLoadingFlag("superAdminAdmins", false);
    }
  };

  const refreshSuperAdminGrounds = async () => {
    if (!localStorage.getItem("superAdminToken")) return;
    try {
      setLoadingFlag("superAdminGrounds", true);
      const res = await getAllGroundsSupAdi();
      setSuperAdminGrounds(getArrayPayload(res?.data, ["grounds"]));
    } catch (error) {
      setSuperAdminGrounds([]);
    } finally {
      setLoadingFlag("superAdminGrounds", false);
    }
  };

  const refreshSuperAdminBookings = async () => {
    if (!localStorage.getItem("superAdminToken")) return;
    try {
      setLoadingFlag("superAdminBookings", true);
      const res = await getAllBookingsBySuperAdmin();
      setSuperAdminBookings(getArrayPayload(res?.data));
    } catch (error) {
      setSuperAdminBookings([]);
    } finally {
      setLoadingFlag("superAdminBookings", false);
    }
  };

  const refreshSuperAdminGames = async () => {
    if (!localStorage.getItem("superAdminToken")) return;
    try {
      setLoadingFlag("superAdminGames", true);
      const res = await getAllGamesBySuperAdmin();
      setSuperAdminGames(getArrayPayload(res?.data, ["games"]));
    } catch (error) {
      setSuperAdminGames([]);
    } finally {
      setLoadingFlag("superAdminGames", false);
    }
  };

  useEffect(() => {
    const syncStorage = () => {
      setUserToken(localStorage.getItem("userToken") || "");
      setAdminToken(localStorage.getItem("adminToken") || "");
      setSuperAdminToken(localStorage.getItem("superAdminToken") || "");
      setUserProfile(getStoredJson("user"));
      setAdminProfile(getStoredJson("admin"));
    };

    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  useEffect(() => {
    refreshOpenGames();

    const onFocus = () => {
      refreshOpenGames();
    };

    const intervalId = window.setInterval(refreshOpenGames, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!userToken) {
      clearUserState();
      return;
    }

    const refreshAll = () => {
      refreshUserProfile();
      refreshUserBookings();
      refreshMyCreatedGames();
      refreshMyJoinedGames();
      refreshOpenGames();
    };

    refreshAll();
    const intervalId = window.setInterval(refreshAll, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshAll);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshAll);
    };
  }, [userToken]);

  useEffect(() => {
    if (!adminToken) {
      clearAdminState();
      return;
    }

    const refreshAll = () => {
      refreshAdminProfile();
      refreshAdminGrounds();
      refreshAdminBookings();
      refreshAdminDashboard();
    };

    refreshAll();
    const intervalId = window.setInterval(refreshAll, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshAll);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshAll);
    };
  }, [adminToken]);

  useEffect(() => {
    if (!superAdminToken) {
      clearSuperAdminState();
      return;
    }

    const refreshAll = () => {
      refreshSuperAdminProfile();
      refreshSuperAdminUsers();
      refreshSuperAdminAdmins();
      refreshSuperAdminGrounds();
      refreshSuperAdminBookings();
      refreshSuperAdminGames();
    };

    refreshAll();
    const intervalId = window.setInterval(refreshAll, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refreshAll);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshAll);
    };
  }, [superAdminToken]);

  const value = {
    tokens: {
      userToken,
      adminToken,
      superAdminToken,
    },
    auth: {
      isUserAuthenticated: Boolean(userToken),
      isAdminAuthenticated: Boolean(adminToken),
      isSuperAdminAuthenticated: Boolean(superAdminToken),
    },
    loading,
    userProfile,
    adminProfile,
    superAdminProfile,
    openGames,
    userBookings,
    myCreatedGames,
    myJoinedGames,
    adminGrounds,
    adminBookings,
    adminDashboard,
    superAdminUsers,
    superAdminAdmins,
    superAdminGrounds,
    superAdminBookings,
    superAdminGames,
    setUserSession,
    setAdminSession,
    setSuperAdminSession,
    logoutUser,
    logoutAdmin,
    logoutSuperAdmin,
    cacheUserProfile,
    cacheAdminProfile,
    setSuperAdminProfile,
    setUserBookings,
    setMyCreatedGames,
    setMyJoinedGames,
    setOpenGames,
    setAdminGrounds,
    setAdminBookings,
    setAdminDashboard,
    setSuperAdminUsers,
    setSuperAdminAdmins,
    setSuperAdminGrounds,
    setSuperAdminBookings,
    setSuperAdminGames,
    refreshUserProfile,
    refreshOpenGames,
    refreshUserBookings,
    refreshMyCreatedGames,
    refreshMyJoinedGames,
    refreshAdminProfile,
    refreshAdminGrounds,
    refreshAdminBookings,
    refreshAdminDashboard,
    refreshSuperAdminProfile,
    refreshSuperAdminUsers,
    refreshSuperAdminAdmins,
    refreshSuperAdminGrounds,
    refreshSuperAdminBookings,
    refreshSuperAdminGames,
  };

  return (
    <BoxArenaContext.Provider value={value}>
      {children}
    </BoxArenaContext.Provider>
  );
}

export function useBoxArena() {
  const context = useContext(BoxArenaContext);

  if (!context) {
    throw new Error("useBoxArena must be used within a BoxArenaProvider");
  }

  return context;
}
