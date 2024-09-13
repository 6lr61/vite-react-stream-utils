import { useContext } from "react";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";
import Chat from "./components/Chat";

export default function App() {
  const authContext = useContext(AuthStateContext);

  if (!authContext) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
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
    </>
  );
}
