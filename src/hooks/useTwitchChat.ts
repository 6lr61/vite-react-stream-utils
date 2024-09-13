import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import type { ChatMessageEvent } from "../utils/event-sub/events/chat/message";
import { EventSubContext } from "../contexts/event-sub/EventSubContext";
import type { ChatEventCommon } from "../utils/event-sub/events/chat/_common";
import type { ChatClearUserMessageEvent } from "../utils/event-sub/events/chat/clearUser";
import type { ChatMessageDeleteEvent } from "../utils/event-sub/events/chat/messageDelete";

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

export function useTwitchChat(bufferSize = 50, channelId?: string) {
  const { authState } = useContext(AuthContext);
  const eventSubContext = useContext(EventSubContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
            messageEvent,
          ]);
          break;
        default:
          console.error("useTwitchChat: Called with unknown event:", event);
      }
    },
    [bufferSize]
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
