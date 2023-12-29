import React from "react";

type Sequence = string;
type SequenceFn = (key: string) => any;

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

  const clearTimeOut = () => {
    clearTimeout(timeOutId);
    setTimeOutId(undefined);
  };

  const reset = () => {
    setSequence("");
    clearTimeOut();
  };

  const execute = () => {
    const fn = sequences[sequence];
    if (fn != undefined) {
      fn(sequence);
    }
    reset();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.isComposing || !listen) {
      return;
    }

    if (e.key === clearMarker) {
      reset();
    } else if (e.key === triggerMarker) {
      execute();
    } else if (e.key.length === 1) {
      clearTimeOut();
      setSequence((prev) => sequence + prev);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.isComposing || !listen) {
      return;
    }

    if (delay != undefined) {
      const id = setTimeout(execute, delay);
      setTimeOutId(id);
    }
  };

  React.useEffect(() => {
    const cleanup = () => window.removeEventListener("keydown", onKeyDown);

    if (shouldListen) {
      window.addEventListener("keydown", onKeyDown);
      return cleanup;
    } else {
      cleanup();
    }
  }, [shouldListen]);

  React.useEffect(() => {
    const cleanup = () => window.removeEventListener("keyup", onKeyUp);

    if (shouldListen) {
      window.addEventListener("keyup", onKeyUp);
      return cleanup;
    } else {
      cleanup();
    }
  }, [shouldListen]);

  return {
    sequence,
    setListen,
    reset,
    execute,
  };
};

export default useKeySequence;
