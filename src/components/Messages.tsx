import { useEffect, useState } from "react";
import { useTwitchChat } from "../hooks/useTwitchChat";
import { useBadges } from "../hooks/useBadges";
import Message from "./Message";

export default function Messages(): React.ReactElement {
  const messages = useTwitchChat();
  const twitchBadges = useBadges();
  const [scroll, setScroll] = useState(true);

  useEffect(() => {
    if (scroll) {
      window.scroll(0, document.body.scrollHeight);
    }
  }, [messages, scroll]);

  return (
    <section
      onMouseEnter={() => {
        setScroll(false);
      }}
      onMouseLeave={() => {
        setScroll(true);
      }}
      className="justify-end overflow-y-auto"
    >
      <article className="flex flex-grow flex-col gap-1">
        {messages.map((message) => (
          <Message
            key={message.message_id}
            message={message}
            twitchBadges={twitchBadges}
          />
        ))}
      </article>
    </section>
  );
}
