import type { AuthState } from "../../contexts/auth-state/AuthContext";

const CHANNEL_BADGES_URL = "https://api.twitch.tv/helix/chat/badges";
const GLOBAL_BADGES_URL = "https://api.twitch.tv/helix/chat/badges/global";

interface ValidBadgeResponse {
  data: BadgeSet[];
}

export interface BadgeSet {
  set_id: string;
  versions: Badge[];
}

export interface Badge {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  title: string;
  description: string;
  click_action?: string;
  click_url?: string;
}

async function getBadgeSet(
  accessToken: string,
  clientId: string,
  url: string | URL
): Promise<ValidBadgeResponse> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  });

  if (!response.ok) {
    throw new Error(
      `getBadges: Bad HTTP response: ${response.status.toString()} ${
        response.statusText
      }`
    );
  }

  return (await response.json()) as ValidBadgeResponse;
}

export async function getBadges(
  authState: AuthState,
  userId: string
): Promise<BadgeSet[]> {
  const url = new URL(CHANNEL_BADGES_URL);
  url.searchParams.set("broadcaster_id", userId);

  const [channelBadges, globalBadges] = await Promise.all([
    await getBadgeSet(authState.token.value, authState.client.id, url),
    await getBadgeSet(
      authState.token.value,
      authState.client.id,
      GLOBAL_BADGES_URL
    ),
  ]);

  return [...globalBadges.data, ...channelBadges.data];
}
