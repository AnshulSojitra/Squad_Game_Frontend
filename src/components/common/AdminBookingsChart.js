// import { useEffect, useState } from "react";
// import { getAdminBookingsChart } from "../../services/api";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// export default function AdminBookingsChart({ showHeader = true } = {}) {
//   const [days, setDays] = useState(7); // default: last 7 days
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH CHART DATA ================= */
//   useEffect(() => {
//     const fetchChart = async () => {
//       try {
//         setLoading(true);
//         const res = await getAdminBookingsChart(days);
//         setChartData(res.data);
//       } catch (error) {
//         console.error("Failed to load booking chart", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChart();
//   }, [days]);

//   return (
//     // <div className="h-full flex flex-col min-h-0">
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       {showHeader && (
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-lg font-semibold text-white">
//             Bookings Overview
//           </h2>

//           {/* DAYS SELECTOR */}
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-400">Last</label>
//             <select
//               value={days}
//               onChange={(e) => setDays(Number(e.target.value))}
//               className="bg-gray-700 text-white px-3 py-2 rounded-lg
//                          border border-gray-600 focus:outline-none
//                          focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value={2}>2 days</option>
//               <option value={7}>7 days</option>
//               <option value={14}>14 days</option>
//               <option value={30}>30 days</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {/* CHART */}
//       {loading ? (
//         <p className="text-gray-400 text-center py-20">
//           Loading chart...
//         </p>
//       ) : chartData.length === 0 ? (
//         <p className="text-gray-400 text-center py-20">
//           No bookings data available
//         </p>
//       ) : (
//         // <div className="flex-1 min-h-0">
//           <div className="flex-1 pt-2">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//               <XAxis dataKey="date" stroke="#94a3b8" />
//               <YAxis allowDecimals={false} stroke="#94a3b8" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#1e293b",
//                   borderRadius: "8px",
//                   border: "none",
//                   color: "#fff",
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="bookings"
//                 stroke="#6366f1"
//                 strokeWidth={3}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// }
 import { useEffect, useState } from "react";
 import { getAdminBookingsChart } from "../../services/api";
 import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid,
   ResponsiveContainer,
 } from "recharts";
export default function AdminBookingsChart({ showHeader = true } = {}) {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoading(true);
        const res = await getAdminBookingsChart(days);
        setChartData(res.data || []);
      } catch (error) {
        console.error("Failed to load booking chart", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [days]);

  return (
    <div className="h-full flex flex-col">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          {/* <h2 className="text-lg font-semibold text-white">
            Bookings Overview
          </h2> */}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Last</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500"
            >
              <option value={2}>2 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-20">Loading chart...</p>
      ) : chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          No bookings data available
        </p>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#6366f1"
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
