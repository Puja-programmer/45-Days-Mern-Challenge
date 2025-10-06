// src/components/ExperienceCard.js
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ExperienceCard = ({ experience }) => {
  return (
    <Card>
      <h3>{experience.title}</h3>
      <p><strong>Company:</strong> {experience.company}</p>
      <p><strong>Location:</strong> {experience.location || "N/A"}</p>
      <p>
        <strong>Duration:</strong>{" "}
        {experience.startDate ? new Date(experience.startDate).toLocaleDateString() : "N/A"} –{" "}
        {experience.currentlyWorking ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString() : "N/A"}
      </p>
      {experience.description && <p>{experience.description}</p>}
      {experience.skills && experience.skills.length > 0 && (
        <p><strong>Skills:</strong> {experience.skills.join(", ")}</p>
      )}
    </Card>
  );
};

export default ExperienceCard;
