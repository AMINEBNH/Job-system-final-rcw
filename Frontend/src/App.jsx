import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/FooterDiv/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Accueil from "./pages/Accueil";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Companies from "./pages/Companies";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [userName, setUserName] = useState("");
  const [recruiterId, setRecruiterId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedIsRecruiter = localStorage.getItem("is_recruiter") === "true";
    const storedRecruiterId = localStorage.getItem("recruiterId");

    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setIsRecruiter(storedIsRecruiter);
      if (storedIsRecruiter) {
        setRecruiterId(storedRecruiterId);
      }
    }
  }, []);

  const handleLogin = (name, token, isRecruiter = false, recruiterId = "") => {
    setIsLoggedIn(true);
    setUserName(name);
    setIsRecruiter(isRecruiter);
    localStorage.setItem("userName", name);
    localStorage.setItem("token", token);
    localStorage.setItem("is_recruiter", isRecruiter);
    if (isRecruiter) {
      setRecruiterId(recruiterId);
      localStorage.setItem("recruiterId", recruiterId);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setIsRecruiter(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("is_recruiter");
    localStorage.removeItem("recruiterId");
    setRecruiterId("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar isLoggedIn={isLoggedIn} userName={userName} handleLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<PublicRoute isLoggedIn={isLoggedIn} isRecruiter={isRecruiter}><Accueil /></PublicRoute>}
          />
          <Route
            path="/login"
            element={<PublicRoute isLoggedIn={isLoggedIn} isRecruiter={isRecruiter}><Login onLogin={handleLogin} /></PublicRoute>}
          />
          <Route path="/signup" element={<PublicRoute isLoggedIn={isLoggedIn}><Signup /></PublicRoute>} />
          <Route path="/home" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home /></ProtectedRoute>} />
          <Route
            path="/profile"
            element={<ProtectedRoute isLoggedIn={isLoggedIn}><Profile userName={userName} /></ProtectedRoute>}
          />
          <Route
            path="/recruiter-dashboard"
            element={<ProtectedRoute isLoggedIn={isLoggedIn}><RecruiterDashboard recruiterId={recruiterId} /></ProtectedRoute>}
          />
          <Route
            path="/companies"
            element={<PublicRoute isLoggedIn={isLoggedIn}><Companies /></PublicRoute>}
          />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

