import { useContext, useMemo } from "react";
import { AuthContext } from "./contexts/auth-state/AuthContext";
import LoginButton from "./components/LoginButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function openChat() {
  window.open(
    "http://localhost:5173/chat/index.html",
    undefined,
    "popup=yes,innerWidth=480,innerHeight=784"
  );
}

export default function App() {
  const { authState } = useContext(AuthContext);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      }),
    []
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoginButton />
        {authState && (
          <section>
            <p className="bg-pink-50">Hello: {authState.user.login}</p>
            <button onClick={openChat}>Open Chat</button>
          </section>
        )}
      </QueryClientProvider>
    </>
  );
}
