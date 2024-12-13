import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "", is_recruiter: false });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.name, data.token, data.is_recruiter, data.is_recruiter ? data.recruiterId : "");
        navigate(data.is_recruiter ? "/recruiter-dashboard" : "/home");
      } else {
        setError(data.error || "Erreur lors de la connexion");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Connexion</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="is_recruiter"
              name="is_recruiter"
              checked={formData.is_recruiter}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_recruiter" className="text-sm text-gray-600">Je suis un recruteur</label>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
