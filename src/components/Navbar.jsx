import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset ALL app data? This will clear your trade history and settings.")) {
      // Clear all app-related data from localStorage
      localStorage.removeItem("tradesLogged");
      localStorage.removeItem("tradeSettings");
      
      // You can add any other app-specific localStorage keys here
      // For example:
      // localStorage.removeItem("userPreferences");
      // localStorage.removeItem("customIndicators");
      
      // Navigate to Planner page after resetting so user can set up new settings
      navigate("/planner");
      
      // Force page reload to ensure all components re-initialize with fresh state
      window.location.reload();
    }
  };

  return (
    <nav className="bg-gray-900 text-white py-4 shadow">
      {/* Outer container with max width, horizontal padding, and flex layout */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Left: Brand/Logo */}
        <div className="flex-1">
          <Link to="/dashboard" className="text-2xl font-bold hover:underline">
            My Trading App
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 flex justify-center gap-8">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/planner" className="hover:underline">
            Planner
          </Link>
          <Link to="/summary" className="hover:underline">
            Summary
          </Link>
        </div>

        {/* Right: Reset Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            Reset
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
