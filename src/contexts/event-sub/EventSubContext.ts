import { createContext } from "react";
import type { EventSub } from "../../utils/event-sub/EventSub";

interface Value {
  subscribe: typeof EventSub.instance.subscribe;
}

export const EventSubContext = createContext<Value>(
  new Proxy({} as Value, {
    get() {
      throw new Error("EventSubContext must be provided");
    },
  })
);
