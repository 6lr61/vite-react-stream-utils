import { useContext, useEffect, useState } from "react";
import { AuthStateContext } from "../contexts/auth-state/AuthStateContext";
import { getUser, type UserData } from "../utils/api/getUser";

const usersData = new Map<string, UserData>();

export function useGetProfile(login: string) {
  const authStateContext = useContext(AuthStateContext);
  const authState = authStateContext?.authState;

  const [userProfile, setUserProfile] = useState<UserData | undefined>(() =>
    usersData.get(login)
  );

  useEffect(() => {
    if (usersData.has(login)) {
      return;
    }

    if (!authState) {
      return;
    }

    getUser(authState.token.value, authState.client.id, login)
      .then((data) => {
        usersData.set(login, data);
        setUserProfile(() => data);
      })
      .catch((error: unknown) => {
        console.error("UserProfile:", error);
      });
  }, [authState, login]);

  return userProfile;
}
