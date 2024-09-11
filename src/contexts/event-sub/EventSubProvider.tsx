import { EventSub } from "../../utils/event-sub/EventSub";
import { EventSubContext } from "./EventSubContext";

interface Props {
  children: React.ReactNode;
}

export default function EventSubProvider({
  children,
}: Props): React.ReactElement {
  const subscribe = EventSub.instance.subscribe.bind(EventSub.instance);

  return (
    <EventSubContext.Provider value={{ subscribe }}>
      {children}
    </EventSubContext.Provider>
  );
}
