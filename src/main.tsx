import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthStateProvider from "./contexts/AuthStateProvider.tsx";

const rootElement = document.querySelector("#root");

if (!(rootElement instanceof HTMLDivElement)) {
  throw new Error("Couldn't find the root element for the React App");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthStateProvider>
      <App />
    </AuthStateProvider>
  </StrictMode>
);
