import React, { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Generic validation for one field
  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.trim().length < 2) error = "Name must be at least 2 characters";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Enter a valid email";
    }

    if (name === "message") {
      if (!value.trim()) error = "Message is required";
      else if (value.trim().length < 10) error = "Message must be at least 10 characters";
    }

    return error;
  };

  // Validate whole form, return true if valid
  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // real-time validation if field already touched
    if (touched[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        const err = validateField(name, value);
        if (err) copy[name] = err;
        else delete copy[name];
        return copy;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));

    // validate this field on blur
    setErrors((prev) => {
      const copy = { ...prev };
      const err = validateField(name, value);
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!validateForm()) {
      // invalid
      return;
    }

    // Simulate form submit (e.g., API call)
    console.log("Form submitted:", form);
    setSubmitted(true);

    // Optionally clear form after submit
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setTouched({});
    // hide success after 3s
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Useful for disabling submit button quickly
  const isDisabled =
    !form.name.trim() || !form.email.trim() || !form.message.trim() || Object.keys(errors).length > 0;

  // Simple inline styles (you can replace with CSS)
  const styles = {
    container: { maxWidth: 520, margin: "auto", padding: 16, fontFamily: "Arial, sans-serif" },
    input: { width: "100%", padding: 8, marginTop: 6, marginBottom: 6, boxSizing: "border-box" },
    textarea: { width: "100%", minHeight: 120, padding: 8, marginTop: 6, marginBottom: 6 },
    label: { display: "block", marginTop: 8, fontWeight: 600 },
    error: { color: "#c62828", fontSize: 13, marginTop: 2 },
    btn: { padding: "10px 16px", marginTop: 12, cursor: "pointer" },
    success: { background: "#e6ffed", border: "1px solid #1b9b49", padding: 10, marginTop: 12 },
    small: { fontSize: 12, color: "#666" },
  };

  return (
    <div style={styles.container}>
      <h2>Contact Me</h2>

      {submitted && <div style={styles.success}>Message sent successfully ✅</div>}

      <form onSubmit={handleSubmit} noValidate>
        <label style={styles.label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          style={styles.input}
          placeholder="Your name"
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <div style={styles.error}>{errors.name}</div>}

        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={styles.input}
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <label style={styles.label} htmlFor="message">
          Message <span style={styles.small}>({form.message.length}/500)</span>
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={500}
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          style={styles.textarea}
          placeholder="Write your message..."
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message && <div style={styles.error}>{errors.message}</div>}

        <button
          type="submit"
          style={{ ...styles.btn, background: isDisabled ? "#ccc" : "#1976d2", color: "#fff", border: "none" }}
          disabled={isDisabled}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}