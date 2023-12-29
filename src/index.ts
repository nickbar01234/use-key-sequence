import { useState } from "react";

const useKeySequence = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 2);

  return { count, increment };
};

export default useKeySequence;
