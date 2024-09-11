import { createContext } from "react";
import type { EventSub } from "../../utils/event-sub/EventSub";

interface Value {
  subscribe: typeof EventSub.instance.subscribe;
}

export const EventSubContext = createContext<Value | null>(null);
