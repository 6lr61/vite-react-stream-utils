import type { AuthState } from "../../contexts/auth-state/AuthContext";
import { subscribe } from "../api/event-sub/subscribe";
import type {
  EventSubMessage,
  KeepaliveMessage,
  NotificationMessage,
  WelcomeMessage,
} from "./events/websocket";

const EVENTSUB_WEBSOCKET_URI = "wss://eventsub.wss.twitch.tv/ws";

const versions: Record<string, string> = {
  "channel.chat.clear_user_messages": "1",
  "channel.chat.clear": "1",
  "channel.chat.message": "1",
  "channel.chat.message_delete": "1",
} as const;

type Callback = (event: Record<string, unknown>) => void;

function isMessageType<Message extends EventSubMessage>(
  message: EventSubMessage,
  messageType: Message["metadata"]["message_type"]
): message is Message {
  return message.metadata.message_type === messageType;
}

export class EventSub {
  private static _instance: EventSub | null = null;
  private ws;
  private listeners: Map<string, Set<Callback>>;
  private _sessionId?: string;
  private _awaitingResolvers: ((value: string) => void)[] = [];

  private constructor() {
    EventSub._instance = this;
    this.ws = new WebSocket(EVENTSUB_WEBSOCKET_URI);
    this.listeners = new Map<string, Set<Callback>>();

    this.ws.addEventListener("open", (event) => {
      console.debug("WebSocket: Open:", event);
    });

    this.ws.addEventListener("close", (event) => {
      console.debug("WebSocket: Close:", event);
    });

    this.ws.addEventListener("message", (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as EventSubMessage;

      this.handleMessage(message);
    });
  }

  public static get instance(): EventSub {
    if (!EventSub._instance) {
      return new EventSub();
    }

    return EventSub._instance;
  }

  set sessionId(id: string) {
    this._sessionId = id;

    if (this._awaitingResolvers.length > 0) {
      this._awaitingResolvers.forEach((resolver) => {
        resolver(id);
      });

      this._awaitingResolvers.length = 0;
    }
  }

  async getSessionId(): Promise<string> {
    if (this._sessionId) {
      return this._sessionId;
    }

    const promise = new Promise<string>((resolve) => {
      // TODO: Deal with a reject promise too
      this._awaitingResolvers.push(resolve);
    });

    return promise;
  }

  private handleMessage(message: EventSubMessage) {
    if (isMessageType<WelcomeMessage>(message, "session_welcome")) {
      console.debug("WebSocket: Welcome Message:", message);
      this.handleWelcomeMessage(message);
    } else if (isMessageType<KeepaliveMessage>(message, "session_keepalive")) {
      console.debug(
        "WebSocket: Keepalive:",
        message.metadata.message_timestamp
      );
    } else if (isMessageType<NotificationMessage>(message, "notification")) {
      console.debug("WebSocket: Notification Message:", message);
      this.handleNotificationMessage(message);
    }
  }

  private handleWelcomeMessage(message: WelcomeMessage) {
    this.sessionId = message.payload.session.id;
  }

  private handleNotificationMessage(message: NotificationMessage) {
    const messageType = message.payload.subscription.type;

    if (!this.listeners.has(messageType)) {
      // No one is listening for this event?
      console.debug(
        "WebSocket: No Listeners for:",
        messageType,
        ", message dropped."
      );
      return;
    }

    const event = {
      type: messageType,
      timestamp: new Date(message.metadata.message_timestamp),
      ...message.payload.event,
    };

    this.listeners.get(messageType)?.forEach((listener) => {
      listener(event);
    });
  }

  private async addSubscription(
    authState: AuthState,
    type: string,
    condition: Record<string, unknown>
  ): Promise<void> {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set<Callback>());

      void subscribe(
        authState,
        await this.getSessionId(),
        type,
        versions[type],
        condition
      ).catch((error: unknown) => {
        console.error(
          "addSubscription: failed to add subscription for:",
          type,
          "Got error:",
          error
        );
      });
    }
  }

  // FIXME: These unsubscribe functions doesn't unsubscribe from EventSub
  //        if they're the last listener
  subscribe(
    authState: AuthState,
    type: string | string[],
    condition: Record<string, unknown>,
    callback: Callback
  ): () => void {
    if (Array.isArray(type)) {
      type.forEach((type) => {
        void this.addSubscription(authState, type, condition);
        this.listeners.get(type)?.add(callback);
      });

      return () => {
        type.forEach((type) => this.listeners.get(type)?.delete(callback));
      };
    } else {
      void this.addSubscription(authState, type, condition);
      this.listeners.get(type)?.add(callback);

      return () => {
        this.listeners.get(type)?.delete(callback);
      };
    }
  }
}
