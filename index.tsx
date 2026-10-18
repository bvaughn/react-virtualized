import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/styles.css";
import App from "./src/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
