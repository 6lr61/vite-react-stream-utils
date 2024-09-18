import type { EmoteSet, SevenTvEmoteModel } from "../../stores/emotes/seventv";

export async function getEmoteSet(
  emoteSetId = "global"
): Promise<SevenTvEmoteModel[] | undefined> {
  const response = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetId}`);

  if (!response.ok) {
    throw new Error(
      `7TV: Bad response: ${response.status.toString()}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as EmoteSet;
  console.debug("7TV: Got Emote set Response:", data);

  const emotes = data.emotes;

  if (!emotes || emotes.length === 0) {
    console.error("7TV: Emote set is empty?");
    return [];
  }

  return emotes;
}
