import React, { useState, useEffect, useCallback } from "react";
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

const LogBox = styled.div`
  background: #eef7ff;
  padding: 12px;
  border-left: 4px solid #1a73e8;
  margin-top: 30px;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 14px;
  color: #333;
`;

// 🌟 Main App Component
function App() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [effectLogs, setEffectLogs] = useState([]);

  // 🧠 Log any effect event
  const logEffect = (msg) => {
    setEffectLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
  };

  // 🔹 Fetch all experiences
  const loadExperiences = useCallback(async () => {
    try {
      logEffect("Fetching experiences...");
      setLoading(true);

      const data = await fetchExperiences();
      setExperiences(data);
      setError("");
    } catch (err) {
      console.error("Failed to load experiences", err);
      setError("⚠️ Failed to fetch experiences.");
    } finally {
      setLoading(false);
      logEffect("Finished fetching experiences.");
    }
  }, []);

  // 🔹 Handle delete
  const handleDelete = async (id) => {
    try {
      logEffect(`Deleting experience (ID: ${id})...`);
      await deleteExperience(id);

      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      logEffect(`Deleted experience (ID: ${id})`);
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Unable to delete experience. Try again.");
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    logEffect("Initial load triggered.");
    loadExperiences();

    return () => logEffect("App unmounted (cleanup)");
  }, [loadExperiences]);

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

      {/* 📘 Effect Log Monitor */}
      <LogBox>
        <strong>🧠 useEffect Logs:</strong>
        <ul>
          {effectLogs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </LogBox>
    </Container>
  );
}

export default App;

