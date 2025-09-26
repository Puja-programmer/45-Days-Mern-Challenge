import React from "react";
import ContactForm from "./ContactForm";
import logo from "./logo.jpg";

function App() {
  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      {/* Logo and text side by side */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
        <img src={logo} alt="Logo" style={{ width: "120px", height: "auto" }} />
        <h1 style={{ margin: 0, fontSize: "4.5rem" }}>Contact Form</h1>
      </div>

      {/* Form below */}
      <div style={{ marginTop: "20px" }}>
        <ContactForm />
      </div>
    </div>
  );
}

export default App;

