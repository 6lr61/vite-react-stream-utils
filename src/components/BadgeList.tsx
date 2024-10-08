import type { useBadges } from "../hooks/useBadges";

interface Props {
  // FIXME: Derive this from a single point of truth
  badges: {
    set_id: string;
    id: string;
    /** Months subscribed */
    info: string;
  }[];
  twitchBadges: ReturnType<typeof useBadges>;
}

function makeKey(setId: string, id: string): `${string}/${string}` {
  return `${setId}/${id}`;
}

export default function BadgeList({
  badges,
  twitchBadges,
}: Props): React.ReactElement | undefined {
  if (badges.length === 0) {
    return;
  }

  return (
    <div className="flex flex-row gap-1">
      {badges.map(({ set_id, id }) => (
        <img
          key={makeKey(set_id, id)}
          src={twitchBadges?.get(makeKey(set_id, id))?.image_url_1x}
        />
      ))}
    </div>
  );
}
