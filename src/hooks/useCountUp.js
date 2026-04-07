import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current animated value.
 */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    start.current = null;

    const step = (timestamp) => {
      if (!start.current) start.current = timestamp;
      const elapsed = timestamp - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + diff * eased));
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else prev.current = target;
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
