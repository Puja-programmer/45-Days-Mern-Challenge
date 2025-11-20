import React, { useState } from "react";
import styled from "styled-components";
import { addExperience } from "../services/api";

/* -------------------- Styled Components -------------------- */

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
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccd0d5;
  font-size: 14px;
  transition: all 0.25s ease;
  background: ${(props) => (props.error ? "#ffe6e6" : "white")};

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
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#9bc2f4" : "#1a73e8")};
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#9bc2f4" : "#155ab6")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${(props) => (props.error ? "red" : "green")};
  margin-top: 10px;
  font-weight: 500;
`;

/* -------------------- Component -------------------- */

const ExperienceForm = ({ onAdd }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Auto clear messages
  const showTempMessage = (msg, isError = false) => {
    isError ? setError(msg) : setMessage(msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  /* -------------------- Handle Input Change -------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------- Validation -------------------- */
  const validateForm = () => {
    const { company, position, startDate, endDate, current } = formData;

    if (!company || !position || !startDate) {
      showTempMessage("⚠ Please fill required fields.", true);
      return false;
    }

    if (startDate > today) {
      showTempMessage("⚠ Start date cannot be in the future.", true);
      return false;
    }

    if (!current && endDate && endDate < startDate) {
      showTempMessage("⚠ End date must be after Start date.", true);
      return false;
    }

    return true;
  };

  /* -------------------- Submit Handler -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await addExperience(payload);

      showTempMessage("✅ Experience added successfully!");

      // Reset form
      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        skills: "",
      });

      onAdd?.();
    } catch (err) {
      console.error(err);
      showTempMessage("❌ Failed to add experience.", true);
    }

    setLoading(false);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Label>Company*</Label>
        <Input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company name"
          error={!formData.company && error}
        />

        <Label>Position*</Label>
        <Input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter job title"
          error={!formData.position && error}
        />

        <Label>Start Date*</Label>
        <Input
          type="date"
          name="startDate"
          max={today}
          value={formData.startDate}
          onChange={handleChange}
          error={!formData.startDate && error}
        />

        <CheckboxRow>
          <input
            type="checkbox"
            name="current"
            checked={formData.current}
            onChange={handleChange}
          />
          <Label>Currently Working</Label>
        </CheckboxRow>

        {!formData.current && (
          <>
            <Label>End Date</Label>
            <Input
              type="date"
              name="endDate"
              min={formData.startDate || ""}
              max={today}
              value={formData.endDate}
              onChange={handleChange}
            />
          </>
        )}

        <Label>Description</Label>
        <TextArea
          rows="3"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your work and achievements"
        />

        <Label>Skills (comma-separated)</Label>
        <Input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., React, Node.js, SQL"
        />

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Experience"}
        </SubmitButton>

        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}
      </Form>
    </FormContainer>
  );
};

export default ExperienceForm;
