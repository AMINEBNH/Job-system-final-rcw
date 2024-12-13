import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ isLoggedIn, isRecruiter, children }) => {
  if (isLoggedIn) {
    return isRecruiter ? <Navigate to="/recruiter-dashboard" replace /> : <Navigate to="/home" replace />;
  }
  return children;
};

export default PublicRoute;
