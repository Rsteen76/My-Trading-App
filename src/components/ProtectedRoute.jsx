// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";

function ProtectedRoute({ children }) {
  if (!auth.currentUser) {
    // If no user is logged in, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }

  // Otherwise, render the children (the component that this route is protecting)
  return children;
}

export default ProtectedRoute;
