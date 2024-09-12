import { type HTMLProps, useEffect, useState } from "react";

const UNA_MINUTA = 60_000;
const MINUTE_IN_MILLIS = 60_000;

function passedTimeMinutes(startingDate: Date): number {
  return Math.floor((Date.now() - startingDate.getTime()) / MINUTE_IN_MILLIS);
}

export default function ElapsedTime({
  startingDate,
}: {
  startingDate: Date;
} & HTMLProps<HTMLSpanElement>): React.ReactElement {
  const [minutes, setMinutes] = useState(passedTimeMinutes(startingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes(() => passedTimeMinutes(startingDate));
    }, UNA_MINUTA);

    return () => {
      clearInterval(timer);
    };
  }, [startingDate]);

  return (
    <>
      <span className="flex-shrink-0 text-sm">
        {minutes > 0 ? `⧗ ${minutes.toString()}m` : "just now!"}
      </span>
    </>
  );
}
