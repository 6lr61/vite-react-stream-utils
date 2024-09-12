import { useEffect, useRef } from "react";
import type { ChatMessage } from "../hooks/useTwitchChat";
import TwitchBadgeProvider from "../contexts/badges/TwitchBadgeProvider";

export default function MessageContainer({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: ChatMessage[];
}): React.ReactElement {
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
        <article className="flex flex-col gap-1">{children}</article>
      </TwitchBadgeProvider>
    </section>
  );
}