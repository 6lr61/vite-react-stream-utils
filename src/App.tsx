import { useContext } from "react";
import "./App.css";
import { AuthStateContext } from "./contexts/AuthStateContext";

export default function App() {
  const context = useContext(AuthStateContext);

  if (!context) {
    return <p>Missing AuthStateContext provider?</p>;
  }

  return (
    <>
      <p>Hello: {context.authState?.user.login}</p>
      <p>Error: {context.authError?.description}</p>
      <button type="button" onClick={context.login}>
        Hello
      </button>
      <button type="button" onClick={context.signOut}>
        Goodbye
      </button>
    </>
  );
}
