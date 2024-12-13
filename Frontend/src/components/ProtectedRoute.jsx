import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, isRecruiter, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (isRecruiter && window.location.pathname !== "/recruiter-dashboard") {
    return <Navigate to="/recruiter-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
