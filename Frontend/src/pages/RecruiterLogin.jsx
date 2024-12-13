import React, { useState, useEffect } from "react";

const RecruiterDashboard = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!recruiterId) {
        console.error("Recruiter ID is missing.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:5000/api/recruiter/applications/${recruiterId}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des candidatures.");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchApplications();
  }, [recruiterId]);

  if (loading) return <p>Chargement des postes...</p>;

  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord du recruteur</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Titre du poste</th>
            <th className="border border-gray-300 p-2">Lieu</th>
            <th className="border border-gray-300 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className="border border-gray-300 p-2">{job.title}</td>
              <td className="border border-gray-300 p-2">{job.location}</td>
              <td className="border border-gray-300 p-2">{job.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruiterDashboard;
