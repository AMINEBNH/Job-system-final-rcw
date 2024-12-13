import axios from "axios";


const API_URL = "http://localhost:5000/api/auth";

// Fonction pour l'inscription
export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// Fonction pour la connexion
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};



// Récupère les données utilisateur
export const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trouvé. Veuillez vous connecter.");
      }
      if (token.split('.').length !== 3) {
        throw new Error("Token JWT mal formé.");
      }
      const response = await axios.get("http://localhost:5000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error.message);
      throw error;
    }
  };
  // Met à jour les données utilisateur
  export const updateUserData = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
      throw error;
    }
  };
  
  // Fonction pour communiquer avec le chatbot
export const chatWithBot = async (message) => {
    try {
      if (!message) throw new Error("Le message est requis.");
  
      const response = await axios.post(
        `${API_URL}/chat`, // URL de l'API chatbot
        { message }, // Corps de la requête avec le message
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajoutez le JWT
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data.response; // Retourne la réponse du chatbot
    } catch (error) {
      console.error("Erreur lors de la communication avec le chatbot :", error);
      throw error;
    }
  };


  // Récupère tous les jobs
export const getJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des jobs :", error.message);
      throw error;
    }
  };
  
  // Ajoute un job
  export const addJob = async (jobData) => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/add-job`, jobData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du job :", error.message);
      throw error;
    }
  };
  
  // Upload du logo pour un recruteur
  export const uploadLogo = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/recruiter/upload-logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload du logo :", error.message);
      throw error;
    }
  };
  