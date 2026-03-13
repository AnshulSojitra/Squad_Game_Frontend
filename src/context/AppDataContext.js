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
  getAdminDashboard,
  getAdminProfile,
  getAllAdmins,
  getAllBookingsBySuperAdmin,
  getAllGamesBySuperAdmin,
  getAllGroundsSupAdi,
  getAllUsers,
  getGames,
  getGroundReviews,
  getGrounds,
  getMyGames,
  getMyJoinedGames,
  getOpenGames,
  getPublicGround,
  getPublicGroundById,
  getSuperAdminProfile,
  getUserBookings,
  getUserProfile,
} from "../services/api";

const POLL_INTERVAL_MS = 30000;
const EMPTY_RECORD = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

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
  public: ["publicGrounds", "openGames"],
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

const getRecordKey = (groundId, date) => `${groundId}::${date || "base"}`;
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const initialSessions = getSessionsFromStorage();

const initialState = {
  sessions: initialSessions,
  activeRole: getActiveRole(initialSessions),
  profiles: {
    adminProfile: createProfileState(),
    userProfile: createProfileState(),
    superAdminProfile: createProfileState(),
    adminDashboard: createProfileState(),
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
    publicGrounds: createCollectionState(),
    openGames: createCollectionState(),
  },
  records: {
    groundDetails: {},
    groundReviews: {},
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
    case "START_RECORD":
      return {
        ...state,
        records: {
          ...state.records,
          [action.group]: {
            ...state.records[action.group],
            [action.key]: {
              ...(state.records[action.group][action.key] || EMPTY_RECORD),
              loading: true,
              error: null,
            },
          },
        },
      };
    case "SUCCESS_RECORD":
      return {
        ...state,
        records: {
          ...state.records,
          [action.group]: {
            ...state.records[action.group],
            [action.key]: {
              data: action.data,
              loading: false,
              error: null,
              lastFetched: Date.now(),
            },
          },
        },
      };
    case "ERROR_RECORD":
      return {
        ...state,
        records: {
          ...state.records,
          [action.group]: {
            ...state.records[action.group],
            [action.key]: {
              ...(state.records[action.group][action.key] || EMPTY_RECORD),
              loading: false,
              error: action.error,
            },
          },
        },
      };
    case "SET_RECORD_DATA":
      return {
        ...state,
        records: {
          ...state.records,
          [action.group]: {
            ...state.records[action.group],
            [action.key]: {
              ...(state.records[action.group][action.key] || EMPTY_RECORD),
              data: action.data,
              loading: false,
              error: null,
              lastFetched: Date.now(),
            },
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

      if (action.scope === "admin") {
        nextProfiles.adminDashboard = createProfileState();
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

const normalizeSessionPayload = (value, profile) =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? value
    : { token: value, profile };

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

  const loadRecord = useCallback(async (group, key, fetcher, normalize, options = {}) => {
    const { silent = false } = options;
    const currentRecord = stateRef.current.records[group][key];
    const hasData = currentRecord?.data != null;

    if (!silent || !hasData) {
      dispatch({ type: "START_RECORD", group, key });
    }

    try {
      const response = await fetcher();
      dispatch({
        type: "SUCCESS_RECORD",
        group,
        key,
        data: normalize(response),
      });
      return response;
    } catch (error) {
      dispatch({
        type: "ERROR_RECORD",
        group,
        key,
        error: getErrorMessage(error, `Failed to load ${group}`),
      });
      throw error;
    }
  }, []);

  const setCollectionData = useCallback((key, updater) => {
    const current = stateRef.current.collections[key].data;
    const data = typeof updater === "function" ? updater(current) : updater;
    dispatch({ type: "SET_COLLECTION_DATA", key, data });
  }, []);

  const setProfileData = useCallback((key, updater) => {
    const current = stateRef.current.profiles[key].data;
    const data = typeof updater === "function" ? updater(current) : updater;
    dispatch({ type: "SUCCESS_PROFILE", key, data });
  }, []);

  const setRecordData = useCallback((group, key, updater) => {
    const current = stateRef.current.records[group][key]?.data;
    const data = typeof updater === "function" ? updater(current) : updater;
    dispatch({ type: "SET_RECORD_DATA", group, key, data });
  }, []);

  const refreshAdminProfile = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadProfile("adminProfile", getAdminProfile, (res) => res.data?.admin || res.data, options)
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshUserProfile = useCallback(
    (options) =>
      stateRef.current.sessions.userToken
        ? loadProfile("userProfile", getUserProfile, (res) => res.data?.user || res.data, options)
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshSuperAdminProfile = useCallback(
    (options) =>
      stateRef.current.sessions.superAdminToken
        ? loadProfile(
            "superAdminProfile",
            getSuperAdminProfile,
            (res) => res.data?.superAdmin || res.data,
            options
          )
        : Promise.resolve(null),
    [loadProfile]
  );

  const refreshAdminDashboard = useCallback(
    (options) =>
      stateRef.current.sessions.adminToken
        ? loadProfile("adminDashboard", getAdminDashboard, (res) => res.data || null, options)
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

  const refreshPublicGrounds = useCallback(
    (options) =>
      loadCollection("publicGrounds", getPublicGround, (res) => res.data || [], options),
    [loadCollection]
  );

  const refreshOpenGames = useCallback(
    (options) =>
      loadCollection(
        "openGames",
        getOpenGames,
        (res) => {
          const data = res?.data;
          return Array.isArray(data) ? data : data?.games || [];
        },
        options
      ),
    [loadCollection]
  );

  const refreshGroundDetails = useCallback(
    (groundId, date = null, options) => {
      if (!groundId) return Promise.resolve(null);
      const key = getRecordKey(groundId, date);
      return loadRecord(
        "groundDetails",
        key,
        () => getPublicGroundById(groundId, date),
        (res) => res.data,
        options
      );
    },
    [loadRecord]
  );

  const refreshGroundReviews = useCallback(
    (groundId, options) => {
      if (!groundId) return Promise.resolve(null);
      return loadRecord(
        "groundReviews",
        String(groundId),
        () => getGroundReviews(groundId),
        (res) => res.data,
        options
      );
    },
    [loadRecord]
  );

  const cacheUserProfile = useCallback(
    (updater) => {
      const current = stateRef.current.profiles.userProfile.data || {};
      const nextProfile = typeof updater === "function" ? updater(current) : updater;

      if (nextProfile) {
        localStorage.setItem("user", JSON.stringify(nextProfile));
      } else {
        localStorage.removeItem("user");
      }

      setProfileData("userProfile", nextProfile);
      window.dispatchEvent(new Event("userUpdated"));
      return nextProfile;
    },
    [setProfileData]
  );

  const cacheAdminProfile = useCallback(
    (updater) => {
      const current = stateRef.current.profiles.adminProfile.data || {};
      const nextProfile = typeof updater === "function" ? updater(current) : updater;

      if (nextProfile) {
        localStorage.setItem("admin", JSON.stringify(nextProfile));
      } else {
        localStorage.removeItem("admin");
      }

      setProfileData("adminProfile", nextProfile);
      return nextProfile;
    },
    [setProfileData]
  );

  const setSuperAdminProfile = useCallback(
    (updater) => {
      setProfileData("superAdminProfile", updater);
    },
    [setProfileData]
  );

  const updateUserProfile = useCallback(
    (updater) => {
      const current = stateRef.current.profiles.userProfile.data || {};
      const nextProfile =
        typeof updater === "function" ? updater(current) : { ...current, ...updater };

      localStorage.setItem("user", JSON.stringify(nextProfile));
      setProfileData("userProfile", nextProfile);
      window.dispatchEvent(new Event("userUpdated"));
      return nextProfile;
    },
    [setProfileData]
  );

  useEffect(() => {
    refreshPublicGrounds().catch(() => {});
    refreshOpenGames().catch(() => {});
  }, [refreshOpenGames, refreshPublicGrounds]);

  useEffect(() => {
    if (state.sessions.adminToken) {
      refreshAdminProfile().catch(() => {});
      refreshAdminDashboard().catch(() => {});
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
    refreshAdminDashboard,
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
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      refreshPublicGrounds({ silent: true }).catch(() => {});
      refreshOpenGames({ silent: true }).catch(() => {});

      if (stateRef.current.sessions.adminToken) {
        refreshAdminGrounds({ silent: true }).catch(() => {});
        refreshAdminBookings({ silent: true }).catch(() => {});
        refreshAdminGames({ silent: true }).catch(() => {});
        refreshAdminDashboard({ silent: true }).catch(() => {});
        refreshAdminProfile({ silent: true }).catch(() => {});
      }

      if (stateRef.current.sessions.userToken) {
        refreshUserBookings({ silent: true }).catch(() => {});
        refreshUserCreatedGames({ silent: true }).catch(() => {});
        refreshUserJoinedGames({ silent: true }).catch(() => {});
        refreshUserProfile({ silent: true }).catch(() => {});
      }

      if (stateRef.current.sessions.superAdminToken) {
        refreshSuperAdminUsers({ silent: true }).catch(() => {});
        refreshSuperAdminAdmins({ silent: true }).catch(() => {});
        refreshSuperAdminGrounds({ silent: true }).catch(() => {});
        refreshSuperAdminBookings({ silent: true }).catch(() => {});
        refreshSuperAdminGames({ silent: true }).catch(() => {});
        refreshSuperAdminProfile({ silent: true }).catch(() => {});
      }

      Object.keys(stateRef.current.records.groundReviews).forEach((groundId) => {
        refreshGroundReviews(groundId, { silent: true }).catch(() => {});
      });

      Object.keys(stateRef.current.records.groundDetails).forEach((key) => {
        const [groundId, dateValue] = key.split("::");
        refreshGroundDetails(
          groundId,
          dateValue && dateValue !== "base" ? dateValue : null,
          { silent: true }
        ).catch(() => {});
      });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [
    refreshAdminBookings,
    refreshAdminDashboard,
    refreshAdminGames,
    refreshAdminGrounds,
    refreshAdminProfile,
    refreshGroundDetails,
    refreshGroundReviews,
    refreshOpenGames,
    refreshPublicGrounds,
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

  const setAdminSession = useCallback(
    (sessionOrToken, profile = null) => {
      const { token, profile: nextProfile = null } = normalizeSessionPayload(sessionOrToken, profile);
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      if (nextProfile) {
        cacheAdminProfile(nextProfile);
      }
      syncSessions();
    },
    [cacheAdminProfile, syncSessions]
  );

  const setUserSession = useCallback(
    (sessionOrToken, profile = null) => {
      const { token, profile: nextProfile = null } = normalizeSessionPayload(sessionOrToken, profile);
      if (token) {
        localStorage.setItem("userToken", token);
      }
      if (nextProfile) {
        localStorage.setItem("user", JSON.stringify(nextProfile));
        setProfileData("userProfile", nextProfile);
      }
      syncSessions();
    },
    [setProfileData, syncSessions]
  );

  const setSuperAdminSession = useCallback(
    (sessionOrToken, profile = null) => {
      const { token, profile: nextProfile = null } = normalizeSessionPayload(sessionOrToken, profile);
      if (token) {
        localStorage.setItem("superAdminToken", token);
      }
      if (nextProfile) {
        setProfileData("superAdminProfile", nextProfile);
      }
      syncSessions();
    },
    [setProfileData, syncSessions]
  );

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
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

  const loading = useMemo(
    () => ({
      userProfile: state.profiles.userProfile.loading,
      openGames: state.collections.openGames.loading,
      userBookings: state.collections.userBookings.loading,
      myCreatedGames: state.collections.userCreatedGames.loading,
      myJoinedGames: state.collections.userJoinedGames.loading,
      adminProfile: state.profiles.adminProfile.loading,
      adminGrounds: state.collections.adminGrounds.loading,
      adminBookings: state.collections.adminBookings.loading,
      adminDashboard: state.profiles.adminDashboard.loading,
      superAdminProfile: state.profiles.superAdminProfile.loading,
      superAdminUsers: state.collections.superAdminUsers.loading,
      superAdminAdmins: state.collections.superAdminAdmins.loading,
      superAdminGrounds: state.collections.superAdminGrounds.loading,
      superAdminBookings: state.collections.superAdminBookings.loading,
      superAdminGames: state.collections.superAdminGames.loading,
    }),
    [
      state.collections.adminBookings.loading,
      state.collections.adminGrounds.loading,
      state.collections.openGames.loading,
      state.collections.superAdminAdmins.loading,
      state.collections.superAdminBookings.loading,
      state.collections.superAdminGames.loading,
      state.collections.superAdminGrounds.loading,
      state.collections.superAdminUsers.loading,
      state.collections.userBookings.loading,
      state.collections.userCreatedGames.loading,
      state.collections.userJoinedGames.loading,
      state.profiles.adminDashboard.loading,
      state.profiles.adminProfile.loading,
      state.profiles.superAdminProfile.loading,
      state.profiles.userProfile.loading,
    ]
  );

  const auth = useMemo(
    () => ({
      isUserAuthenticated: Boolean(state.sessions.userToken),
      isAdminAuthenticated: Boolean(state.sessions.adminToken),
      isSuperAdminAuthenticated: Boolean(state.sessions.superAdminToken),
    }),
    [state.sessions.adminToken, state.sessions.superAdminToken, state.sessions.userToken]
  );

  const value = useMemo(
    () => ({
      activeRole: state.activeRole,
      sessions: state.sessions,
      tokens: state.sessions,
      auth,
      loading,
      adminProfile: state.profiles.adminProfile.data,
      adminProfileLoading: state.profiles.adminProfile.loading,
      userProfile: state.profiles.userProfile.data,
      userProfileLoading: state.profiles.userProfile.loading,
      superAdminProfile: state.profiles.superAdminProfile.data,
      superAdminProfileLoading: state.profiles.superAdminProfile.loading,
      adminDashboard: state.profiles.adminDashboard.data,
      adminDashboardLoading: state.profiles.adminDashboard.loading,
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
      myCreatedGames: state.collections.userCreatedGames.data,
      myJoinedGames: state.collections.userJoinedGames.data,
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
      publicGrounds: state.collections.publicGrounds.data,
      publicGroundsLoading: state.collections.publicGrounds.loading,
      openGames: state.collections.openGames.data,
      openGamesLoading: state.collections.openGames.loading,
      groundDetailsByKey: state.records.groundDetails,
      groundReviewsByGroundId: state.records.groundReviews,
      getGroundRecordKey: getRecordKey,
      refreshAdminProfile,
      refreshUserProfile,
      refreshSuperAdminProfile,
      refreshAdminDashboard,
      refreshAdminGrounds,
      refreshAdminBookings,
      refreshAdminGames,
      refreshUserBookings,
      refreshUserCreatedGames,
      refreshUserJoinedGames,
      refreshMyCreatedGames: refreshUserCreatedGames,
      refreshMyJoinedGames: refreshUserJoinedGames,
      refreshSuperAdminUsers,
      refreshSuperAdminAdmins,
      refreshSuperAdminGrounds,
      refreshSuperAdminBookings,
      refreshSuperAdminGames,
      refreshPublicGrounds,
      refreshOpenGames,
      refreshGroundDetails,
      refreshGroundReviews,
      setCollectionData,
      setProfileData,
      setRecordData,
      setUserBookings: (updater) => setCollectionData("userBookings", updater),
      setMyCreatedGames: (updater) => setCollectionData("userCreatedGames", updater),
      setMyJoinedGames: (updater) => setCollectionData("userJoinedGames", updater),
      setOpenGames: (updater) => setCollectionData("openGames", updater),
      setAdminGrounds: (updater) => setCollectionData("adminGrounds", updater),
      setAdminBookings: (updater) => setCollectionData("adminBookings", updater),
      setAdminDashboard: (updater) => setProfileData("adminDashboard", updater),
      setSuperAdminUsers: (updater) => setCollectionData("superAdminUsers", updater),
      setSuperAdminAdmins: (updater) => setCollectionData("superAdminAdmins", updater),
      setSuperAdminGrounds: (updater) => setCollectionData("superAdminGrounds", updater),
      setSuperAdminBookings: (updater) => setCollectionData("superAdminBookings", updater),
      setSuperAdminGames: (updater) => setCollectionData("superAdminGames", updater),
      cacheUserProfile,
      cacheAdminProfile,
      setSuperAdminProfile,
      updateUserProfile,
      setAdminSession,
      setUserSession,
      setSuperAdminSession,
      clearAdminSession,
      clearUserSession,
      clearSuperAdminSession,
      logoutAdmin: clearAdminSession,
      logoutUser: clearUserSession,
      logoutSuperAdmin: clearSuperAdminSession,
    }),
    [
      auth,
      cacheAdminProfile,
      cacheUserProfile,
      clearAdminSession,
      clearSuperAdminSession,
      clearUserSession,
      loading,
      refreshAdminBookings,
      refreshAdminDashboard,
      refreshAdminGames,
      refreshAdminGrounds,
      refreshAdminProfile,
      refreshGroundDetails,
      refreshGroundReviews,
      refreshOpenGames,
      refreshPublicGrounds,
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
      setAdminSession,
      setCollectionData,
      setProfileData,
      setRecordData,
      setSuperAdminProfile,
      setSuperAdminSession,
      setUserSession,
      state.activeRole,
      state.collections.adminBookings.data,
      state.collections.adminBookings.error,
      state.collections.adminBookings.loading,
      state.collections.adminGames.data,
      state.collections.adminGames.loading,
      state.collections.adminGrounds.data,
      state.collections.adminGrounds.error,
      state.collections.adminGrounds.loading,
      state.collections.openGames.data,
      state.collections.openGames.loading,
      state.collections.publicGrounds.data,
      state.collections.publicGrounds.loading,
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
      state.profiles.adminDashboard.data,
      state.profiles.adminDashboard.loading,
      state.profiles.adminProfile.data,
      state.profiles.adminProfile.loading,
      state.profiles.superAdminProfile.data,
      state.profiles.superAdminProfile.loading,
      state.profiles.userProfile.data,
      state.profiles.userProfile.loading,
      state.records.groundDetails,
      state.records.groundReviews,
      state.sessions,
      updateUserProfile,
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

export const BoxArenaProvider = AppDataProvider;
export const useBoxArena = useAppData;
