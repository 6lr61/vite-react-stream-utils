const VALIDATE_URL = "https://id.twitch.tv/oauth2/validate";

interface ValidTokenResponse {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  /** Expires in n seconds */
  expires_in: number;
}

interface InvalidTokenResponse {
  status: number;
  message: string;
}

export async function validateToken(
  token: string,
  controller?: AbortController
): Promise<ValidTokenResponse> {
  const response = await fetch(VALIDATE_URL, {
    headers: {
      Authorization: `OAuth ${token}`,
    },
    signal: controller?.signal,
  });

  if (!response.ok) {
    const result = (await response.json()) as InvalidTokenResponse;

    throw new Error(
      `validateToken: Bad HTTP response ${result.status.toString()} ${
        result.message
      }`
    );
  }

  return (await response.json()) as ValidTokenResponse;
}
