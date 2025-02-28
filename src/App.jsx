// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Rules from "./pages/Rules"; // Import from pages
import SummaryPage from "./pages/SummaryPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto w-full p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      
      <footer className="bg-gray-800 p-4 text-center">
        <p>© 2025 My Trading App</p>
      </footer>
    </div>
  );
}

export default App;
