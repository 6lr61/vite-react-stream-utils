import { useContext } from "react";
import { AuthContext } from "../contexts/auth-state/AuthContext";

interface MentionProps {
  text: string;
}

export default function MentionSegment({
  text,
}: MentionProps): React.ReactElement {
  const mentioned = text.replace("@", "").toLocaleLowerCase();
  const { authState } = useContext(AuthContext);

  return (
    <span
      className={
        mentioned === authState?.user.login
          ? "font-bold p-1 rounded-sm bg-slate-600"
          : "p-1 rounded-sm bg-slate-700"
      }
    >
      {text}
    </span>
  );
}
