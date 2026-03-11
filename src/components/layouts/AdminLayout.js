import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminHeader from "../headers/AdminHeader";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mobilePanelRef = useRef(null);

  useEffect(() => {
    if (mobileSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    const onPointerDown = (e) => {
      if (
        mobileSidebarOpen &&
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(e.target)
      ) {
        setMobileSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block bg-slate-900">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 px-4 sm:px-6 py-4 sm:py-6 text-white">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[80] transition ${
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileSidebarOpen}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mobileSidebarOpen ? "opacity-100 bg-black/60" : "opacity-0 bg-black/0"
          }`}
          aria-hidden="true"
          onClick={() => setMobileSidebarOpen(false)}
        />

        <div
          ref={mobilePanelRef}
          className={`absolute left-0 top-0 h-dvh w-[86vw] max-w-[380px] shadow-2xl overflow-y-auto transform transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <AdminSidebar
            collapsed={false}
            setCollapsed={() => {}}
            onItemClick={() => setMobileSidebarOpen(false)}
            showMobileClose
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
