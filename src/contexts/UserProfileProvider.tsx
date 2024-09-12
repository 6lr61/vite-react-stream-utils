import { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "./UserProfileContext";
import { AuthStateContext } from "./auth-state/AuthStateContext";
import { getUser, type UserData } from "../utils/api/getUser";

interface UserProfileProviderProps {
  children: React.ReactNode;
  login?: string;
}

export default function UserProfileProvider({
  children,
  login,
}: UserProfileProviderProps): React.ReactElement {
  const authStateContext = useContext(AuthStateContext);
  const authState = authStateContext?.authState;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let keep = true;

    if (authState) {
      getUser(
        authState.token.value,
        authState.client.id,
        login ?? authState.user.login
      )
        .then((data) => {
          if (keep) {
            setUserData(data);
          }
        })
        .catch((error: unknown) => {
          console.error("UserProfile:", error);
        });
    }

    return () => {
      keep = false;
    };
  }, [authState, login]);

  return (
    <UserProfileContext.Provider value={userData}>
      {children}
    </UserProfileContext.Provider>
  );
}
