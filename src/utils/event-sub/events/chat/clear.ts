import type { ChatEventCommon } from "./_common";
import type { EventSubTransport } from "../transport";

export interface ChatClearPayload {
  subscription: {
    id: string;
    type: "channel.chat.clear";
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
  event: ChatEventCommon;
}
