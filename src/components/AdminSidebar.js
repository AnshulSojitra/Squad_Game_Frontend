import { Link } from "react-router-dom";

const AdminSidebar = () => (
  <aside className="w-64 bg-gray-900 text-white">
    <h1 className="text-xl font-bold p-4">Admin Panel</h1>
    <nav className="flex flex-col gap-2 p-4">
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/games">Games</Link>
      <Link to="/admin/grounds">Grounds</Link>
      <Link to="/admin/bookings">Bookings</Link>
    </nav>
  </aside>
);

export default AdminSidebar;
