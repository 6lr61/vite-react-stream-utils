import type { ReactElement } from "react";
import { twMerge } from "tailwind-merge";
import type { ProcessedEmote } from "../hooks/useTwitchChat";

export default function Emote({
  fragment,
}: {
  fragment: ProcessedEmote;
}): ReactElement {
  return (
    <figure className="inline-block">
      <img
        className={twMerge(
          "emote relative inline-block *:-my-2",
          fragment.modifiers?.join(" ")
        )}
        {...fragment.small}
      />
      {fragment.overlapping?.map((emote, index) => (
        <img
          key={index}
          className="emote inline-block relative -ml-8"
          {...emote.small}
        />
      ))}
    </figure>
  );
}
