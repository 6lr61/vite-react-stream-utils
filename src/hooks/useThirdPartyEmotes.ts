import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import { useBttvEmotes, type BetterTTVEmoteFragment } from "./useBttvEmotes";
import {
  useSevenTvEmotes,
  type SevenTVEmoteFragment,
} from "./useSevenTvEmotes";
import type { ChatFragment } from "../utils/event-sub/events/chat/message";

export type Fragment =
  | ChatFragment
  | BetterTTVEmoteFragment
  | SevenTVEmoteFragment;

export function useThirdPartyEmotes(fragments: ChatFragment[]): Fragment[] {
  const { authState } = useContext(AuthContext);
  const bttvEmotes = useBttvEmotes(authState?.user.id);
  const sevenTvEmotes = useSevenTvEmotes(authState?.user.id);
  const emotes = { ...bttvEmotes, ...sevenTvEmotes };
  const names = Object.keys(emotes);

  return fragments.flatMap((fragment) => {
    if (fragment.type !== "text") {
      return fragment;
    }

    const found = [...fragment.text.matchAll(/[!:\w]+/g)].filter(
      ({ 0: match }) => names.includes(match)
    );

    /// Some text Kappa Kappa and such
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
