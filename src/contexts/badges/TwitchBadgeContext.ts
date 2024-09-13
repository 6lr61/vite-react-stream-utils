import { createContext } from "react";
import type { Badge, BadgeSet } from "../../utils/api/getBadges";

export type BadgeKey = `${BadgeSet["set_id"]}/${Badge["id"]}`;
export type BadgeValue = Omit<Badge, "id">;
export type TwitchBadges = Map<BadgeKey, BadgeValue>;

export const TwitchBadgeConext = createContext<TwitchBadges>(
  new Map<BadgeKey, BadgeValue>()
);
