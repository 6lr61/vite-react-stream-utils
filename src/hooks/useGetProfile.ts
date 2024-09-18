import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import { getUser } from "../utils/api/getUser";
import { skipToken, useQuery } from "@tanstack/react-query";

export function useGetProfile(login: string) {
  const { authState } = useContext(AuthContext);

  return useQuery({
    enabled: Boolean(authState),
    queryKey: ["userProfilePicture", login],
    queryFn: authState
      ? () => getUser(authState.token.value, authState.client.id, login)
      : skipToken,
  });
}
