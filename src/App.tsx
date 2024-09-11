import { useContext } from "react";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";
import "./App.css";
import { useEventSub } from "./hooks/useEventSub";

export default function App() {
  const authContext = useContext(AuthStateContext);
  const { lastMessage } = useEventSub("channel.chat.message", {
    broadcaster_user_id: authContext?.authState?.user.id,
    user_id: authContext?.authState?.user.id,
  });

  if (!authContext) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
      <p>Hello: {authContext.authState?.user.login}</p>
      <p>Last message: {JSON.stringify(lastMessage)}</p>
      <LoginButton />
    </>
  );
}
