import type { AuthState } from "../../../contexts/auth-state/AuthContext";

export async function unsubscribe(
  authState: AuthState,
  subscriptionId: string
): Promise<void> {
  const url = new URL("https://api.twitch.tv/helix/eventsub/subscriptions");
  url.searchParams.set("id", subscriptionId);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authState.token.value}`,
      "Client-Id": authState.client.id,
    },
  });

  if (!response.ok) {
    throw new Error(
      `subscriptions: Bad HTTP response ${response.status.toString()} ${
        response.statusText
      }`
    );
  }
}
