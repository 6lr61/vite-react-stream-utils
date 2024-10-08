import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./contexts/auth-state/AuthProvider.tsx";
import EventSubProvider from "./contexts/event-sub/EventSubProvider.tsx";

const rootElement = document.querySelector("#root");

if (!(rootElement instanceof HTMLDivElement)) {
  throw new Error("Couldn't find the root element for the React App");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <EventSubProvider>
        <App />
      </EventSubProvider>
    </AuthProvider>
  </StrictMode>
);
