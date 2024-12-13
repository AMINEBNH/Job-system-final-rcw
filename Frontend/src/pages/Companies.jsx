import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/recruiter/");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des recruteurs.");
        }
        const data = await response.json();
        setRecruiters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/recruiter-login"); // Redirection vers la page de connexion des recruteurs
  };

  if (loading) return <p>Chargement des compagnies...</p>;

  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nos Partenaires</h1>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Se connecter pour poster un job
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recruiters.map((recruiter) => (
          <div key={recruiter._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-center mb-3">
              <img
                src={`http://localhost:5000${recruiter.logo_url}`}
                alt={`${recruiter.name} Logo`}
                className="w-20 h-20 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{recruiter.name}</h2>
            <p className="text-gray-600 text-center">{recruiter.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
