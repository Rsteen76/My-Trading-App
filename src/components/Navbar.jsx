import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase"; // Import auth
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset ALL app data? This will clear your trade history, settings, and rules.")) {
      // Clear all app-related data from localStorage
      localStorage.removeItem("tradesLogged");
      localStorage.removeItem("tradeSettings");
      localStorage.removeItem("tradingRules");
      localStorage.removeItem("rulesCheckedStatus");
      localStorage.removeItem("tradingHistory");
      localStorage.removeItem("currentBalance");
      localStorage.removeItem("initialBalance");
      localStorage.removeItem("traderSettings");
      
      // Navigate to Planner page after resetting
      navigate("/planner");
      
      // Force page reload to ensure all components re-initialize with fresh state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth"); // Redirect to the auth page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <nav className="bg-gray-900 text-white py-3 shadow">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Left: Brand/Logo */}
          <div className="flex-1">
            <Link 
              to="/" 
              className="text-xl lg:text-2xl font-bold hover:text-gray-300 transition"
            >
              My Trading App
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex-1 flex justify-center gap-6 lg:gap-8">
            <Link 
              to="/" 
              className={`${isActive("/") ? "text-blue-400" : "hover:text-gray-300"} transition`}
            >
              Dashboard
            </Link>
            <Link 
              to="/planner" 
              className={`${isActive("/planner") ? "text-blue-400" : "hover:text-gray-300"} transition`}
            >
              Planner
            </Link>
            <Link 
              to="/rules" 
              className={`${isActive("/rules") ? "text-blue-400" : "hover:text-gray-300"} transition`}
            >
              Rules
            </Link>
            <Link 
              to="/summary" 
              className={`${isActive("/summary") ? "text-blue-400" : "hover:text-gray-300"} transition`}
            >
              Summary
            </Link>
            {!user && (
              <Link
                to="/auth"
                className={`${
                  isActive("/auth")
                    ? "text-blue-400"
                    : "hover:text-gray-300"
                } transition`}
              >
                Login
              </Link>
            )}
            {user && (
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Right: Reset Button */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition"
              aria-label="Reset all data"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          {/* Mobile Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold hover:text-gray-300 transition"
            onClick={handleLinkClick}
          >
            My Trading App
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-2 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`py-2 px-1 ${isActive("/") ? "text-blue-400" : "hover:text-gray-300"} transition`}
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
              <Link 
                to="/planner" 
                className={`py-2 px-1 ${isActive("/planner") ? "text-blue-400" : "hover:text-gray-300"} transition`}
                onClick={handleLinkClick}
              >
                Planner
              </Link>
              <Link 
                to="/rules" 
                className={`py-2 px-1 ${isActive("/rules") ? "text-blue-400" : "hover:text-gray-300"} transition`}
                onClick={handleLinkClick}
              >
                Rules
              </Link>
              <Link 
                to="/summary" 
                className={`py-2 px-1 ${isActive("/summary") ? "text-blue-400" : "hover:text-gray-300"} transition`}
                onClick={handleLinkClick}
              >
                Summary
              </Link>
              {!user && (
              <Link
                to="/auth"
                className={`${
                  isActive("/auth")
                    ? "text-blue-400"
                    : "hover:text-gray-300"
                } transition`}
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}
            {user && (
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition w-full"
              >
                Logout
              </button>
            )}
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full transition"
                  aria-label="Reset all data"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
