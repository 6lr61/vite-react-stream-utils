import { useContext } from "react";
import { AuthStateContext } from "../contexts/auth-state/AuthStateContext";

export default function LoginButton(): React.ReactElement {
  const context = useContext(AuthStateContext);

  if (!context) {
    throw new Error("LoginButton: Missing AuthStateContext");
  }

  if (context.authState) {
    return (
      <button type="button" onClick={context.signOut}>
        Sign out
      </button>
    );
  } else {
    return (
      <button type="button" onClick={context.login}>
        Login
      </button>
    );
  }
}
