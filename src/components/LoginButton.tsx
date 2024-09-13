import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";

export default function LoginButton(): React.ReactElement {
  const { authState, login, signOut } = useContext(AuthContext);

  if (authState) {
    return (
      <button type="button" onClick={signOut}>
        Sign out
      </button>
    );
  } else {
    return (
      <button type="button" onClick={login}>
        Login
      </button>
    );
  }
}
