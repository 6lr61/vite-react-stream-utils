import { useContext } from "react";
import { TwitchBadgeConext } from "../contexts/badges/TwitchBadgeContext";

interface Props {
  // FIXME: Derive this from a single point of truth
  badges: {
    set_id: string;
    id: string;
    /** Months subscribed */
    info: string;
  }[];
}

function makeKey(setId: string, id: string): `${string}/${string}` {
  return `${setId}/${id}`;
}

export default function BadgeList({
  badges,
}: Props): React.ReactElement | undefined {
  const twitchBadges = useContext(TwitchBadgeConext);

  if (!twitchBadges || badges.length === 0) {
    return;
  }

  return (
    <div className="flex flex-row gap-1">
      {badges.map(({ set_id, id }) => (
        <img
          key={makeKey(set_id, id)}
          src={twitchBadges.get(makeKey(set_id, id))?.image_url_1x}
        />
      ))}
    </div>
  );
}
