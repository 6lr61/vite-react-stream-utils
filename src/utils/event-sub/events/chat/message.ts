import type { ChatEventCommon } from "./_common";
import type { EventSubTransport } from "../transport";

export interface ChatMessagePayload {
  subscription: {
    id: string;
    type: "channel.chat.message";
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
  event: ChatMessageEvent;
}

export interface ChatMessageEvent extends ChatEventCommon {
  chatter_user_id: string;
  chatter_user_name: string;
  chatter_user_login: string;
  /** Message UUID */
  message_id: string;
  message: {
    /** Chat message in plain text */
    text: string;
    fragments: ChatFragment[];
  };
  message_type:
    | "text"
    | "channel_points_highlighted"
    | "channel_points_sub_only"
    | "user_intro"
    | "power_ups_message_effect"
    | "power_ups_gigantified_emote";
  badges: {
    set_id: string;
    id: string;
    /** Months subscribed */
    info: string;
  }[];
  cheer?: {
    bits: number;
  };
  color: string;
  reply?: {
    parent_message_id: string;
    parent_message_body: string;
    parent_user_id: string;
    parent_user_name: string;
    parent_user_login: string;
    thread_message_id: string;
    thread_user_id: string;
    thread_user_name: string;
    thread_user_login: string;
  };
  channel_points_custom_reward_id?: string;
  channel_points_animation_id?: string;
}

export type ChatFragment =
  | TextFragment
  | CheermoteFragment
  | EmoteFragment
  | MentionFragment;

export interface TextFragment {
  type: "text";
  text: string;
}

export interface CheermoteFragment {
  type: "cheermote";
  /** `${prefix}${bits}` */
  text: string;
  cheermote: {
    prefix: string;
    bits: number;
    tier: number;
  };
}

export interface EmoteFragment {
  type: "emote";
  text: string;
  emote: {
    id: string;
    emote_set_id: string;
    owner_id: string;
    format: ["static"] | ["static", "animated"]; // Tuples might be bad idea?
  };
}

export interface MentionFragment {
  type: "mention";
  text: string;
  mention: {
    user_id: string;
    user_name: string;
    user_login: string;
  };
}
