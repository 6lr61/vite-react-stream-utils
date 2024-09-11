import type { ChatEventCommon } from "./_common";
import type { EventSubTransport } from "../transport";

export interface ChatClearUserMessagePayload {
  subscription: {
    id: string;
    type: "channel.chat.clear_user_messages";
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
  event: ChatClearUserMessageEvent;
}

export interface ChatClearUserMessageEvent extends ChatEventCommon {
  target_user_id: string;
  target_user_name: string;
  target_user_login: string;
}
