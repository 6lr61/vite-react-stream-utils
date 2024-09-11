import type { EmoteFragment } from "../utils/event-sub/events/chat/message";

interface TwitchEmoteProps {
  fragment: EmoteFragment;
  scale?: "1.0" | "2.0" | "3.0";
  format?: "default" | "static" | "animated";
  theme?: "light" | "dark";
}

export default function TwitchEmote({
  fragment,
  scale = "1.0",
  format = "default",
  theme = "dark",
}: TwitchEmoteProps): React.ReactElement {
  const emoteFormat = fragment.type.includes(format) ? format : "default";
  const url = `https://static-cdn.jtvnw.net/emoticons/v2/${fragment.emote.id}/${emoteFormat}/${theme}/${scale}`;

  // TODO: Add fixed sizes?
  return <img src={url} alt={fragment.text} />;
}
