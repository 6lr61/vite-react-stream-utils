import type { AuthState } from "../../../contexts/auth-state/AuthStateContext";

interface SubscriptionsResponse {
  data: [
    {
      id: string;
      status: "enabled";
      type: string;
      version: string;
      condition: Record<string, unknown>;
      /** RFC3339 Date Time */
      created_at: string;
      transport: {
        method: "websocket";
        session_id: string;
      };
      connected_at: string;
      cost: number;
    }
  ];
  total: number;
  total_cost: number;
  max_total_cost: number;
}

export async function subscribe(
  authState: AuthState,
  sessionId: string,
  type: string,
  version: string,
  condition: Record<string, unknown>
): Promise<SubscriptionsResponse> {
  const response = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState.token.value}`,
        "Client-Id": authState.client.id,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        version,
        condition,
        transport: {
          method: "websocket",
          session_id: sessionId,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `subscriptions: Bad HTTP response ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  const result = (await response.json()) as SubscriptionsResponse;

  return result;
}
