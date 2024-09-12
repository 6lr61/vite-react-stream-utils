import { useContext } from "react";
import { AuthStateContext } from "../contexts/auth-state/AuthStateContext";

interface MentionProps {
  text: string;
}

export default function MentionSegment({
  text,
}: MentionProps): React.ReactElement {
  const mentioned = text.replace("@", "").toLocaleLowerCase();
  const authStateContext = useContext(AuthStateContext);

  return (
    <span
      className={
        mentioned === authStateContext?.authState?.user.login
          ? "font-bold p-1 rounded-sm bg-slate-600"
          : "p-1 rounded-sm bg-slate-700"
      }
    >
      {text}
    </span>
  );
}
