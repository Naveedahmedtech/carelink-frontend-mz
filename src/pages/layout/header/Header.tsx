import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsSidebarOpen(!isNowMobile); // Default open for desktop, closed for mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      {/* Sidebar */}
      <div
        className={`
          transition-all duration-300 bg-[#06202A] text-white h-full
          ${isMobile ? "fixed top-0 left-0 z-30" : "relative z-10"}
          ${isSidebarOpen ? "w-[260px]" : isMobile ? "w-0" : "w-[60px]"}
          overflow-hidden
        `}
      >
      </div>

      {/* Backdrop on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-4 z-40 bg-white text-gray-800 p-2 rounded-full shadow-md border transition-all duration-300
          ${(isMobile && isSidebarOpen) ? "left-56" : isSidebarOpen ? "left-[260px]" : "left-[50px]"}
        `}
      >
        {isSidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className={`${isMobile ? "px-1 py-8" : "px-6 py-8"} min-h-screen`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Header;
