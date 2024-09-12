import { useContext } from "react";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";
import { useTwitchChat } from "./hooks/useTwitchChat";
import Message from "./components/Message";
import MessageContainer from "./components/MessageContainer";

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
          <p className="bg-pink-50">
            Hello: {authContext.authState.user.login}
          </p>
          <article>
            <h2>Chat Messages:</h2>
            <MessageContainer messages={messages}>
              {messages.map((message) => (
                <Message key={message.message_id} message={message} />
              ))}
            </MessageContainer>
          </article>
        </section>
      )}
    </>
  );
}
