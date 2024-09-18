import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

enum EmoteSetFlag {
  None = 0,
  /** Set is immutable, meaning it cannot be modified */
  Immutable = 1,
  /** Set is privileged, meaning it can only be modified by its owner */
  Privileged = 1 << 1,
  /** Set is personal, meaning its content can be used globally and it is subject to stricter content moderation rules */
  Personal = 1 << 2,
  /** Set is commercial, meaning it is sold and subject to extra rules on content ownership */
  Commercial = 1 << 3,
}

enum ActiveEmoteFlag {
  None = 0,
  /** Emote is zero-width*/
  ZeroWidth = 1,
  /** Overrides Twitch Global emotes with the same name*/
  OverrideTwitchGlobal = 1 << 16,
  /** Overrides Twitch Subscriber emotes with the same name*/
  OverrideTwitchSubscriber = 1 << 17,
  /** Overrides BetterTTV emotes with the same name*/
  OverrideBetterTTV = 1 << 18,
}

enum EmoteFlag {
  None = 0,
  /** The emote is private and can only be accessed by its owner, editors and moderators */
  Private = 1,
  /** The emote was verified to be an original creation by the uploader */
  Authentic = 1 << 1,
  /** The emote is recommended to be enabled as Zero-Width */
  ZeroWidth = 1 << 8,
  /** Sexually Suggesive */
  ContentSexual = 1 << 16,
  /** Rapid flashing */
  ContentEpilepsy = 1 << 17,
  /** Edgy or distasteful, may be offensive to some users */
  ContentEdgy = 1 << 18,
  /** Not allowed specifically on the Twitch platform */
  ContentTwitchDisallowed = 1 << 24,
}

/*
const EmoteFlagDescriptions = {
  [EmoteFlag.Private]: "PRIVATE",
  [EmoteFlag.ZeroWidth]: "ZERO_WIDTH",
  [EmoteFlag.ContentSexual]: "SEXUALLY_SUGGESTIVE",
  [EmoteFlag.ContentEpilepsy]: "EPILEPSY",
  [EmoteFlag.ContentEdgy]: "EDGY_OR_DISASTEFUL",
  [EmoteFlag.ContentTwitchDisallowed]: "TWITCH_DISALLOWED",
} as const;
 */

enum EmoteLifecycle {
  Deleted = -1,
  Pending,
  Processing,
  Disabled,
  Live,
  Failed = -2,
}

interface SevenTvEmoteModel {
  /** Object ID */
  id: string;
  /** Emote name, eg. KEKW */
  name: string;
  flags: ActiveEmoteFlag;
  timestamp: number;
  actor_id: string | null;
  /** EmotePartialModel */
  data: EmotePartialModel; // This was nullable in the old Go version of 7tv
}

interface EmoteSet {
  /** Emote Set ID */
  id?: string;
  /** Emote Set Name */
  name: string;
  tags: string[];
  flags: EmoteSetFlag;
  /** Deprecated - Use flags */
  immutable: boolean;
  /** Deprecated - Use flags */
  privileged: boolean;
  emotes?: SevenTvEmoteModel[];
  emote_count?: number;
  capacity: number;
  owner: UserPartial | null;
}

interface EmotePartialModel {
  /** Object ID */
  id: string;
  /** Emote name, eg. KEKW */
  name: string;
  flags: EmoteFlag;
  lifecycle: EmoteLifecycle;
  /** Emote version state */
  state: ("PERSONAL" | "NO_PERSONAL" | "LISTED")[];
  listed: boolean;
  animated: boolean;
  owner: UserPartial;
  /** Image Host */
  host: {
    /** Partial url? */
    // "//cdn.7tv.app/emote/60a487509485e7cf2f5a6fa7";
    url: string;
    /** Image File */
    files: {
      name: string; // "1x.avif"
      static_name: string; // "1x_static.avif"
      width: number;
      height: number;
      frame_count?: number;
      size?: number;
      format: "AVIF" | "WEBP";
    }[];
  };
}

interface UserPartial {
  id: string;
  username: string;
  display_name: string;
  created_at?: number;
  avatar_url?: string;
  style: Record<string, unknown>;
  roles?: string[];
  connections?: Connection[];
}

interface Connection {
  id: string;
  platform: "TWITCH" | "YOUTUBE" | "DISCORD";
  username: string;
  display_name: string;
  linked_at: number;
  emote_capacity: number;
  emote_set_id: string | null;
  emote_set: EmoteSet | null;
}

interface SevenTVEmoteFragment {
  type: "7tv-emote";
  text: string;
  animated: boolean;
  global: boolean;
  owner: {
    login: string;
    name: string;
  };
  small: {
    file: string;
    height?: number;
    width?: number;
  };
  big: {
    file: string;
    height?: number;
    width?: number;
  };
}

function filterEmote(emote: SevenTvEmoteModel): boolean {
  return (
    emote.data.listed &&
    Boolean(emote.data.lifecycle & EmoteLifecycle.Live) &&
    !(
      emote.data.flags &
      (EmoteFlag.ContentEdgy |
        EmoteFlag.ContentEpilepsy |
        EmoteFlag.ContentSexual |
        EmoteFlag.ContentTwitchDisallowed)
    )
  );
}

function sizeOf(
  filename: string,
  files: SevenTvEmoteModel["data"]["host"]["files"]
): { height?: number; width?: number } {
  const file = files.find(({ name }) => name === filename);

  return { height: file?.height, width: file?.width };
}

function makeSevenTvFragments(
  rawEmotes: SevenTvEmoteModel[],
  global?: boolean
): Record<string, SevenTVEmoteFragment> {
  const emotes = rawEmotes.filter(filterEmote).map(
    (emote) =>
      [
        emote.name,
        {
          type: "7tv-emote",
          text: emote.name,
          animated: emote.data.animated,
          global: global ?? false,
          owner: {
            login: emote.data.owner.username,
            name: emote.data.owner.display_name,
          },
          small: {
            src: `https:${emote.data.host.url}/1x.webp`,
            ...sizeOf("1x.webp", emote.data.host.files),
          },
          big: {
            src: `https:${emote.data.host.url}/4x.webp`,
            ...sizeOf("4x.webp", emote.data.host.files),
          },
        },
      ] as const
  );

  return Object.fromEntries(emotes);
}

const makeGlobalFragments = (emotes: SevenTvEmoteModel[]) =>
  makeSevenTvFragments(emotes, true);

const makeChannelFragments = (emotes: SevenTvEmoteModel[]) =>
  makeSevenTvFragments(emotes, false);

export function useSevenTvEmotes(userId?: string) {
  const { data: global } = useQuery({
    queryKey: ["sevenTvGlobalEmotes"],
    queryFn: () =>
      fetch("https://7tv.io/v3/emote-sets/global")
        .then((response) => response.json())
        .then(({ emotes }: { emotes: SevenTvEmoteModel[] }) => {
          return emotes;
        }),
    select: makeGlobalFragments,
  });

  const { data: channel } = useQuery({
    enabled: !!userId,
    queryKey: ["sevenTvChannelEmotes", userId],
    queryFn: () =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      fetch(`https://7tv.io/v3/users/twitch/${userId}`)
        .then((response) => response.json())
        .then(
          ({
            emote_set: { emotes },
          }: {
            emote_set: { emotes: SevenTvEmoteModel[] };
          }) => emotes
        ),
    select: makeChannelFragments,
  });

  return useMemo(() => ({ ...global, ...channel }), [global, channel]);
}
