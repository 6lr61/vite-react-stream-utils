import type { ChatClearPayload } from "./chat/clear";
import type { ChatClearUserMessagePayload } from "./chat/clearUser";
import type { ChatMessagePayload } from "./chat/message";
import type { ChatMessageDeletePayload } from "./chat/messageDelete";

export type EventSubMessage =
  | WelcomeMessage
  | KeepaliveMessage
  | NotificationMessage;

type NotificationPayload =
  | ChatClearPayload
  | ChatClearUserMessagePayload
  | ChatMessagePayload
  | ChatMessageDeletePayload;

export interface WelcomeMessage {
  metadata: {
    message_id: string;
    message_type: "session_welcome";
    message_timestamp: string; // UTC date and time
  };
  payload: {
    session: {
      id: string;
      status: string;
      connected_at: string; // UTC date and time
      keepalive_timeout_seconds: number;
      reconnect_url: string | null;
    };
  };
}

export interface KeepaliveMessage {
  metadata: {
    message_id: string;
    message_type: "session_keepalive";
    message_timestamp: string;
  };
  payload: Record<string, never>;
}

export interface NotificationMessage {
  metadata: {
    message_id: string; // Unique message identifier
    message_type: "notification";
    message_timestamp: string; // UTC date for when message sent
    subscription_type: string; // Type of event sent in the message
    subscription_version: string; // Version number for the subscription's definition
  };
  payload: NotificationPayload;
}
