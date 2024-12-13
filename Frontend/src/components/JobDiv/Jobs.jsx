import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BiTimeFive } from "react-icons/bi";
import Search from "../SearchDiv/Search"; // Import du composant Search
import { getJobs } from "../Job_api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des jobs :", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (job) => {
    const motivationLetter = localStorage.getItem("motivationLetter");
    const userName = localStorage.getItem("userName");

    if (!motivationLetter || !userName) {
      alert("Veuillez générer une lettre de motivation et vous assurer que vous êtes connecté !");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job._id,
          applicant_name: userName,
          motivation_letter: motivationLetter,
        }),
      });

      if (response.ok) {
        alert(`Votre candidature pour ${job.title} a été envoyée avec succès !`);
      } else {
        console.error("Erreur lors de la candidature :", await response.text());
      }
    } catch (error) {
      console.error("Erreur lors de la candidature :", error.message);
    }
  };

  if (loading) return <p className="text-center">Chargement des jobs...</p>;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Jobs</h1>

      {/* Composant de recherche */}
      <div className="max-w-6xl mx-auto mb-10">
        <Search setJobs={setJobs} />
      </div>

      {/* Liste des jobs */}
      <div className="JobContainer max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            className="group bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300 relative border border-gray-200"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {job.logo_url && (
              <div className="flex justify-center mb-3">
                <img
                  src={`http://localhost:5000${job.logo_url}`}
                  alt={`${job.company || "Company"} Logo`}
                  className="w-12 h-12 object-contain rounded-full border border-gray-300"
                />
              </div>
            )}
            <h2 className="text-lg font-bold text-blue-600 mb-2 text-center">{job.title}</h2>
            <div className="text-sm text-gray-600 flex justify-between mb-3">
              <span>
                <BiTimeFive className="inline-block mr-1" />
                {job.time}
              </span>
              <span>
                <strong>Location:</strong> {job.location}
              </span>
            </div>
            <p className="text-gray-700 text-center mb-2">
              <strong>Company:</strong> {job.company || "N/A"}
            </p>
            <div className="mb-3">
              <strong className="text-sm text-gray-700">Skills:</strong>
              <ul className="list-disc list-inside text-gray-600 mt-1 text-sm">
                {job.skills.length > 0
                  ? job.skills.map((skill, idx) => <li key={idx}>{skill}</li>)
                  : "Not specified"}
              </ul>
            </div>
            <button
              onClick={() => handleApply(job)}
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
