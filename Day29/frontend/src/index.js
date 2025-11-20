import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Optional: Global Error Boundary (prevents React crashes)
function GlobalErrorFallback() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "red" }}>
      <h2>⚠ Something went wrong.</h2>
      <p>Please refresh the page or try again later.</p>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("🔥 Global UI Error:", error, info);
  }
  render() {
    if (this.state.hasError) return <GlobalErrorFallback />;
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
