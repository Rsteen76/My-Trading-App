import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Tracker from "./pages/Tracker";
import SummaryPage from "./pages/SummaryPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      {/* Outer container with a dark background and white text */}
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Navbar />
        
        {/* Main content area: grows to fill leftover space, centered with max-w-4xl */}
        <main className="flex-grow max-w-4xl mx-auto w-full p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Routes>
        </main>
        
        {/* Simple footer */}
        <footer className="bg-gray-800 p-4 text-center">
          <p>© 2025 My Trading App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
