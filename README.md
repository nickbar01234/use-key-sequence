# use-key-sequence

A React hook to bind a sequence of printable characters to a callback.

## Installation

Install with `npm`, `yarn`, or `pnpm`.

```shell
# npm
npm install use-key-seuqnece

# yarn
yarn add use-key-sequence

# pnpm
pnpm install use-key-sequence
```

## Usage

### With Delay

`useKeySequence` will run the callback when the user releases the key (i.e triggering `keyup` event).

```jsx
import useKeySequence from "use-key-sequence";

const Demo = () => {
  const { sequence } = useKeySequence({
    sequences: {
      j: () => console.log("Pressed j"),
    },
    enabled: true,
    delayed: 1000, // ms
    clearMarker: "Escape",
  });
};
```

When the user releases the key, the hook will attempt to find a callback matching
the sequence of key pressed after the `delayed` is completed. If there is no
matching callback, the `sequence` is reset to an empty string. Otherwise,
`sequences[sequence]` will be executed. At any point, if the user enters `<Esc>`
the input sequence will be cleared.

### With Input

Instead of delaying, `useKeySequence` can listen to a key which will trigger
the callback via `triggerMarker`.

```jsx
import useKeySequence from "use-key-sequence";

const Demo = () => {
  const { sequence } = useKeySequence({
    sequences: {
      j: () => console.log("Pressed j"),
    },
    enabled: true,
    triggerMarker: "Enter",
  });
};
```

Note that either `triggerMarker` or `delay` must be provided as props.

### Delaying Callback

`enabled` dictates whether the hook should be listening to keystroke initially.
To enable or disable event listener, use `setEnabled` setter returned by the hook.

```jsx
import useKeySequence from "use-key-sequence";

const Demo = () => {
  const { setEnabled } = useKeySequence({
    sequences: {
      j: () => console.log("Pressed j"),
    },
    triggerMarker: "Enter",
    delay: 1000,
  });

  return <button onClick={() => setEnabled(true)}>Enable me</button>;
};
```

### Manual Execution

If necessary, it's possible to manually trigger the callback that is binded
to the current keystroke sequence or reset the sequence using the returned
values from the hook.

```jsx
import useKeySequence from "use-key-sequence";

const Demo = () => {
  const { reset, execute } = useKeySequence({
    sequences: {
      j: () => console.log("Pressed j"),
    },
    triggerMarker: "Enter",
    delay: 1000,
  });
};
```
