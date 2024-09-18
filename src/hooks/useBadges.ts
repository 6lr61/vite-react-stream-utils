import { useQuery } from "@tanstack/react-query";
import { getBadges, type Badge, type BadgeSet } from "../utils/api/getBadges";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";

type BadgeKey = `${BadgeSet["set_id"]}/${Badge["id"]}`;
type BadgeValue = Omit<Badge, "id">;
type TwitchBadges = Map<BadgeKey, BadgeValue>;

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
    enabled: !!authState,
    queryKey: ["twitchBadges", userId],
    // @ts-expect-error authState is not undefinend when query is exectued
    queryFn: () => getBadges(authState, userId ?? authState?.user.id),
    select: makeBadgeMap,
  });

  return data;
}
