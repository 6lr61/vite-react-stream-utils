import type { ReactElement } from "react";
import { usePronouns } from "../hooks/usePronouns";

export default function Pronoun({
  login,
}: {
  login: string;
}): ReactElement | undefined {
  const pronoun = usePronouns(login);

  return <p className="flex-1 font-normal text-sm">{pronoun}</p>;
}
