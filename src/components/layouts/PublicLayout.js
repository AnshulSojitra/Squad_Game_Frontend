import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      {/* Fixed navbar offset */}
      <div>
        <Outlet />
      </div>
    </>
  );
}
