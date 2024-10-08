import { skipToken, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface BetterTTVEmote {
  id: string;
  code: string;
  imageType: string;
  animated: boolean;
  /** Used for global emotes */
  userId?: string;
  modifier?: boolean;
  /** Used for shared and channel emotes */
  user?: {
    id: string;
    name: string;
    displayName: string;
    providerId: string;
  };
  /** Omitted if the emote is 28x28 */
  width?: number;
  height?: number;
}

export interface BetterTTVEmoteFragment {
  type: "bttv-emote";
  text: string;
  animated: boolean;
  global: boolean;
  modifier: boolean;
  owner?: {
    login: string;
    name: string;
  };
  small: {
    src: string;
    height: number;
    width: number;
  };
  big: {
    src: string;
    height: number;
    width: number;
  };
}

function makeBttvFragments(
  emotes: BetterTTVEmote[],
  global?: boolean
): Record<string, BetterTTVEmoteFragment> {
  const entries = emotes.map(
    (emote) =>
      [
        emote.code,
        {
          type: "bttv-emote",
          text: emote.code,
          animated: emote.animated,
          global: global ?? false,
          modifier: emote.modifier ?? false,
          owner: emote.user && {
            login: emote.user.name,
            name: emote.user.displayName,
          },
          small: {
            src: `https://cdn.betterttv.net/emote/${emote.id}/1x.webp`,
            height: emote.height ?? 28,
            width: emote.width ?? 28,
          },
          big: {
            src: `https://cdn.betterttv.net/emote/${emote.id}/3x.webp`,
            height: 3 * (emote.height ?? 28),
            width: 3 * (emote.width ?? 28),
          },
        },
      ] as const
  );

  return Object.fromEntries(entries);
}

const makeGlobalFragments = (emotes: BetterTTVEmote[]) =>
  makeBttvFragments(emotes, true);

const makeChannelFragments = (emotes: BetterTTVEmote[]) =>
  makeBttvFragments(emotes, false);

// TODO: Add some kind of runtime type checking here
export function useBttvEmotes(userId?: string) {
  const { data: global } = useQuery({
    queryKey: ["bttvGlobalEmotes"],
    queryFn: () =>
      fetch("https://api.betterttv.net/3/cached/emotes/global").then(
        (response) => response.json()
      ),
    select: makeGlobalFragments,
  });

  const { data: channel } = useQuery({
    enabled: Boolean(userId),
    queryKey: ["bttvChannelEmotes", userId],
    queryFn: userId
      ? () =>
          fetch(`https://api.betterttv.net/3/cached/users/twitch/${userId}`)
            .then((response) => response.json())
            .then(
              ({
                channelEmotes,
                sharedEmotes,
              }: {
                channelEmotes: BetterTTVEmote[];
                sharedEmotes: BetterTTVEmote[];
              }) => [...channelEmotes, ...sharedEmotes]
            )
      : skipToken,
    select: makeChannelFragments,
  });

  return useMemo(() => ({ ...global, ...channel }), [global, channel]);
}
