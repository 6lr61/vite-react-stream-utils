import { type BetterTTVEmoteFragment } from "../hooks/useBttvEmotes";
import { type SevenTVEmoteFragment } from "../hooks/useSevenTvEmotes";
import type { ChatFragment } from "./event-sub/events/chat/message";

export type Fragment =
  | ChatFragment
  | BetterTTVEmoteFragment
  | SevenTVEmoteFragment;
type Emotes = Record<string, BetterTTVEmoteFragment | SevenTVEmoteFragment>;

export function findThirdPartyEmotes(
  fragments: ChatFragment[],
  emotes: Emotes
): Fragment[] {
  const names = Object.keys(emotes);

  return fragments.flatMap((fragment) => {
    if (fragment.type !== "text") {
      return fragment;
    }

    const found = [...fragment.text.matchAll(/[!:\w]+/g)].filter(
      ({ 0: match }) => names.includes(match)
    );

    const subFragments: Fragment[] = [];
    let start = 0;

    for (const { 0: name, index } of found) {
      if (start < index) {
        subFragments.push({
          type: "text",
          text: fragment.text.slice(start, index),
        });
      }

      subFragments.push(emotes[name]);
      start = index + name.length;
    }

    if (start < fragment.text.length) {
      subFragments.push({
        type: "text",
        text: fragment.text.slice(start),
      });
    }

    return subFragments;
  });
}
