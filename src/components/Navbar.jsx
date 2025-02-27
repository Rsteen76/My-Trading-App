import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all trade history?")) {
      localStorage.removeItem("tradesLogged");
      alert("Trade history has been cleared.");
      // Optionally clear other keys if needed:
      // localStorage.removeItem("tradeSettings");

      // Navigate to Dashboard after resetting
      navigate("/dashboard");
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
