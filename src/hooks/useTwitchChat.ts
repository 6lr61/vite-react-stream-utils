import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import type {
  ChatMessageEvent,
  EmoteFragment,
  TextFragment,
} from "../utils/event-sub/events/chat/message";
import { EventSubContext } from "../contexts/event-sub/EventSubContext";
import type { ChatEventCommon } from "../utils/event-sub/events/chat/_common";
import type { ChatClearUserMessageEvent } from "../utils/event-sub/events/chat/clearUser";
import type { ChatMessageDeleteEvent } from "../utils/event-sub/events/chat/messageDelete";
import { useBttvEmotes, type BetterTTVEmoteFragment } from "./useBttvEmotes";
import {
  useSevenTvEmotes,
  type SevenTVEmoteFragment,
} from "./useSevenTvEmotes";
import {
  findThirdPartyEmotes,
  type Fragment,
} from "../utils/findThirdPartyEmotes";

type ChatEvent =
  | ChatMessage
  | ({ type: "channel.chat.clear"; timestamp: Date } & ChatEventCommon)
  | ({
      type: "channel.chat.clear_user_messages";
      timestamp: Date;
    } & ChatClearUserMessageEvent)
  | ({
      type: "channel.chat.message_delete";
      timestamp: Date;
    } & ChatMessageDeleteEvent);

export type ChatMessage = {
  type: "channel.chat.message";
  timestamp: Date;
} & ChatMessageEvent;

const subscriptions = [
  "channel.chat.clear",
  "channel.chat.clear_user_messages",
  "channel.chat.message",
  "channel.chat.message_delete",
];

export type Emote =
  | EmoteFragment
  | BetterTTVEmoteFragment
  | SevenTVEmoteFragment;
export type Processed = Fragment & {
  modifiers?: string[];
  overlapping?: SevenTVEmoteFragment[];
};
export type ProcessedEmote = (BetterTTVEmoteFragment | SevenTVEmoteFragment) & {
  modifiers?: string[];
  overlapping?: SevenTVEmoteFragment[];
};

const modifierClassNames: Record<string, string> = {
  "h!": "flipx",
  "v!": "flipy",
  "w!": "wide",
  "r!": "rotate",
  "l!": "rotateLeft",
  "z!": "zeroSpace",
  "c!": "cursed",
  "s!": "shake",
  "p!": "party",
};

function applyModifiers(fragments: Processed[]): Processed[] {
  const copies = structuredClone(fragments);
  const modifiers: BetterTTVEmoteFragment[] = [];
  const whitespaces: TextFragment[] = [];
  const result: Set<Processed> = new Set<Processed>(copies);
  let previousEmote: Processed | null = null;
  let previousModifier: BetterTTVEmoteFragment | null = null;

  for (const fragment of copies) {
    if (
      (previousModifier || previousEmote) &&
      fragment.type === "text" &&
      fragment.text.trim().length === 0
    ) {
      whitespaces.push(fragment);
      continue;
    }

    if (
      fragment.type !== "emote" &&
      fragment.type !== "bttv-emote" &&
      fragment.type !== "7tv-emote"
    ) {
      modifiers.length = 0;
      whitespaces.length = 0;
      previousEmote = null;
      previousModifier = null;
      continue;
    }

    if (fragment.type === "bttv-emote" && fragment.modifier) {
      modifiers.push(fragment);
      previousEmote = null;
      previousModifier = fragment;
      continue;
    }

    if (fragment.type === "7tv-emote" && fragment.zeroWidth && previousEmote) {
      if (!previousEmote.overlapping) {
        previousEmote.overlapping = [];
      }

      previousEmote.overlapping.push(fragment);
      result.delete(fragment);
      whitespaces.forEach((whitespace) => result.delete(whitespace));
      whitespaces.length = 0;

      continue;
    }

    fragment.modifiers = modifiers.map(
      (fragment) => modifierClassNames[fragment.text] // FIXME: Might be undefined
    );

    {
      modifiers.forEach((modifier) => result.delete(modifier));
      modifiers.length = 0;
    }

    {
      whitespaces.forEach((whitespace) => result.delete(whitespace));
      whitespaces.length = 0;
    }
    previousEmote = fragment;
  }

  return Array.from(result);
}

export function useTwitchChat(bufferSize = 50, channelId?: string) {
  const { authState } = useContext(AuthContext);
  const eventSubContext = useContext(EventSubContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bttvEmotes = useBttvEmotes(authState?.user.id);
  const sevenTvEmotes = useSevenTvEmotes(authState?.user.id);
  const emotes = useMemo(
    () => ({ ...bttvEmotes, ...sevenTvEmotes }),
    [bttvEmotes, sevenTvEmotes]
  );
  const parseFragments = useCallback(
    (fragments: Processed[]) => findThirdPartyEmotes(fragments, emotes),
    [emotes]
  );

  const { subscribe } = eventSubContext;

  const handleMessage = useCallback(
    (event: Record<string, unknown>) => {
      const messageEvent = event as unknown as ChatEvent; // FIXME!

      switch (messageEvent.type) {
        case "channel.chat.clear":
          setMessages(() => []);
          break;
        case "channel.chat.clear_user_messages":
          setMessages((messages) =>
            messages.filter(
              (message) =>
                message.chatter_user_id !== messageEvent.target_user_id
            )
          );
          break;
        case "channel.chat.message_delete":
          setMessages((messages) =>
            messages.filter(
              (message) => message.message_id !== messageEvent.message_id
            )
          );
          break;
        case "channel.chat.message":
          setMessages((messages) => [
            ...messages.slice(-bufferSize + 1),
            {
              ...messageEvent,
              message: {
                ...messageEvent.message,
                fragments: applyModifiers(
                  parseFragments(messageEvent.message.fragments)
                ),
              },
            },
          ]);
          break;
        default:
          console.error("useTwitchChat: Called with unknown event:", event);
      }
    },
    [bufferSize, parseFragments]
  );

  useEffect(() => {
    if (!authState) {
      return;
    }

    const condition = {
      broadcaster_user_id: channelId ?? authState.user.id,
      user_id: authState.user.id,
    };

    return subscribe(authState, subscriptions, condition, handleMessage);
  }, [authState, channelId, handleMessage, subscribe]);

  return messages;
}
