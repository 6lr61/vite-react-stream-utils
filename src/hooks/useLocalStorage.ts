import { useEffect, useState } from "react";

export function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | undefined>(() => {
    return window.localStorage.getItem(key) ?? undefined;
  });

  useEffect(() => {
    if (value !== undefined) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }

    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, [key, value]);

  useEffect(() => {
    const handleEvent = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(window.localStorage.getItem(key) ?? undefined);
      }
    };

    window.addEventListener("storage", handleEvent);

    return () => {
      window.removeEventListener("storage", handleEvent);
    };
  }, [key]);

  return [value, setValue] as const;
}
