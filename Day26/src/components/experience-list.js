import React, { useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { fetchExperiences } from "../services/api"; // matches api.js
import styled from "styled-components";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
`;

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchExperiences();
        console.log("Fetched experiences:", data);
        setExperiences(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <Message>Loading experiences...</Message>;
  if (error) return <Message style={{ color: "red" }}>Error: {error}</Message>;
  if (experiences.length === 0) return <Message>No experiences found.</Message>;

  return (
    <ListContainer>
      {experiences.map((exp) => (
        <ExperienceCard key={exp._id} experience={exp} />
      ))}
    </ListContainer>
  );
};

export default ExperienceList;
