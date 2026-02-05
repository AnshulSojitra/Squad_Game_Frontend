// import { useEffect, useState } from "react";
// import { getAdminGroundsChart } from "../../services/api";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// export default function AdminGroundsChart({ showHeader = true } = {}) {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchGroundsChart = async () => {
//       try {
//         setLoading(true);
//         const res = await getAdminGroundsChart();
//         setChartData(res.data);
//       } catch (error) {
//         console.error("Failed to load grounds chart", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroundsChart();
//   }, []);

//   return (
//     <div className="h-full flex flex-col min-h-0">
//       {/* HEADER */}
//       {showHeader && (
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold text-white">
//             Ground Performance
//           </h2>
//           <p className="text-sm text-gray-400">
//             Bookings & revenue per ground
//           </p>
//         </div>
//       )}

//       {loading ? (
//         <p className="text-gray-400 text-center py-20">
//           Loading ground data...
//         </p>
//       ) : chartData.length === 0 ? (
//         <p className="text-gray-400 text-center py-20">
//           No ground data available
//         </p>
//       ) : (
//         <div className="flex-1 min-h-0">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

//               {/* X AXIS */}
//               <XAxis
//                 dataKey="groundName"
//                 stroke="#94a3b8"
//                 tick={{ fontSize: 12 }}
//               />

//               {/* LEFT Y AXIS → BOOKINGS */}
//               <YAxis
//                 yAxisId="left"
//                 stroke="#818cf8"
//                 allowDecimals={false}
//               />

//               {/* RIGHT Y AXIS → REVENUE */}
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 stroke="#10b981"
//               />

//               <Tooltip
//                 formatter={(value, name) =>
//                   name === "revenue"
//                     ? [`₹${value}`, "Revenue"]
//                     : [value, "Bookings"]
//                 }
//                 contentStyle={{
//                   backgroundColor: "#1e293b",
//                   borderRadius: "8px",
//                   border: "none",
//                   color: "#fff",
//                 }}
//               />

//               <Legend />

//               {/* BOOKINGS BAR */}
//               <Bar
//                 yAxisId="left"
//                 dataKey="bookings"
//                 fill="#818cf8"
//                 radius={[6, 6, 0, 0]}
//                 barSize={28}
//               />

//               {/* REVENUE BAR */}
//               <Bar
//                 yAxisId="right"
//                 dataKey="revenue"
//                 fill="#10b981"
//                 radius={[6, 6, 0, 0]}
//                 barSize={28}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { getAdminGroundsChart } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminGroundsChart({ showHeader = true } = {}) {
  const [days, setDays] = useState(7); // ✅ default 7 days
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH GROUNDS CHART ================= */
  useEffect(() => {
    const fetchGroundsChart = async () => {
      try {
        setLoading(true);
        const res = await getAdminGroundsChart(days);
        setChartData(res.data || []);
      } catch (error) {
        console.error("Failed to load grounds chart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroundsChart();
  }, [days]); // 🔁 refetch when days change

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* <div>
            <h2 className="text-lg font-semibold text-white">
              Ground Performance
            </h2>
            <p className="text-sm text-gray-400">
              Bookings & revenue per ground
            </p>
          </div> */}

          {/* DAYS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Last</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg
                         border border-gray-600 focus:outline-none
                         focus:ring-2 focus:ring-indigo-500"
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
          Loading ground data...
        </p>
      ) : chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          No ground data available
        </p>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              {/* X AXIS */}
              <XAxis
                dataKey="groundName"
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
              />

              {/* LEFT Y AXIS → BOOKINGS */}
              <YAxis
                yAxisId="left"
                stroke="#818cf8"
                allowDecimals={false}
              />

              {/* RIGHT Y AXIS → REVENUE */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
              />

              <Tooltip
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`₹${value}`, "Revenue"]
                    : [value, "Bookings"]
                }
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
              />

              <Legend />

              {/* BOOKINGS BAR */}
              <Bar
                yAxisId="left"
                dataKey="bookings"
                fill="#818cf8"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />

              {/* REVENUE BAR */}
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
