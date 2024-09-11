const GET_USERS_URL = "https://api.twitch.tv/helix/users";

interface ValidGetUsersResponse {
  data: UserData[];
}

export interface UserData {
  id: string;
  login: string;
  display_name: string;
  type: "admin" | "global_mod" | "staff" | "";
  broadcaster_type: "affiliate" | "partner" | "";
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  email?: string;
  created_at: string;
}

export async function getUser(
  accessToken: string,
  clientId: string,
  loginName: string
): Promise<UserData> {
  const url = new URL(GET_USERS_URL);
  url.searchParams.set("login", loginName);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  });

  if (!response.ok) {
    throw new Error(
      `getUser: Bad HTTP response: ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  const result = (await response.json()) as ValidGetUsersResponse;

  if (result.data.length === 0) {
    throw new Error("getUser: No user data in response");
  }

  return result.data[0];
}

export async function getUsers(
  accessToken: string,
  clientId: string,
  userIds: string[]
): Promise<UserData[]> {
  const url = new URL(GET_USERS_URL);
  userIds.forEach((userId) => {
    url.searchParams.append("id", userId);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  });

  if (!response.ok) {
    throw new Error(
      `getUser: Bad HTTP response: ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  const result = (await response.json()) as ValidGetUsersResponse;

  if (result.data.length === 0) {
    throw new Error("getUser: No user data in response");
  }

  return result.data;
}
