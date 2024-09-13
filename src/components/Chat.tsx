import { useEffect, useRef } from "react";
import TwitchBadgeProvider from "../contexts/badges/TwitchBadgeProvider";
import { useTwitchChat } from "../hooks/useTwitchChat";
import Message from "./Message";

export default function Chat(): React.ReactElement {
  const messages = useTwitchChat();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scroll(0, ref.current.scrollHeight);
  }, [messages]);

  return (
    <section ref={ref} className="h-[600px] justify-end overflow-y-auto">
      <TwitchBadgeProvider>
        <article className="flex flex-col gap-1">
          {messages.map((message) => (
            <Message key={message.message_id} message={message} />
          ))}
        </article>
      </TwitchBadgeProvider>
    </section>
  );
}
