import React, { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTag ,
  FaTimes
} from "react-icons/fa";


const RecruiterDashboard = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    time: "",
    descr: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userName) {
      console.error("Nom d'utilisateur non disponible !");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recruiter/jobs/${userName}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des jobs.");
        const data = await response.json();
        console.log("Jobs récupérés :", data);
        setJobs(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jobs :", error.message);
      }
    };

    const fetchApplications = async () => {
      try {
        console.log("Tentative de récupération des applications pour :", userName);
        
        const response = await fetch(`http://localhost:5000/api/recruiter/applications/${userName}`);
        
        console.log("Statut de la réponse :", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Détails de l'erreur :", errorText);
          throw new Error("Erreur lors de la récupération des applications");
        }
        
        const data = await response.json();
        console.log("Applications reçues :", data);
        
        setApplications(data);
      } catch (error) {
        console.error("Erreur détaillée :", error);
      }
    };

    fetchJobs();
    fetchApplications();
  }, [userName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setJobData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handlePostJob = async () => {
    if (!userName) {
      alert("Nom d'utilisateur non disponible.");
      return;
    }

    const newJob = { ...jobData, userName };

    try {
      const response = await fetch("http://localhost:5000/api/recruiter/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        alert("Job ajouté avec succès !");
        setJobData({ title: "", location: "", time: "", descr: "", skills: [] });
        setSkillInput("");

        const updatedJobs = await fetch(`http://localhost:5000/api/recruiter/jobs/${userName}`);
        setJobs(await updatedJobs.json());
      } else {
        const error = await response.json();
        console.error("Erreur lors de l'ajout du job :", error.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  };

  const handleViewMotivationLetter = (letter) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setSelectedLetter("");
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Dashboard Header */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBriefcase className="mr-4 text-blue-500" />
            Dashboard Recruteur
          </h1>
        </div>

        {/* Job Creation Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaPlus className="mr-3 text-green-500" />
              Ajouter un Job
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handlePostJob();
            }}>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaBriefcase className="mr-2 text-blue-500" />
                  <input
                    type="text"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    placeholder="Titre"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <input
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    placeholder="Lieu"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <FaClock className="mr-2 text-purple-500" />
                  <input
                    type="text"
                    name="time"
                    value={jobData.time}
                    onChange={handleChange}
                    placeholder="Temps"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <textarea
                  name="descr"
                  value={jobData.descr}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-300"
                ></textarea>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Ajouter une compétence"
                    className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {jobData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button 
                        onClick={() => {
                          setJobData(prev => ({
                            ...prev, 
                            skills: prev.skills.filter((_, i) => i !== index)
                          }));
                        }}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                >
                  Poster le Job
                </button>
              </div>
            </form>
          </div>

          {/* Job List Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6 overflow-y-auto max-h-[700px]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Liste des Jobs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 border-b border-gray-200">Titre</th>
                    <th className="px-4 py-3 border-b border-gray-200">Lieu</th>
                    <th className="px-4 py-3 border-b border-gray-200">Temps</th>
                    <th className="px-4 py-3 border-b border-gray-200">Description</th>
                    <th className="px-4 py-3 border-b border-gray-200">Compétences</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border-b border-gray-200">{job.title}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{job.location}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{job.time}</td>
                      <td className="px-4 py-3 border-b border-gray-200">{job.descr}</td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {job.skills && job.skills.length > 0
                            ? job.skills.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                                >
                                  <FaTag className="mr-1" />
                                  {skill}
                                </span>
                              ))
                            : "Aucune compétence"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mt-8 overflow-y-auto max-h-[700px]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Candidatures Reçues
          </h2>
          {applications.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucune candidature reçue
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 border-b border-gray-200">Nom du Candidat</th>
                    <th className="px-4 py-3 border-b border-gray-200">Poste</th>
                    <th className="px-4 py-3 border-b border-gray-200">Lettre de Motivation</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const correspondingJob = jobs.find(job => job._id === application.job_id);
                    
                    return (
                      <tr key={application._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 border-b border-gray-200">
                          {application.applicant_name}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200">
                          {correspondingJob ? correspondingJob.title : 'Poste non trouvé'}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200">
                          <button 
                            onClick={() => handleViewMotivationLetter(application.motivation_letter)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200"
                          >
                            Voir la lettre
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
