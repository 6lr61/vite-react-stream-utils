import { useContext, useMemo } from "react";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";
import Chat from "./components/Chat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const authContext = useContext(AuthStateContext);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      }),
    []
  );

  if (!authContext) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoginButton />
        {authContext.authState && (
          <section>
            <p className="bg-pink-50">
              Hello: {authContext.authState.user.login}
            </p>
            <article>
              <h2>Chat Messages:</h2>
              <Chat />
            </article>
          </section>
        )}
      </QueryClientProvider>
    </>
  );
}
