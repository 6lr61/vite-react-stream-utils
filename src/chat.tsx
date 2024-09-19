import { StrictMode, useMemo, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./contexts/auth-state/AuthProvider.tsx";
import EventSubProvider from "./contexts/event-sub/EventSubProvider.tsx";
import Messages from "./components/Messages.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.querySelector("#root");

if (!(rootElement instanceof HTMLDivElement)) {
  throw new Error("Couldn't find the root element for the React App");
}

function Chat(): ReactElement {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Messages />
    </QueryClientProvider>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <EventSubProvider>
        <Chat />
      </EventSubProvider>
    </AuthProvider>
  </StrictMode>
);
