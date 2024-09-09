const REVOKE_URL = "https://id.twitch.tv/oauth2/revoke";

interface InvalidResponse {
  status: number;
  message: string;
}

export async function revokeToken(token: string): Promise<void> {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_CLIENT_ID,
    token,
  });

  const response = await fetch(REVOKE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const result = (await response.json()) as InvalidResponse;
    throw new Error(
      `revokeToken: Bad HTTP response ${result.status.toString()} ${
        result.message
      }`
    );
  }
}
