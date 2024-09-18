import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useTwitchChat } from "../hooks/useTwitchChat";
import ProfilePicture from "./ProfilePicture";
import BadgeList from "./BadgeList";
import UserName from "./UserName";
import Pronoun from "./Pronoun";
import ElapsedTime from "./ElapsedTime";
import Reply from "./Reply";
import TextSegment from "./TextSegment";
import TwitchEmote from "./TwitchEmote";
import MentionSegment from "./MentionSegment";
import {
  findThirdPartyEmotes,
  type Fragment,
} from "../utils/findThirdPartyEmotes";
import { useBadges } from "../hooks/useBadges";
import type { ChatFragment } from "../utils/event-sub/events/chat/message";
import { useBttvEmotes } from "../hooks/useBttvEmotes";
import { useSevenTvEmotes } from "../hooks/useSevenTvEmotes";
import { AuthContext } from "../contexts/auth-state/AuthContext";

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
  fragment: Fragment,
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
    case "7tv-emote":
    case "bttv-emote":
      return (
        <img
          key={key}
          className="relative inline-block -my-2"
          {...fragment.small}
        />
      );
    default:
      return;
  }
}

export default function Messages(): React.ReactElement {
  const { authState } = useContext(AuthContext);
  const messages = useTwitchChat();
  const ref = useRef<HTMLDivElement>(null);
  const twitchBadges = useBadges();
  const bttvEmotes = useBttvEmotes(authState?.user.id);
  const sevenTvEmotes = useSevenTvEmotes(authState?.user.id);
  const emotes = useMemo(
    () => ({ ...bttvEmotes, ...sevenTvEmotes }),
    [bttvEmotes, sevenTvEmotes]
  );
  const parseFragments = useCallback(
    (fragments: ChatFragment[]) => findThirdPartyEmotes(fragments, emotes),
    [emotes]
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scroll(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <section ref={ref} className="h-[600px] justify-end overflow-y-auto">
      <article className="flex flex-col gap-1">
        {messages.map(
          ({
            chatter_user_login,
            chatter_user_name,
            color,
            badges,
            timestamp,
            reply,
            message,
          }) => (
            <article className="flex flex-row gap-1">
              <ProfilePicture login={chatter_user_login} />
              <section className="flex-1 overflow-hidden rounded-md">
                <header
                  className="flex px-2 gap-2 items-center bg-black/25"
                  style={{ backgroundColor: colorToRgba(color) }}
                >
                  <BadgeList badges={badges} twitchBadges={twitchBadges} />
                  <UserName
                    login={chatter_user_login}
                    displayName={chatter_user_name}
                  />
                  <Pronoun login={chatter_user_login} />
                  <ElapsedTime startingDate={timestamp} />
                </header>
                {reply && <Reply message={reply} />}
                <section className="h-full bg-slate-800 break-words px-2 py-1">
                  {parseFragments(message.fragments)
                    .slice(reply ? 1 : 0) // Drop the first mention fragment
                    .map((fragment, index) =>
                      fragmentToComponent(fragment, index)
                    )}
                </section>
              </section>
            </article>
          )
        )}
      </article>
    </section>
  );
}
