import { useContext } from "react";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";
import "./App.css";
import { useTwitchChat } from "./hooks/useTwitchChat";
import TwitchBadgeProvider from "./contexts/badges/TwitchBadgeProvider";
import Message from "./components/Message";

export default function App() {
  const authContext = useContext(AuthStateContext);
  const messages = useTwitchChat();

  if (!authContext) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
      <LoginButton />
      {authContext.authState && (
        <section>
          <p>Hello: {authContext.authState.user.login}</p>
          <article>
            <h2>Chat Messages:</h2>
            <TwitchBadgeProvider>
              <div>
                {messages.map((message) => (
                  <Message key={message.message_id} message={message} />
                ))}
              </div>
            </TwitchBadgeProvider>
          </article>
        </section>
      )}
    </>
  );
}
