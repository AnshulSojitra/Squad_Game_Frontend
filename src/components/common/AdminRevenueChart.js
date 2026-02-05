import { useEffect, useState } from "react";
import { getAdminRevenueChart } from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminRevenueChart({ showHeader = true } = {}) {
  const [days, setDays] = useState(7); // ✅ default 7 days
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH REVENUE DATA ================= */
  useEffect(() => {
    const fetchRevenueChart = async () => {
      try {
        setLoading(true);
        const res = await getAdminRevenueChart(days);
        setChartData(res.data || []);
      } catch (error) {
        console.error("Failed to load revenue chart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueChart();
  }, [days]);

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">
            Revenue Overview
          </h2>

          {/* DAYS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Last</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg
                         border border-gray-600 focus:outline-none
                         focus:ring-2 focus:ring-emerald-500"
            >
              <option value={2}>2 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
        </div>
      )}

      {/* CHART */}
      {loading ? (
        <p className="text-gray-400 text-center py-20">
          Loading revenue data...
        </p>
      ) : chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          No revenue data available
        </p>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
