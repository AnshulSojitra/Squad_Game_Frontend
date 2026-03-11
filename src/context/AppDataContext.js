import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  getAdminBookings,
  getAdminProfile,
  getAllAdmins,
  getAllBookingsBySuperAdmin,
  getAllGamesBySuperAdmin,
  getAllGroundsSupAdi,
  getAllUsers,
  getGames,
  getGrounds,
  getMyGames,
  getMyJoinedGames,
  getSuperAdminProfile,
  getUserBookings,
  getUserProfile,
} from "../services/api";

const POLL_INTERVAL_MS = 30000;

const AppDataContext = createContext(null);

const COLLECTION_KEYS = {
  admin: ["adminGrounds", "adminBookings", "adminGames"],
  user: ["userBookings", "userCreatedGames", "userJoinedGames"],
  superAdmin: [
    "superAdminUsers",
    "superAdminAdmins",
    "superAdminGrounds",
    "superAdminBookings",
    "superAdminGames",
  ],
};

const PROFILE_KEYS = {
  admin: "adminProfile",
  user: "userProfile",
  superAdmin: "superAdminProfile",
};

const createCollectionState = () => ({
  data: [],
  loading: false,
  error: null,
  lastFetched: null,
});

const createProfileState = () => ({
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
});

const getSessionsFromStorage = () => ({
  userToken: localStorage.getItem("userToken"),
  adminToken: localStorage.getItem("adminToken"),
  superAdminToken: localStorage.getItem("superAdminToken"),
});

const getActiveRole = (sessions) => {
  if (sessions.superAdminToken) return "superAdmin";
  if (sessions.adminToken) return "admin";
  if (sessions.userToken) return "user";
  return null;
};

