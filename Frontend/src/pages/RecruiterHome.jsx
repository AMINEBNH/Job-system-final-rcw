import React, { useEffect, useState } from "react";

const RecruiterHome = ({ recruiterId }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recruiter/${recruiterId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations.");
        }
        const data = await response.json();
        setRecruiter(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterDetails();
  }, [recruiterId]);

  if (loading) return <p className="text-center">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {recruiter && (
        <div className="text-center">
          <img
            src={`http://localhost:5000${recruiter.logo_url}`}
            alt={`${recruiter.name} Logo`}
            className="w-32 h-32 object-contain mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-blue-600">{recruiter.name}</h1>
        </div>
      )}
      <button
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
        onClick={() => alert("Fonctionnalité à venir !")}
      >
        Poster un Job
      </button>
    </div>
  );
};

export default RecruiterHome;
