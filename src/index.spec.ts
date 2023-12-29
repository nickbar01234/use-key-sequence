import { describe, it, vi, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import useKeySequence from ".";

describe("useKeySequence", () => {
  it("Trigger function with empty string", () => {
    const fn = vi.fn(() => 0);
    const { result } = renderHook(() =>
      useKeySequence({
        sequences: { "": fn },
        shouldListen: true,
        delay: 0,
      })
    );
    act(() => result.current.execute());
    expect(fn).toHaveBeenCalledOnce();
  });
});
