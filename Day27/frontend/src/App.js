import React, { useState, useEffect } from "react";
import ExperienceList from "./components/experience-list"; 
import ExperienceForm from "./components/ExperienceForm";
import { fetchExperiences } from "./services/api";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
`;

/* Simple, professional heading */
const Heading = styled.h1`
  font-size: 36px;
  text-align: center;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 10px;
`;

/* Subtitle for context */
const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-bottom: 40px;
`;

function App() {
  const [experiences, setExperiences] = useState([]);

  const loadExperiences = async () => {
    try {
      const data = await fetchExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to load experiences", error);
    }
  };

  const handleDelete = (id) => {
    setExperiences(prev => prev.filter(exp => exp._id !== id));
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  return (
    <Container>
      <Heading>Work Experience</Heading>
      <Subtitle>Showcasing my professional journey and skills</Subtitle>

      <ExperienceForm onAdd={loadExperiences} />
      <ExperienceList experiences={experiences} onDelete={handleDelete} onRefresh={loadExperiences} />
    </Container>
  );
}

export default App;
