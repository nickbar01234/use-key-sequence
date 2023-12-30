import React from "react";
import { useEventListener } from "./hooks";

interface BaseProps {
  sequences: Record<string, () => unknown>;
  enabled: boolean;
  clearMarker?: KeyboardEvent["key"];
  delay?: number;
  triggerMarker?: KeyboardEvent["key"];
}

type UseKeySequenceProps = BaseProps &
  ({ delay: number } | { triggerMarker: KeyboardEvent["key"] });

const useKeySequence = (props: UseKeySequenceProps) => {
  const { sequences, clearMarker, delay, triggerMarker } = props;
  const [enabled, setEnabled] = React.useState(props.enabled);
  const [sequence, setSequence] = React.useState("");
  const [timeOutId, setTimeOutId] = React.useState<undefined | number>(
    undefined
  );
  const maxContentLength = React.useMemo(
    () => Math.max(...Object.keys(sequences).map((key) => key.length)),
    [sequences]
  );

  const clearTimeOut = React.useCallback(() => {
    clearTimeout(timeOutId);
    setTimeOutId(undefined);
  }, [timeOutId]);

  const reset = React.useCallback(() => {
    clearTimeOut();
    setSequence("");
  }, [clearTimeOut]);

  const execute = React.useCallback(() => {
    const fn = sequences[sequence];
    reset();
    if (fn !== undefined) {
      fn();
    }
  }, [reset, sequence, sequences]);

  const setEnabledWrapper = React.useCallback(
    (enabled: boolean) => {
      setEnabled(enabled);
      if (!enabled) {
        reset();
      }
    },
    [reset]
  );

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing || !enabled) {
        return;
      }

      if (e.key === clearMarker) {
        reset();
      } else if (e.key === triggerMarker) {
        execute();
      } else if (e.key.length === 1) {
        clearTimeOut();
        setSequence((prev) => {
          const newSequence = prev + e.key;
          if (newSequence.length > maxContentLength) {
            reset();
            return "";
          } else {
            return newSequence;
          }
        });
      }
    },
    [
      clearMarker,
      triggerMarker,
      clearTimeOut,
      enabled,
      reset,
      execute,
      maxContentLength,
    ]
  );

  const onKeyUp = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing || !enabled) {
        return;
      }

      if (delay != undefined) {
        const id = setTimeout(() => execute(), delay);
        setTimeOutId(id);
      }
    },
    [delay, execute, enabled]
  );

  useEventListener({
    enabled: enabled,
    event: "keydown",
    fn: onKeyDown,
  });

  useEventListener({
    enabled: enabled,
    event: "keyup",
    fn: onKeyUp,
  });

  return {
    sequence,
    reset,
    setEnabled: setEnabledWrapper,
    execute,
  };
};

export default useKeySequence;
