import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import { getSuperAdminDashboard } from "../../services/api";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalGrounds: 0,
    totalBookings: 0,
    bookingsToday: 0,
    totalRevenue: 0,
  });

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError("");
        const res = await getSuperAdminDashboard();
        setDashboard(res.data);
      } catch (error) {
        console.error("Failed to load super admin dashboard", error);
        setError(
          error?.response?.data?.message ||
            "Couldn’t load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const platform = dashboard?.platformStats || {};
  const today = dashboard?.todayStats || {};

  const formatInt = (n) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const targets = useMemo(
    () => ({
      totalUsers: Number(platform.totalUsers || 0),
      totalAdmins: Number(platform.totalAdmins || 0),
      totalGrounds: Number(platform.totalGrounds || 0),
      totalBookings: Number(platform.totalBookings || 0),
      bookingsToday: Number(today.bookingsToday || 0),
      totalRevenue: Number(platform.totalRevenue || 0),
    }),
    [
      platform.totalUsers,
      platform.totalAdmins,
      platform.totalGrounds,
      platform.totalBookings,
      platform.totalRevenue,
      today.bookingsToday,
    ]
  );

  /* ================= ANIMATE COUNTERS ================= */
  useEffect(() => {
    const start = {
      totalUsers: 0,
      totalAdmins: 0,
      totalGrounds: 0,
      totalBookings: 0,
      bookingsToday: 0,
      totalRevenue: 0,
    };
    setAnimated(start);

    const durationMs = 900;
    const startTs = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - startTs) / durationMs);
      const easeOutCubic = 1 - Math.pow(1 - t, 3);

      setAnimated({
        totalUsers: Math.round(targets.totalUsers * easeOutCubic),
        totalAdmins: Math.round(targets.totalAdmins * easeOutCubic),
        totalGrounds: Math.round(targets.totalGrounds * easeOutCubic),
        totalBookings: Math.round(targets.totalBookings * easeOutCubic),
        bookingsToday: Math.round(targets.bookingsToday * easeOutCubic),
        totalRevenue: Math.round(targets.totalRevenue * easeOutCubic),
      });

      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targets]);

  const statCards = [
    {
      key: "totalUsers",
      title: "Total Users",
      value: formatInt(animated.totalUsers),
      sub: "Registered on platform",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      ring: "ring-blue-500/20",
      glow: "bg-blue-500/10",
      onClick: () => navigate("/super-admin/users"),
    },
    {
      key: "totalAdmins",
      title: "Total Admins",
      value: formatInt(animated.totalAdmins),
      sub: "Active admins onboarded",
      icon: ShieldCheck,
      color: "from-purple-500 to-fuchsia-600",
      ring: "ring-purple-500/20",
      glow: "bg-purple-500/10",
      onClick: () => navigate("/super-admin/admins"),
    },
    {
      key: "totalGrounds",
      title: "Total Grounds",
      value: formatInt(animated.totalGrounds),
      sub: "Venues available to book",
      icon: MapPin,
      color: "from-emerald-500 to-green-600",
      ring: "ring-emerald-500/20",
      glow: "bg-emerald-500/10",
      onClick: () => navigate("/super-admin/grounds"),
    },
    {
      key: "totalBookings",
      title: "Total Bookings",
      value: formatInt(animated.totalBookings),
      sub: "All-time bookings",
      icon: Calendar,
      color: "from-orange-500 to-amber-600",
      ring: "ring-orange-500/20",
      glow: "bg-orange-500/10",
      onClick: () => navigate("/super-admin/bookings"),
    },
    {
      key: "bookingsToday",
      title: "Bookings Today",
      value: formatInt(animated.bookingsToday),
      sub: "Today’s activity",
      icon: Activity,
      color: "from-cyan-500 to-sky-600",
      ring: "ring-cyan-500/20",
      glow: "bg-cyan-500/10",
      onClick: () => navigate("/super-admin/bookings"),
    },
    {
      key: "totalRevenue",
      title: "Total Revenue",
      value: formatINR(animated.totalRevenue),
      sub: "All-time platform revenue",
      icon: DollarSign,
      color: "from-teal-500 to-emerald-600",
      ring: "ring-emerald-500/20",
      glow: "bg-emerald-500/10",
      onClick: () => navigate("/super-admin/bookings"),
    },
  ];

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute -bottom-36 -left-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
          <div>
            <p className="text-white font-semibold">Loading dashboard</p>
            <p className="text-sm text-slate-400">
              Fetching latest platform stats…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-48 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
        </div>

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase">
                Super Admin
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
                Platform Dashboard
              </h1>
              <p className="mt-2 text-slate-300/90 max-w-2xl">
                Monitor users, admins, grounds, bookings, and revenue at a glance.
              </p>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="inline-flex items-center gap-2 text-sm text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </span>
                <TrendingUp size={16} className="text-slate-400" />
                <span>Live data</span>
              </div>

              <button
                onClick={() => navigate("/super-admin/admins/create")}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-3 text-white font-semibold shadow-lg shadow-indigo-900/30 transition-transform duration-200 hover:scale-[1.02] hover:from-indigo-500 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <button
            key={stat.key || index}
            type="button"
            onClick={stat.onClick}
            className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className={`absolute -top-20 -right-20 h-56 w-56 rounded-full ${stat.glow} blur-2xl`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-white truncate">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
              </div>

              <div
                className={`shrink-0 rounded-2xl p-3 ring-1 ${stat.ring} bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20`}
              >
                <stat.icon size={22} className="text-white" />
              </div>
            </div>

            <div className="relative mt-6 h-[3px] w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full w-2/3 rounded-full bg-gradient-to-r ${stat.color} opacity-70 transition-all duration-300 group-hover:w-full`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-400">
              Jump to the most common admin workflows.
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/super-admin/admins/create")}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-slate-900/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            <p className="text-white font-semibold">Add admin</p>
            <p className="mt-1 text-sm text-slate-400">
              Create and onboard a new admin.
            </p>
          </button>

          <button
            onClick={() => navigate("/super-admin/users")}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-slate-900/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            <p className="text-white font-semibold">Users</p>
            <p className="mt-1 text-sm text-slate-400">
              Review users, status, and activity.
            </p>
          </button>

          <button
            onClick={() => navigate("/super-admin/grounds")}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-slate-900/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            <p className="text-white font-semibold">Grounds</p>
            <p className="mt-1 text-sm text-slate-400">
              Manage venues and availability.
            </p>
          </button>

          <button
            onClick={() => navigate("/super-admin/bookings")}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-slate-900/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            <p className="text-white font-semibold">Bookings</p>
            <p className="mt-1 text-sm text-slate-400">
              View bookings and revenue insights.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
