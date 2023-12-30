import React from "react";

type Sequence = string;
type SequenceFn = (key: string) => unknown;

interface BaseProps {
  sequences: Record<Sequence, SequenceFn>;
  shouldListen: boolean;
  clearMarker?: string;
  delay?: number;
  triggerMarker?: string;
}

type UseKeySequenceProps = BaseProps &
  ({ delay: number } | { triggerMarker: string });

const useKeySequence = (props: UseKeySequenceProps) => {
  const { sequences, clearMarker, delay, triggerMarker, shouldListen } = props;
  const [listen, setListen] = React.useState(shouldListen);
  const [sequence, setSequence] = React.useState("");
  const [timeOutId, setTimeOutId] = React.useState<undefined | number>(
    undefined
  );

  const clearTimeOut = React.useCallback(() => {
    clearTimeout(timeOutId);
    setTimeOutId(undefined);
  }, [timeOutId]);

  const reset = React.useCallback(() => {
    setSequence("");
    clearTimeOut();
  }, [clearTimeOut]);

  const execute = React.useCallback(
    (sequence: string) => {
      const fn = sequences[sequence];
      if (fn !== undefined) {
        fn(sequence);
      }
      reset();
    },
    [reset, sequences]
  );

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing || !listen) {
        return;
      }

      if (e.key === clearMarker) {
        reset();
      } else if (e.key === triggerMarker) {
        execute(sequence);
      } else if (e.key.length === 1) {
        clearTimeOut();
        setSequence((prev) => prev + e.key);
      }
    },
    [clearMarker, triggerMarker, clearTimeOut, listen, reset, sequence, execute]
  );

  const onKeyUp = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.isComposing || !listen) {
        return;
      }

      if (delay != undefined) {
        const id = setTimeout(() => execute(sequence), delay);
        setTimeOutId(id);
      }
    },
    [sequence, delay, execute, listen]
  );

  React.useEffect(() => {}, [delay]);

  React.useEffect(() => {
    const cleanup = () => window.removeEventListener("keydown", onKeyDown);

    if (shouldListen) {
      window.addEventListener("keydown", onKeyDown);
      return cleanup;
    } else {
      cleanup();
    }
  }, [shouldListen, onKeyDown]);

  React.useEffect(() => {
    const cleanup = () => window.removeEventListener("keyup", onKeyUp);

    if (shouldListen) {
      window.addEventListener("keyup", onKeyUp);
      return cleanup;
    } else {
      cleanup();
    }
  }, [shouldListen, onKeyUp]);

  return {
    sequence,
    setListen,
    reset,
    execute,
  };
};

export default useKeySequence;
