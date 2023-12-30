import React from "react";

interface UseEventListenerProps<K> {
  enabled: boolean;
  event: K;
  fn: (e: KeyboardEvent) => void;
}

const useEventListener = <K extends keyof WindowEventMap>(
  props: UseEventListenerProps<K>
) => {
  const { enabled, event, fn } = props;

  React.useEffect(() => {
    const cleanup = () => window.removeEventListener(event, fn);
    if (enabled) {
      window.addEventListener(event, fn);
      return cleanup;
    } else {
      cleanup();
    }
  }, [event, fn, enabled]);
};

export default useEventListener;
