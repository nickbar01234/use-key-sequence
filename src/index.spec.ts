import { describe, it, vi, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";
import useKeySequence from ".";

describe("useKeySequence", () => {
  const CLEAR = "Escape";
  const TRIGGER = "Enter";
  const FN_MARKER = "FOO";
  const FN = vi.fn(() => 0);

  const renderHookGuard = () => {
    const sequences: Record<string, () => unknown> = {};
    sequences[FN_MARKER] = FN;
    return renderHook(() =>
      useKeySequence({
        sequences: sequences,
        enabled: true,
        delay: 1000,
        triggerMarker: TRIGGER,
        clearMarker: CLEAR,
      })
    );
  };

  const keyDown = (input: string) => {
    act(() => {
      for (const x of input) {
        fireEvent.keyDown(window, { key: x });
      }
    });
  };

  let renderHookResult: ReturnType<typeof renderHookGuard>;

  beforeEach(() => {
    renderHookResult = renderHookGuard();
  });

  it("testManualExecute", () => {
    const { result } = renderHookResult;
    keyDown(FN_MARKER);
    act(() => result.current.execute());
    expect(FN).toHaveBeenCalledOnce();
  });

  it("testKeySequenceCaptured", () => {
    const { result } = renderHookResult;
    keyDown(FN_MARKER);
    expect(result.current.sequence).toBe(FN_MARKER);
  });

  it("testKeySequenceReset", () => {
    const { result } = renderHookResult;
    keyDown(FN_MARKER);
    act(() => result.current.reset());
    expect(result.current.sequence).toBe("");
  });

  it("testKeySequenceStopListenResetString", () => {
    const { result } = renderHookResult;
    keyDown(FN_MARKER);
    act(() => result.current.setEnabled(false));
    expect(result.current.sequence).toBe("");
  });

  it("testKeySequenceMaxLengthReset", () => {
    const { result } = renderHookResult;
    keyDown(FN_MARKER.repeat(3));
    expect(result.current.sequence).toBe("");
  });
});