const initialState = {
  sessions: getSessionsFromStorage(),
  activeRole: getActiveRole(getSessionsFromStorage()),
  profiles: {
    adminProfile: createProfileState(),
    userProfile: createProfileState(),
    superAdminProfile: createProfileState(),
  },
  collections: {
    adminGrounds: createCollectionState(),
    adminBookings: createCollectionState(),
    adminGames: createCollectionState(),
    userBookings: createCollectionState(),
    userCreatedGames: createCollectionState(),
    userJoinedGames: createCollectionState(),
    superAdminUsers: createCollectionState(),
    superAdminAdmins: createCollectionState(),
    superAdminGrounds: createCollectionState(),
    superAdminBookings: createCollectionState(),
    superAdminGames: createCollectionState(),
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SYNC_SESSIONS":
      return {
        ...state,
        sessions: action.sessions,
        activeRole: getActiveRole(action.sessions),
      };
    case "START_COLLECTION":
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.key]: {
            ...state.collections[action.key],
            loading: true,
            error: null,
          },
        },
      };
    case "SUCCESS_COLLECTION":
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.key]: {
            data: action.data,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          },
        },
      };
    case "ERROR_COLLECTION":
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.key]: {
            ...state.collections[action.key],
            loading: false,
            error: action.error,
          },
        },
      };
    case "SET_COLLECTION_DATA":
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.key]: {
            ...state.collections[action.key],
            data: action.data,
            lastFetched: Date.now(),
          },
        },
      };
    case "START_PROFILE":
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.key]: {
            ...state.profiles[action.key],
            loading: true,
            error: null,
          },
        },
      };
    case "SUCCESS_PROFILE":
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.key]: {
            data: action.data,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          },
        },
      };
    case "ERROR_PROFILE":
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [action.key]: {
            ...state.profiles[action.key],
            loading: false,
            error: action.error,
          },
        },
      };
    case "CLEAR_SCOPE": {
      const nextProfiles = { ...state.profiles };
      const nextCollections = { ...state.collections };
      const profileKey = PROFILE_KEYS[action.scope];
      if (profileKey) {
        nextProfiles[profileKey] = createProfileState();
      }
      (COLLECTION_KEYS[action.scope] || []).forEach((key) => {
        nextCollections[key] = createCollectionState();
      });
      return {
        ...state,
        profiles: nextProfiles,
        collections: nextCollections,
      };
    }
    default:
      return state;
  }
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const syncSessions = useCallback(() => {
    dispatch({ type: "SYNC_SESSIONS", sessions: getSessionsFromStorage() });
  }, []);

  useEffect(() => {
    syncSessions();
    const handleStorage = () => syncSessions();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [syncSessions]);

  const loadCollection = useCallback(async (key, fetcher, normalize, options = {}) => {
    const { silent = false } = options;
    const hasData = stateRef.current.collections[key].data.length > 0;

    if (!silent || !hasData) {
      dispatch({ type: "START_COLLECTION", key });
    }

    try {
      const response = await fetcher();
      dispatch({
        type: "SUCCESS_COLLECTION",
        key,
        data: normalize(response),
      });
      return response;
    } catch (error) {
      dispatch({
        type: "ERROR_COLLECTION",
        key,
        error: getErrorMessage(error, `Failed to load ${key}`),
      });
      throw error;
    }
  }, []);

  const loadProfile = useCallback(async (key, fetcher, normalize, options = {}) => {
    const { silent = false } = options;
    const hasData = Boolean(stateRef.current.profiles[key].data);

    if (!silent || !hasData) {
      dispatch({ type: "START_PROFILE", key });
    }

    try {
      const response = await fetcher();
      dispatch({
        type: "SUCCESS_PROFILE",
        key,
        data: normalize(response),
      });
      return response;
    } catch (error) {
      dispatch({
        type: "ERROR_PROFILE",
        key,
        error: getErrorMessage(error, `Failed to load ${key}`),
      });
      throw error;
    }
  }, []);

  const setCollectionData = useCallback((key, updater) => {
    const current = stateRef.current.collections[key].data;
    const data = typeof updater === "function" ? updater(current) : updater;
    dispatch({ type: "SET_COLLECTION_DATA", key, data });
  }, []);

  const setProfileData = useCallback((key, data) => {
    dispatch({ type: "SUCCESS_PROFILE", key, data });
  }, []);

  const refreshAdminProfile = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadProfile("adminProfile", getAdminProfile, (res) => res.data, options)
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshUserProfile = useCallback(
    (options) =>
      stateRef.current.sessions.userToken
        ? loadProfile("userProfile", getUserProfile, (res) => res.data, options)
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshSuperAdminProfile = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadProfile("superAdminProfile", getSuperAdminProfile, (res) => res.data, options)
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshAdminGrounds = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadCollection("adminGrounds", getGrounds, (res) => res.data || [], options)
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshAdminBookings = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadCollection("adminBookings", getAdminBookings, (res) => res.data || [], options)
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshAdminGames = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadCollection("adminGames", getGames, (res) => res.data || [], options)
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshUserBookings = useCallback(
    (options) =>
      stateRef.current.sessions.userToken
        ? loadCollection(
            "userBookings",
            getUserBookings,
            (res) => res.data?.data || res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshUserCreatedGames = useCallback(
    (options) =>
      stateRef.current.sessions.userToken
        ? loadCollection(
            "userCreatedGames",
            getMyGames,
            (res) => {
              const data = res?.data;
              return Array.isArray(data) ? data : data?.games || [];
            },
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshUserJoinedGames = useCallback(
    (options) =>
      stateRef.current.sessions.userToken
        ? loadCollection(
            "userJoinedGames",
            getMyJoinedGames,
            (res) => {
              const data = res?.data;
              return Array.isArray(data) ? data : data?.games || [];
            },
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshSuperAdminUsers = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadCollection(
            "superAdminUsers",
            getAllUsers,
            (res) => res.data?.users || res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshSuperAdminAdmins = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadCollection(
            "superAdminAdmins",
            getAllAdmins,
            (res) => res.data?.admins || res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshSuperAdminGrounds = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadCollection(
            "superAdminGrounds",
            getAllGroundsSupAdi,
            (res) => res.data?.grounds || res.data?.data || res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshSuperAdminBookings = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadCollection(
            "superAdminBookings",
            getAllBookingsBySuperAdmin,
            (res) => res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  const refreshSuperAdminGames = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadCollection(
            "superAdminGames",
            getAllGamesBySuperAdmin,
            (res) => res.data || [],
            options
          )
        : Promise.resolve(null),
    [loadCollection]
  );

  useEffect(() => {
    if (state.sessions.adminToken) {
      refreshAdminProfile().catch(() => {});
      refreshAdminGrounds().catch(() => {});
      refreshAdminBookings().catch(() => {});
      refreshAdminGames().catch(() => {});
    } else {
      dispatch({ type: "CLEAR_SCOPE", scope: "admin" });
    }

    if (state.sessions.userToken) {
      refreshUserProfile().catch(() => {});
      refreshUserBookings().catch(() => {});
      refreshUserCreatedGames().catch(() => {});
      refreshUserJoinedGames().catch(() => {});
    } else {
      dispatch({ type: "CLEAR_SCOPE", scope: "user" });
    }

    if (state.sessions.superAdminToken) {
      refreshSuperAdminProfile().catch(() => {});
      refreshSuperAdminUsers().catch(() => {});
      refreshSuperAdminAdmins().catch(() => {});
      refreshSuperAdminGrounds().catch(() => {});
      refreshSuperAdminBookings().catch(() => {});
      refreshSuperAdminGames().catch(() => {});
    } else {
      dispatch({ type: "CLEAR_SCOPE", scope: "superAdmin" });
    }
  }, [
    state.sessions.adminToken,
    state.sessions.superAdminToken,
    state.sessions.userToken,
    refreshAdminBookings,
    refreshAdminGames,
    refreshAdminGrounds,
    refreshAdminProfile,
    refreshSuperAdminAdmins,
    refreshSuperAdminBookings,
    refreshSuperAdminGames,
    refreshSuperAdminGrounds,
    refreshSuperAdminProfile,
    refreshSuperAdminUsers,
    refreshUserBookings,
    refreshUserCreatedGames,
    refreshUserJoinedGames,
    refreshUserProfile,
  ]);

  useEffect(() => {
    const hasSession =
      state.sessions.userToken ||
      state.sessions.adminToken ||
      state.sessions.superAdminToken;

    if (!hasSession) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      if (stateRef.current.sessions.adminToken) {
        refreshAdminGrounds({ silent: true }).catch(() => {});
        refreshAdminBookings({ silent: true }).catch(() => {});
        refreshAdminGames({ silent: true }).catch(() => {});
      }

      if (stateRef.current.sessions.userToken) {
        refreshUserBookings({ silent: true }).catch(() => {});
        refreshUserCreatedGames({ silent: true }).catch(() => {});
        refreshUserJoinedGames({ silent: true }).catch(() => {});
      }

      if (stateRef.current.sessions.superAdminToken) {
        refreshSuperAdminUsers({ silent: true }).catch(() => {});
        refreshSuperAdminAdmins({ silent: true }).catch(() => {});
        refreshSuperAdminGrounds({ silent: true }).catch(() => {});
        refreshSuperAdminBookings({ silent: true }).catch(() => {});
        refreshSuperAdminGames({ silent: true }).catch(() => {});
      }
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [
    state.sessions.adminToken,
    state.sessions.superAdminToken,
    state.sessions.userToken,
    refreshAdminBookings,
    refreshAdminGames,
    refreshAdminGrounds,
    refreshSuperAdminAdmins,
    refreshSuperAdminBookings,
    refreshSuperAdminGames,
    refreshSuperAdminGrounds,
    refreshSuperAdminUsers,
    refreshUserBookings,
    refreshUserCreatedGames,
    refreshUserJoinedGames,
  ]);

  const setAdminSession = useCallback(
    ({ token, profile = null }) => {
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      if (profile) {
        setProfileData("adminProfile", profile);
      }
      syncSessions();
    },
    [setProfileData, syncSessions]
  );

  const setUserSession = useCallback(
    ({ token, profile = null }) => {
      if (token) {
        localStorage.setItem("userToken", token);
      }
      if (profile) {
        localStorage.setItem("user", JSON.stringify(profile));
        setProfileData("userProfile", profile);
      }
      syncSessions();
    },
    [setProfileData, syncSessions]
  );

  const setSuperAdminSession = useCallback(
    ({ token, profile = null }) => {
      if (token) {
        localStorage.setItem("superAdminToken", token);
      }
      if (profile) {
        setProfileData("superAdminProfile", profile);
      }
      syncSessions();
    },
    [setProfileData, syncSessions]
  );

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem("adminToken");
    dispatch({ type: "CLEAR_SCOPE", scope: "admin" });
    syncSessions();
  }, [syncSessions]);

  const clearUserSession = useCallback(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    dispatch({ type: "CLEAR_SCOPE", scope: "user" });
    syncSessions();
  }, [syncSessions]);

  const clearSuperAdminSession = useCallback(() => {
    localStorage.removeItem("superAdminToken");
    dispatch({ type: "CLEAR_SCOPE", scope: "superAdmin" });
    syncSessions();
  }, [syncSessions]);

  const value = useMemo(
    () => ({
      activeRole: state.activeRole,
      sessions: state.sessions,
      adminProfile: state.profiles.adminProfile.data,
      adminProfileLoading: state.profiles.adminProfile.loading,
      userProfile: state.profiles.userProfile.data,
      userProfileLoading: state.profiles.userProfile.loading,
      superAdminProfile: state.profiles.superAdminProfile.data,
      superAdminProfileLoading: state.profiles.superAdminProfile.loading,
      adminGrounds: state.collections.adminGrounds.data,
      adminGroundsLoading: state.collections.adminGrounds.loading,
      adminGroundsError: state.collections.adminGrounds.error,
      adminBookings: state.collections.adminBookings.data,
      adminBookingsLoading: state.collections.adminBookings.loading,
      adminBookingsError: state.collections.adminBookings.error,
      adminGames: state.collections.adminGames.data,
      adminGamesLoading: state.collections.adminGames.loading,
      userBookings: state.collections.userBookings.data,
      userBookingsLoading: state.collections.userBookings.loading,
      userCreatedGames: state.collections.userCreatedGames.data,
      userCreatedGamesLoading: state.collections.userCreatedGames.loading,
      userJoinedGames: state.collections.userJoinedGames.data,
      userJoinedGamesLoading: state.collections.userJoinedGames.loading,
      superAdminUsers: state.collections.superAdminUsers.data,
      superAdminUsersLoading: state.collections.superAdminUsers.loading,
      superAdminAdmins: state.collections.superAdminAdmins.data,
      superAdminAdminsLoading: state.collections.superAdminAdmins.loading,
      superAdminGrounds: state.collections.superAdminGrounds.data,
      superAdminGroundsLoading: state.collections.superAdminGrounds.loading,
      superAdminBookings: state.collections.superAdminBookings.data,
      superAdminBookingsLoading: state.collections.superAdminBookings.loading,
      superAdminGames: state.collections.superAdminGames.data,
      superAdminGamesLoading: state.collections.superAdminGames.loading,
      refreshAdminProfile,
      refreshUserProfile,
      refreshSuperAdminProfile,
      refreshAdminGrounds,
      refreshAdminBookings,
      refreshAdminGames,
      refreshUserBookings,
      refreshUserCreatedGames,
      refreshUserJoinedGames,
      refreshSuperAdminUsers,
      refreshSuperAdminAdmins,
      refreshSuperAdminGrounds,
      refreshSuperAdminBookings,
      refreshSuperAdminGames,
      setCollectionData,
      setProfileData,
      setAdminSession,
      setUserSession,
      setSuperAdminSession,
      clearAdminSession,
      clearUserSession,
      clearSuperAdminSession,
    }),
    [
      state.activeRole,
      state.sessions,
      state.profiles.adminProfile.data,
      state.profiles.adminProfile.loading,
      state.profiles.superAdminProfile.data,
      state.profiles.superAdminProfile.loading,
      state.profiles.userProfile.data,
      state.profiles.userProfile.loading,
      state.collections.adminBookings.data,
      state.collections.adminBookings.error,
      state.collections.adminBookings.loading,
      state.collections.adminGames.data,
      state.collections.adminGames.loading,
      state.collections.adminGrounds.data,
      state.collections.adminGrounds.error,
      state.collections.adminGrounds.loading,
      state.collections.superAdminAdmins.data,
      state.collections.superAdminAdmins.loading,
      state.collections.superAdminBookings.data,
      state.collections.superAdminBookings.loading,
      state.collections.superAdminGames.data,
      state.collections.superAdminGames.loading,
      state.collections.superAdminGrounds.data,
      state.collections.superAdminGrounds.loading,
      state.collections.superAdminUsers.data,
      state.collections.superAdminUsers.loading,
      state.collections.userBookings.data,
      state.collections.userBookings.loading,
      state.collections.userCreatedGames.data,
      state.collections.userCreatedGames.loading,
      state.collections.userJoinedGames.data,
      state.collections.userJoinedGames.loading,
      refreshAdminProfile,
      refreshUserProfile,
      refreshSuperAdminProfile,
      refreshAdminGrounds,
      refreshAdminBookings,
      refreshAdminGames,
      refreshUserBookings,
      refreshUserCreatedGames,
      refreshUserJoinedGames,
      refreshSuperAdminUsers,
      refreshSuperAdminAdmins,
      refreshSuperAdminGrounds,
      refreshSuperAdminBookings,
      refreshSuperAdminGames,
      setCollectionData,
      setProfileData,
      setAdminSession,
      setUserSession,
      setSuperAdminSession,
      clearAdminSession,
      clearUserSession,
      clearSuperAdminSession,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
