import { useContext, useMemo } from "react";
import { AuthContext } from "./contexts/auth-state/AuthContext";
import LoginButton from "./components/LoginButton";
import Messages from "./components/Messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
            <article>
              <h2>Chat Messages:</h2>
              <Messages />
            </article>
          </section>
        )}
      </QueryClientProvider>
    </>
  );
}
