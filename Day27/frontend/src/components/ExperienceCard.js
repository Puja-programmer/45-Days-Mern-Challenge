import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border-radius: 12px;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  }
`;

const Title = styled.h3`
  color: #1a73e8;
  font-size: 22px;
  margin-bottom: 8px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  margin: 6px 0;
  color: #555;
`;

const Skills = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SkillTag = styled.span`
  background-color: #e1f0ff;
  color: #1a73e8;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  &:hover {
    background-color: #cbe3ff;
    transform: scale(1.05);
  }
`;

const DeleteButton = styled.button`
  margin-top: 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover {
    background-color: #d9363e;
    transform: translateY(-2px);
  }
`;

const ExperienceCard = ({ experience, onDelete }) => {
  const { _id, company, position, location, startDate, endDate, current, description, skills } = experience;

  return (
    <Card>
      <Title>{position || "Untitled Role"}</Title>
      <Paragraph><strong>Company:</strong> {company || "N/A"}</Paragraph>
      {location && <Paragraph><strong>Location:</strong> {location}</Paragraph>}
      <Paragraph>
        <strong>Duration:</strong> {startDate ? new Date(startDate).toLocaleDateString() : "N/A"} –{" "}
        {current ? "Present" : endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
      </Paragraph>
      {description && <Paragraph>{description}</Paragraph>}
      {skills && skills.length > 0 && (
        <Skills>
          {skills.map((skill, idx) => <SkillTag key={idx}>{skill}</SkillTag>)}
        </Skills>
      )}
      {onDelete && <DeleteButton onClick={() => onDelete(_id)}>Delete</DeleteButton>}
    </Card>
  );
};

export default ExperienceCard;
