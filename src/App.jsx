// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom"; // Make sure Link is imported
import Navbar from "./components/Navbar";
import Planner from "./pages/Planner";
import Rules from "./pages/Rules";
import SummaryPage from "./pages/SummaryPage";
import Dashboard from "./pages/Dashboard";

function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you are looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Go to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* Removed # */}
          <Route path="/planner" element={<Planner />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p>© 2025 My Trading App</p>
      </footer>
    </div>
  );
}

export default App;
