import { useCallback, useContext, useEffect, useState } from "react";
import { EventSubContext } from "../contexts/event-sub/EventSubContext";
import { AuthContext } from "../contexts/auth-state/AuthContext";

export function useEventSub(
  type: string | string[],
  condition: Record<string, unknown>,
  bufferSize = 50
) {
  const { authState } = useContext(AuthContext);
  const eventSubContext = useContext(EventSubContext);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [lastMessage, setLastMessage] = useState<Record<string, unknown>>();

  const { subscribe } = eventSubContext;

  const handleMessage = useCallback(
    (message: Record<string, unknown>) => {
      setMessages((messages) => [...messages.slice(-bufferSize + 1), message]);
      setLastMessage(() => message);
    },
    [bufferSize]
  );

  useEffect(() => {
    if (!authState) {
      return;
    }

    if (Object.values(condition).some((value) => value === undefined)) {
      console.error(
        "useEventSub: Was given a bad subscription condition:",
        condition
      );
      return;
    }

    return subscribe(authState, type, condition, handleMessage);
  }, [authState, condition, handleMessage, subscribe, type]);

  return { lastMessage, messages };
}
