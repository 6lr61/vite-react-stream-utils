import { useContext, type ReactElement } from "react";
import { useBttvEmotes } from "../hooks/useBttvEmotes";
import { AuthContext } from "../contexts/auth-state/AuthContext";
import { useSevenTvEmotes } from "../hooks/useSevenTvEmotes";

export default function Emotes(): ReactElement {
  const { authState } = useContext(AuthContext);
  const bttvEmotes = useBttvEmotes(authState?.user.id);
  const sevenTvEmotes = useSevenTvEmotes(authState?.user.id);

  return (
    <article>
      <h2>BetterTTV</h2>
      <ul className="flex flex-row flex-wrap gap-1">
        {Object.entries(bttvEmotes).map(([name, emote]) => (
          <li key={name}>
            <img alt={name} {...emote.small} />
          </li>
        ))}
      </ul>
      <h2>SevenTV</h2>
      <ul className="flex flex-row flex-wrap gap-1">
        {Object.entries(sevenTvEmotes).map(([name, emote]) => (
          <li key={name}>
            <img alt={name} {...emote.small} />
          </li>
        ))}
      </ul>
    </article>
  );
}
