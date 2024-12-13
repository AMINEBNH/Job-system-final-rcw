import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Récupérer tous les jobs
export const getJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jobs :", error.message);
    throw error;
  }
};

// Ajouter un job
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



export const getJobsWithFilters = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${BASE_URL}/jobs?${params}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jobs :", error.message);
    throw error;
  }
};