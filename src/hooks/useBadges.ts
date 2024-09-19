import { skipToken, useQuery } from "@tanstack/react-query";
import { getBadges, type Badge, type BadgeSet } from "../utils/api/getBadges";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";

type BadgeKey = `${BadgeSet["set_id"]}/${Badge["id"]}`;
type BadgeValue = Omit<Badge, "id">;
export type TwitchBadges = Map<BadgeKey, BadgeValue>;

function makeBadgeMap(data: BadgeSet[]): TwitchBadges {
  return new Map(
    data.flatMap(({ set_id, versions }) =>
      versions.map(({ id, ...rest }) => [`${set_id}/${id}`, rest] as const)
    )
  );
}

export function useBadges(userId?: string) {
  const { authState } = useContext(AuthContext);

  const { data } = useQuery({
    enabled: Boolean(authState),
    queryKey: ["twitchBadges", userId],
    queryFn: authState
      ? () => getBadges(authState, userId ?? authState.user.id)
      : skipToken,
    select: makeBadgeMap,
  });

  return data;
}
