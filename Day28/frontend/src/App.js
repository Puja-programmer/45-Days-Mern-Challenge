import React, { useState, useEffect } from "react";
import ExperienceList from "./components/experience-list";
import ExperienceForm from "./components/ExperienceForm";
import { fetchExperiences, deleteExperience } from "./services/api";
import styled from "styled-components";

// 🌟 Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: 36px;
  text-align: center;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 40px;
`;

// 🌟 Main App Component
function App() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch all experiences
  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await fetchExperiences();
      setExperiences(data);
      setError("");
    } catch (err) {
      console.error("Failed to load experiences", err);
      setError("⚠️ Failed to fetch experiences.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Unable to delete experience. Try again.");
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    loadExperiences();
  }, []);

  return (
    <Container>
      <Heading>Work Experience</Heading>
      <Subtitle>Showcasing my professional journey and skills</Subtitle>

      {/* Add New Experience */}
      <ExperienceForm onAdd={loadExperiences} />

      {/* List Section */}
      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Loading experiences...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <ExperienceList
          experiences={experiences}
          onDelete={handleDelete}
          onRefresh={loadExperiences}
        />
      )}
    </Container>
  );
}

export default App;
