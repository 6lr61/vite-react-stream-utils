import { useContext } from "react";
import "./App.css";
import { AuthStateContext } from "./contexts/auth-state/AuthStateContext";
import LoginButton from "./components/LoginButton";

export default function App() {
  const context = useContext(AuthStateContext);

  if (!context) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
      <p>Hello: {context.authState?.user.login}</p>
      <LoginButton />
    </>
  );
}
