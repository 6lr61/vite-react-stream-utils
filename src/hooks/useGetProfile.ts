import { useContext } from "react";
import { AuthStateContext } from "../contexts/auth-state/AuthStateContext";
import { getUser } from "../utils/api/getUser";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile(login: string) {
  const authStateContext = useContext(AuthStateContext);
  const authState = authStateContext?.authState;

  return useQuery({
    enabled: !!authState,
    queryKey: ["userProfilePicture", login],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => getUser(authState!.token.value, authState!.client.id, login),
  });
}
