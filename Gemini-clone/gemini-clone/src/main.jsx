import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Remove or comment out the ContextProvider import

createRoot(document.getElementById("root")).render(
  // Remove the ContextProvider wrapper
  <App />
);
