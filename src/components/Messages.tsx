import { useEffect, useRef } from "react";
import { useTwitchChat } from "../hooks/useTwitchChat";
import { useBadges } from "../hooks/useBadges";
import Message from "./Message";

export default function Messages(): React.ReactElement {
  const messages = useTwitchChat();
  const ref = useRef<HTMLDivElement>(null);
  const twitchBadges = useBadges();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scroll(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <section ref={ref} className="h-[600px] justify-end overflow-y-auto">
      <article className="flex flex-col gap-1">
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
