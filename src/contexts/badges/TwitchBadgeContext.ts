import { createContext } from "react";
import type { Badge, BadgeSet } from "../../utils/api/getBadges";

export type TwitchBadges = Map<
  `${BadgeSet["set_id"]}/${Badge["id"]}`,
  Omit<Badge, "id">
>;

export const TwitchBadgeConext = createContext<TwitchBadges | null>(null);
