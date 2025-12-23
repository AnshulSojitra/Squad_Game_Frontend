const Dashboard = () => {
  // Mock stats (replace with API later)
  const stats = [
    { title: "Total Games", value: 3 },
    { title: "Total Grounds", value: 8 },
    { title: "Total Bookings", value: 21 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">{item.title}</p>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded cursor-pointer">
            Manage Games
          </div>
          <div className="bg-green-100 p-4 rounded cursor-pointer">
            Manage Grounds
          </div>
          <div className="bg-purple-100 p-4 rounded cursor-pointer">
            View Bookings
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
