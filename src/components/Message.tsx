import type { ChatMessage } from "../hooks/useTwitchChat";
import type { ChatFragment } from "../utils/event-sub/events/chat/message";
import BadgeList from "./BadgeList";
import ElapsedTime from "./ElapsedTime";
import MentionSegment from "./MentionSegment";
import ProfilePicture from "./ProfilePicture";
import Reply from "./Reply";
import TextSegment from "./TextSegment";
import TwitchEmote from "./TwitchEmote";
import UserName from "./UserName";
import "./Message.css";
import UserProfileProvider from "../contexts/UserProfileProvider";

interface Props {
  message: ChatMessage;
}

function colorToRgba(color?: string): string | undefined {
  if (!color) {
    return;
  }

  // #aabbcc
  const red = Number.parseInt(color.slice(1, 3), 16).toString();
  const green = Number.parseInt(color.slice(3, 5), 16).toString();
  const blue = Number.parseInt(color.slice(5), 16).toString();

  return `rgba(${red}, ${green}, ${blue}, 0.25)`;
}

function fragmentToComponent(
  fragment: ChatFragment,
  index: number
): React.ReactElement | undefined {
  const key = `fragment-${index.toString()}`;

  switch (fragment.type) {
    case "text":
      return <TextSegment key={key} text={fragment.text} />;
    case "emote":
      return <TwitchEmote key={key} fragment={fragment} />;
    case "mention":
      return <MentionSegment key={key} text={fragment.text} />;
    default:
      return;
  }
}

export default function Message({ message }: Props): React.ReactElement {
  return (
    <UserProfileProvider login={message.chatter_user_login}>
      <article className="message">
        <ProfilePicture />
        <section className="container">
          <header style={{ backgroundColor: colorToRgba(message.color) }}>
            <BadgeList badges={message.badges} />
            <UserName message={message} />
            <ElapsedTime startingDate={message.timestamp} />
          </header>
          {message.reply && <Reply message={message.reply} />}
          <section className="body">
            {message.message.fragments.map((fragment, index) =>
              fragmentToComponent(fragment, index)
            )}
          </section>
        </section>
      </article>
    </UserProfileProvider>
  );
}
