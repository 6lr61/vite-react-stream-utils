import { useCallback, useContext, useEffect, useState } from "react";
import { EventSubContext } from "../contexts/event-sub/EventSubContext";
import { AuthStateContext } from "../contexts/auth-state/AuthStateContext";

export function useEventSub(
  type: string | string[],
  condition: Record<string, unknown>,
  bufferSize = 50
) {
  const authStateContext = useContext(AuthStateContext);
  const eventSubContext = useContext(EventSubContext);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [lastMessage, setLastMessage] = useState<Record<string, unknown>>();

  if (!authStateContext) {
    throw new Error("useEventSub: Needs an AuthStateContext Provider!");
  }

  if (!eventSubContext) {
    throw new Error("useEventSub: Needs a EventSubContext Provider!");
  }

  const { subscribe } = eventSubContext;

  const handleMessage = useCallback(
    (message: Record<string, unknown>) => {
      setMessages((messages) => [...messages.slice(-bufferSize + 1), message]);
      setLastMessage(() => message);
    },
    [bufferSize]
  );

  useEffect(() => {
    const { authState } = authStateContext;

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
  }, [authStateContext, condition, handleMessage, subscribe, type]);

  return { lastMessage, messages };
}
