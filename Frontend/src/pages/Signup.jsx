import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    is_recruiter: false,
    logo_url: "",
  });
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Vous devez accepter les Termes et Conditions pour continuer.");
      return;
    }

    const apiUrl = formData.is_recruiter
      ? "http://localhost:5000/api/auth/recruiter-signup"
      : "http://localhost:5000/api/auth/signup";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Compte créé avec succès !");
        navigate("/login");
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-green-600 mb-4 text-center">
          Créer un compte
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
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
            <label htmlFor="is_recruiter" className="text-sm text-gray-600">
              Je suis un recruteur
            </label>
          </div>
          {formData.is_recruiter && (
            <div className="mb-6">
              <label htmlFor="logo_url" className="block text-gray-700 font-medium mb-2">
                URL du logo (facultatif)
              </label>
              <input
                type="text"
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          )}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={handleTermsChange}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              J'accepte les{" "}
              <a href="/terms" className="text-green-500 hover:underline">
                Termes et Conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
