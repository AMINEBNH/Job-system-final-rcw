import React, { useState, useEffect } from "react";

const Applications = ({ recruiterId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recruiter/applications/${recruiterId}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des candidatures.");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [recruiterId]);

  if (loading) return <p>Chargement des candidatures...</p>;

  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidatures reçues</h1>
      <ul className="space-y-4">
        {applications.map((application, index) => (
          <li key={index} className="bg-white shadow p-4 rounded">
            <p className="text-lg font-semibold">{application.applicant_name}</p>
            <p className="text-gray-700">{application.motivation_letter}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
