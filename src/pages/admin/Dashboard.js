import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/api";
import AdminBookingsChart from "../../components/common/AdminBookingsChart";
import AdminRevenueChart from "../../components/common/AdminRevenueChart";
import AdminGroundsChart from "../../components/common/AdminGroundsChart";


const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [animatedValues, setAnimatedValues] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null); // 'bookings' | 'revenue' | 'grounds' | null

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();

        const data = res.data;

        const dashboardStats = [
          {
            title: "Today Bookings",
            value: data.todayBookings || 0,
            icon: "📅",
            color: "from-orange-500 to-orange-600",
          },
          {
            title: "Active Grounds",
            value: data.activeGrounds || 0,
            icon: "🏟️",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Total Grounds",
            value: data.totalGrounds || 0,
            icon: "📍",
            color: "from-green-500 to-green-600",
          },
          {
            title: "Today Revenue",
            value: data.todayRevenue || 0,
            icon: "💰",
            color: "from-emerald-500 to-emerald-600",
            prefix: "₹",
          },
        ];

        setStats(dashboardStats);
        setAnimatedValues(new Array(dashboardStats.length).fill(0));
      } catch (error) {
        console.error("Failed to load dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  /* ================= ANIMATE COUNTERS ================= */
  useEffect(() => {
    if (!stats.length) return;

    const timers = stats.map((stat, index) => {
      let current = 0;
      const increment = stat.value / 40 || 1;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }

        setAnimatedValues((prev) => {
          const updated = [...prev];
          updated[index] = Math.floor(current);
          return updated;
        });
      }, 30);

      return timer;
    });

    return () => timers.forEach(clearInterval);
  }, [stats]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/addground")}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700
                     hover:from-indigo-700 hover:to-indigo-800
                     text-white px-6 py-3 rounded-xl font-semibold
                     transition-all duration-300 transform hover:scale-105"
        >
          ➕ Add Ground
        </button>
      </div>

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color}
                        rounded-2xl shadow-lg hover:shadow-xl
                        transition-all duration-300 transform hover:scale-105
                        p-6 text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-xl">📈</span>
              </div>

              <p className="text-white/80 text-sm font-medium">
                {item.title}
              </p>

              <p className="text-4xl font-bold mt-2">
                {item.prefix || ""}
                {animatedValues[index] || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CHARTS GRID (2 PER ROW) ================= */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-y-10"> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
        {/* BOOKINGS CHART */}
        <div
          className="bg-slate-900/60 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-transform duration-300"
          onClick={() => setExpandedChart("bookings")}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Bookings Overview</h2>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Click to enlarge
            </span>
          </div>
          <div className="h-80">
            <AdminBookingsChart showHeader={false} />
          </div>
        </div>

        {/* REVENUE CHART */}
        <div
          className="bg-slate-900/60 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-transform duration-300"
          onClick={() => setExpandedChart("revenue")}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Click to enlarge
            </span>
          </div>
          <div className="h-80">
            <AdminRevenueChart showHeader={false} />
          </div>
        </div>
        

        {/* GROUNDS CHART */}
        <div
          className="bg-slate-900/60 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-transform duration-300 lg:col-span-2 mt-4"
          onClick={() => setExpandedChart("grounds")}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Grounds Overview</h2>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Click to enlarge
            </span>
          </div>
          <div className="h-96">
            <AdminGroundsChart showHeader={false} />
          </div>
        </div>
      </div>

      {/* ================= EXPANDED CHART MODAL ================= */}
      {expandedChart && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) setExpandedChart(null);
          }}
        >
          <div className="bg-slate-900 rounded-2xl shadow-2xl w-[95%] max-w-5xl h-[75vh] p-6 relative flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {expandedChart === "bookings" && "Bookings Overview"}
                {expandedChart === "revenue" && "Revenue Overview"}
                {expandedChart === "grounds" && "Grounds Overview"}
              </h2>
              <button
                onClick={() => setExpandedChart(null)}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
              >
                Close
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {expandedChart === "bookings" && (
                <div className="w-full h-full">
                  <AdminBookingsChart showHeader={true} />
                </div>
              )}
              {expandedChart === "revenue" && (
                <div className="w-full h-full">
                  <AdminRevenueChart showHeader={true} />
                </div>
              )}
              {expandedChart === "grounds" && (
                <div className="w-full h-full">
                  <AdminGroundsChart showHeader={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
