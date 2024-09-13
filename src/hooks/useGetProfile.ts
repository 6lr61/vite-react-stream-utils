import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import { getUser } from "../utils/api/getUser";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile(login: string) {
  const { authState } = useContext(AuthContext);

  return useQuery({
    enabled: !!authState,
    queryKey: ["userProfilePicture", login],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => getUser(authState!.token.value, authState!.client.id, login),
  });
}
