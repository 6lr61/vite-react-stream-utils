import type { ChatEventCommon } from "./_common";
import type { EventSubTransport } from "../transport";

export interface ChatMessageDeletePayload {
  subscription: {
    id: string;
    type: "channel.chat.message_delete";
    version: "1";
    status: "enabled";
    cost: number;
    condition: {
      broadcaster_user_id: string;
      user_id: string;
    };
    transport: EventSubTransport;
    created_at: string;
  };
  event: ChatMessageDeleteEvent;
}

export interface ChatMessageDeleteEvent extends ChatEventCommon {
  target_user_id: string;
  target_user_name: string;
  target_user_login: string;
  message_id: string;
}
