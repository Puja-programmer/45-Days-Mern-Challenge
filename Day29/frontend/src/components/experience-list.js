import React from "react";
import ExperienceCard from "./ExperienceCard";
import styled from "styled-components";

// 🌟 Styled Components
const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 24px;
  padding: 10px 0;
`;

const RefreshButton = styled.button`
  display: block;
  margin: 0 auto 20px auto;
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #155ab6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.error ? "red" : "#555")};
`;

// Skeleton Loader for better UX
const Skeleton = styled.div`
  height: 180px;
  background: #e4e7eb;
  border-radius: 12px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`;

const SkeletonLoader = () => (
  <ListContainer>
    {[...Array(4)].map((_, idx) => (
      <Skeleton key={idx} />
    ))}
  </ListContainer>
);

// 🌟 Main Component
const ExperienceList = ({ experiences, onDelete, onRefresh, loading, error }) => {
  if (loading) return <SkeletonLoader />;

  if (error) return <Message error>{error}</Message>;

  if (!experiences || experiences.length === 0)
    return <Message>⚠ No experiences found.</Message>;

  return (
    <>
      {onRefresh && (
        <RefreshButton onClick={onRefresh}>
          🔄 Refresh List
        </RefreshButton>
      )}

      <ListContainer>
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp._id}
            experience={exp}
            onDelete={onDelete}
          />
        ))}
      </ListContainer>
    </>
  );
};

export default React.memo(ExperienceList);
