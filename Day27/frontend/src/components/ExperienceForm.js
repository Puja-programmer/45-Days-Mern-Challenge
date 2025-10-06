import React, { useState } from "react";
import styled from "styled-components";
import { addExperience } from "../services/api";

const FormContainer = styled.div`
  background: #f4f6f8;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccd0d5;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccd0d5;
  font-size: 14px;
  resize: none;
  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
  }
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const SubmitButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #155ab6;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${(props) => (props.error ? "red" : "green")};
`;

const ExperienceForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({ company:"", position:"", startDate:"", endDate:"", current:false, description:"", skills:"" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(""); setError("");

    if (!formData.company || !formData.position || !formData.startDate) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s=>s.trim()).filter(Boolean)
      };
      await addExperience(payload);
      setMessage("Experience added successfully!");
      setFormData({ company:"", position:"", startDate:"", endDate:"", current:false, description:"", skills:"" });
      if(onAdd) onAdd(); // refresh list
    } catch(err) {
      console.error(err);
      setError("Failed to add experience. Try again.");
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Label>Company*</Label>
        <Input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Enter company name"/>
        <Label>Position*</Label>
        <Input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Enter your role"/>
        <Label>Start Date*</Label>
        <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange}/>
        <Label>Current Role</Label>
        <input type="checkbox" name="current" checked={formData.current} onChange={handleChange}/>
        {!formData.current && <>
          <Label>End Date</Label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange}/>
        </>}
        <Label>Description</Label>
        <TextArea rows="3" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description"/>
        <Label>Skills (comma-separated)</Label>
        <Input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Node.js, SQL"/>
        <SubmitButton type="submit">Add Experience</SubmitButton>
        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}
      </Form>
    </FormContainer>
  );
};

export default ExperienceForm;
