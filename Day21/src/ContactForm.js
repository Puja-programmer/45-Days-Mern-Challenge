import './App.css'; // or './ContactForm.css'

import React, { useState } from "react";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Form Submitted!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
  };

  return (
 <div
    style={{
  minHeight: "100vh",
  display: "flex",
  alignItems: "flex-start",  // move up vertically
  justifyContent: "center",  // keep centered horizontally
  paddingTop: "50px",        // add some space from the top
  background: `linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url("bg.jpg")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}}
>



      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "30px",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.7s ease-in-out",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#2c3e50",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Contact Us
        </h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "14px",
            borderRadius: "8px",
            border: "1px solid #ba4b4bff",
            fontSize: "15px",
          }}
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "14px",
            borderRadius: "8px",
            border: "1px solid #874040ff",
            fontSize: "15px",
          }}
          required
        />

        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "14px",
            borderRadius: "8px",
            border: "1px solid #8b4747ff",
            fontSize: "15px",
            resize: "none",
          }}
          required
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(135deg, #176b8f, #52b5cc)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "linear-gradient(135deg, #6dd5ed, #2193b0)")
          }
        >
           Submit
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
