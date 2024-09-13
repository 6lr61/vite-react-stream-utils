import { useContext, useEffect, useState } from "react";
import {
  TwitchBadgeConext,
  type BadgeKey,
  type BadgeValue,
  type TwitchBadges,
} from "./TwitchBadgeContext";
import { AuthContext } from "../auth-state/AuthContext";
import { getBadges } from "../../utils/api/getBadges";

interface Props {
  children: React.ReactNode;
}

export default function TwitchBadgeProvider({
  children,
}: Props): React.ReactElement {
  const [badges, setBadges] = useState<TwitchBadges>(
    () => new Map<BadgeKey, BadgeValue>()
  );
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    let keep = true;

    if (!authState) {
      return;
    }

    getBadges(authState.token.value, authState.client.id, authState.user.id)
      .then((sets) => {
        const tmp = sets.flatMap(({ set_id, versions }) =>
          versions.map(({ id, ...rest }) => [`${set_id}/${id}`, rest] as const)
        );

        if (keep) {
          setBadges(new Map(tmp));
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    return () => {
      keep = false;
    };
  }, [authState]);

  return (
    <TwitchBadgeConext.Provider value={badges}>
      {children}
    </TwitchBadgeConext.Provider>
  );
}
