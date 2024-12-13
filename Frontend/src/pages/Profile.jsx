import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  FaFileUpload, 
  FaList, 
  FaEnvelope, 
  FaSave, 
  FaSpinner 
} from "react-icons/fa";

const Profile = ({ userName }) => {
  const [cv, setCv] = useState(null);
  const [skills, setSkills] = useState([]);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonClicks, setButtonClicks] = useState({
    short: 0,
    long: 0
  });

  // Vérifier le localStorage au chargement
  useEffect(() => {
    const storedLetter = localStorage.getItem("motivationLetter");
    if (storedLetter) {
      setMotivationLetter(storedLetter);
    }
  }, []);

  const handleCvUpload = (e) => setCv(e.target.files[0]);

  const handleExtractSkills = async () => {
    try {
      if (!cv) {
        alert("Veuillez télécharger un CV avant d'extraire les compétences.");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("cv", cv);

      const response = await fetch("http://localhost:5000/api/profile/extract-skills", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSkills(data.skills || []);
        alert("Compétences extraites avec succès !");
      } else {
        console.error("Erreur lors de l'extraction des compétences :", data.error);
        alert("Erreur : " + data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction des compétences :", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLetter = async (type) => {
    try {
      setLoading(true);
      // Incrémenter le nombre de clics pour ce type de lettre
      setButtonClicks(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));

      const response = await fetch("http://localhost:5000/api/profile/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          type,
          skills,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const letter = data.letter || "";
        setMotivationLetter(letter);
        localStorage.setItem("motivationLetter", letter);
        alert("Lettre générée avec succès !");
        triggerConfetti();
      } else {
        console.error("Erreur lors de la génération de la lettre :", data.error);
        alert("Erreur : " + data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la lettre :", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          skills,
          motivationLetter,
        }),
      });

      if (response.ok) {
        localStorage.setItem("motivationLetter", motivationLetter);
        alert("Données enregistrées avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement :", await response.text());
        alert("Erreur lors de l'enregistrement des données.");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex flex-col items-center py-10">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none"></div>
      
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8 relative">
        {/* Indicateur de chargement */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-6 flex items-center justify-center">
          <FaEnvelope className="mr-4 text-blue-400" />
          Mon Profil
        </h1>

        <p className="text-lg text-gray-700 text-center mb-8">
          Bonjour, <span className="font-bold text-blue-500">{userName}</span> !
        </p>

        {/* Section Upload CV */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaFileUpload className="mr-3 text-blue-500" />
            Téléchargez votre CV
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleCvUpload}
              className="flex-grow border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleExtractSkills}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 flex items-center"
            >
              <FaList className="mr-2" /> Extraire les compétences
            </button>
          </div>
        </div>

        {/* Section Compétences */}
        {skills && skills.length > 0 ? (
  <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Compétences extraites</h2>
    <ul className="list-disc list-inside grid grid-cols-2 gap-2">
      {skills.map((skill, index) => (
        <li key={index} className="text-gray-700">{skill}</li>
      ))}
    </ul>
  </div>
) : (
  <div className="mb-8 bg-red-50 p-6 rounded-lg border border-red-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Aucune compétence extraite</h2>
    <p className="text-gray-700">Veuillez télécharger un CV valide et extraire les compétences.</p>
  </div>
)}

        {/* Section Lettre de motivation */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lettre de motivation</h2>
          <textarea
            value={motivationLetter}
            readOnly
            rows="6"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          ></textarea>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleGenerateLetter("short")}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 relative"
            >
              Générer une lettre courte
              {buttonClicks.short > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {buttonClicks.short}
                </span>
              )}
            </button>
            <button
              onClick={() => handleGenerateLetter("long")}
              className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 relative"
            >
              Générer une lettre longue
              {buttonClicks.long > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {buttonClicks.long}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bouton Enregistrement */}
        <button
          onClick={handleSaveProfile}
          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
        >
          <FaSave className="mr-3" /> Enregistrer dans la base de données
        </button>
      </div>
    </div>
  );
};

export default Profile;
