// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:4000/api"; // backend on port 4000

export const fetchExperiences = async () => {
  try {
    const response = await axios.get(`${API_BASE}/experiences`);
    return response.data; // make sure backend returns an array
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
};
