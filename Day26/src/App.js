import React from "react";
import ExperienceList from "./components/experience-list";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  color: #1a73e8;
`;

function App() {
  return (
    <Container>
      <Heading>Work Experience</Heading>
      <ExperienceList />
    </Container>
  );
}

export default App;
