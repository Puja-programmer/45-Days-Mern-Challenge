// src/services/api.js
const API_URL = "http://localhost:4000/api/experiences";

// ✅ Fetch all experiences
export const fetchExperiences = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch experiences");
    return await response.json();
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

// ✅ Add new experience
export const addExperience = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add experience");
    return await response.json();
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
};

// ✅ Delete experience by ID
export const deleteExperience = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete experience");
    return await response.json();
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
};
