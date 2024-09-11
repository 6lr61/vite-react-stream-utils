import { useContext, useEffect, useState } from "react";
import { TwitchBadgeConext, type TwitchBadges } from "./TwitchBadgeContext";
import { AuthStateContext } from "../auth-state/AuthStateContext";
import { getBadges } from "../../utils/api/getBadges";

interface Props {
  children: React.ReactNode;
}

export default function TwitchBadgeProvider({
  children,
}: Props): React.ReactElement {
  const [badges, setBadges] = useState<TwitchBadges | null>(null);
  const authStateContext = useContext(AuthStateContext);

  useEffect(() => {
    if (!authStateContext?.authState) {
      return;
    }

    let keep = true;

    getBadges(
      authStateContext.authState.token.value,
      authStateContext.authState.client.id,
      authStateContext.authState.user.id
    )
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
  }, [authStateContext]);

  return (
    <TwitchBadgeConext.Provider value={badges}>
      {children}
    </TwitchBadgeConext.Provider>
  );
}
