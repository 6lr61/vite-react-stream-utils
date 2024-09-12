import type { ChatMessage } from "../hooks/useTwitchChat";

function hasLocalizedName(message: ChatMessage): boolean {
  return message.chatter_user_name.toLowerCase() !== message.chatter_user_login;
}

export default function UserName({
  message,
}: {
  message: ChatMessage;
}): React.ReactElement {
  return (
    <p className="flex-1 overflow-hidden text-ellipsis">
      <span className="font-bold">{message.chatter_user_name}</span>
      {hasLocalizedName(message) && (
        <span className="font-normal">({message.chatter_user_login})</span>
      )}
    </p>
  );
}
