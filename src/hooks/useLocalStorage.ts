import { useCallback, useSyncExternalStore } from "react";

type CallbackFunction = () => void;

function getSnapshot(key: string): string | null {
  return window.localStorage.getItem(key);
}

function setValue(key: string, value: string): void {
  const event = new StorageEvent("storage");
  window.localStorage.setItem(key, value);
  window.dispatchEvent(event);
}

function removeValue(key: string): void {
  const event = new StorageEvent("storage");
  window.localStorage.removeItem(key);
  window.dispatchEvent(event);
}

export function useLocalStorage(
  key: string
): [string | null, (value: string | null) => void] {
  function subscribe(callback: CallbackFunction): CallbackFunction {
    const handleEvent = (event: StorageEvent) => {
      if (event.key === key) {
        callback();
      }
    };

    window.addEventListener("storage", handleEvent);

    return () => {
      window.removeEventListener("storage", handleEvent);
    };
  }

  const updateValue = useCallback(
    (value: string | null) => {
      if (value) {
        setValue(key, value);
      } else {
        removeValue(key);
      }
    },
    [key]
  );

  const value = useSyncExternalStore<string | null>(subscribe, () =>
    getSnapshot(key)
  );

  return [value, updateValue];
}
