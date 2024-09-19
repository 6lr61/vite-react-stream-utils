import { memo, type ReactElement } from "react";
import type { ChatMessage, Processed } from "../hooks/useTwitchChat";
import ProfilePicture from "./ProfilePicture";
import BadgeList from "./BadgeList";
import Pronoun from "./Pronoun";
import UserName from "./UserName";
import ElapsedTime from "./ElapsedTime";
import Reply from "./Reply";
import TextSegment from "./TextSegment";
import Emote from "./Emote";
import MentionSegment from "./MentionSegment";
import TwitchEmote from "./TwitchEmote";
import type { TwitchBadges } from "../hooks/useBadges";

function colorToRgba(color?: string): string | undefined {
  if (!color) {
    return;
  }

  const red = Number.parseInt(color.slice(1, 3), 16).toString();
  const green = Number.parseInt(color.slice(3, 5), 16).toString();
  const blue = Number.parseInt(color.slice(5), 16).toString();

  return `rgba(${red}, ${green}, ${blue}, 0.25)`;
}

function fragmentToComponent(
  fragment: Processed,
  index: number
): React.ReactElement | undefined {
  switch (fragment.type) {
    case "text":
      return <TextSegment key={index} text={fragment.text} />;
    case "emote":
      return <TwitchEmote key={index} fragment={fragment} />;
    case "mention":
      return <MentionSegment key={index} text={fragment.text} />;
    case "7tv-emote":
    case "bttv-emote":
      return <Emote key={index} fragment={fragment} />;
    default:
      return;
  }
}

function MessageComponent({
  message,
  twitchBadges,
}: {
  message: ChatMessage;
  twitchBadges?: TwitchBadges;
}): ReactElement {
  return (
    <article className="flex flex-row gap-1">
      <ProfilePicture login={message.chatter_user_login} />
      <section className="flex-1 overflow-hidden rounded-md">
        <header
          className="flex px-2 gap-2 items-center bg-black/25"
          style={{ backgroundColor: colorToRgba(message.color) }}
        >
          <BadgeList badges={message.badges} twitchBadges={twitchBadges} />
          <UserName
            login={message.chatter_user_login}
            displayName={message.chatter_user_name}
          />
          <Pronoun login={message.chatter_user_login} />
          <ElapsedTime startingDate={message.timestamp} />
        </header>
        {message.reply && <Reply message={message.reply} />}
        <section className="h-full bg-slate-800 break-words px-2 py-1">
          {message.message.fragments
            .slice(message.reply ? 1 : 0) // Drop the first mention fragment
            .map((fragment, index) => fragmentToComponent(fragment, index))}
        </section>
      </section>
    </article>
  );
}

const Message = memo(MessageComponent);
export default Message;
