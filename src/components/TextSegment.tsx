import type { HTMLProps } from "react";

interface TextProps {
  text: string;
}

export default function TextSegment({
  text,
  ...props
}: TextProps & HTMLProps<HTMLSpanElement>): React.ReactElement {
  return <span {...props}>{text}</span>;
}
