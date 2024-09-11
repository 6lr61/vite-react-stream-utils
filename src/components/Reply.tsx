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
    <article className="reply">
      <header>
        ↳ Replying to: @{message.parent_user_login} (
        {hasLocalizedName(message) && message.parent_user_login})
      </header>
      <section className="body">{message.parent_message_body}</section>
    </article>
  );
}
