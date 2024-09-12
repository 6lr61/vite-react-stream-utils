import type { ChatMessage } from "../hooks/useTwitchChat";

type MessageReply = Required<ChatMessage>["reply"];

function hasLocalizedName(message: MessageReply) {
  return message.parent_user_name.toLowerCase() !== message.parent_user_login;
}

export default function Reply({
  message,
}: {
  message: MessageReply;
}): React.ReactElement {
  return (
    <article className="bg-black/25 text-sm px-2 py-1">
      <header className="font-bold">
        ↳ Replying to: @{message.parent_user_login}
        {hasLocalizedName(message) && `(${message.parent_user_login})`}
      </header>
      <section className="italic">{message.parent_message_body}</section>
    </article>
  );
}
