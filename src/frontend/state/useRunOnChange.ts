import { Effect, runPromise } from "effect/Effect";
import { useEffect, useState } from "react";

export const useRunOnChange = <I, T, E>(
  f: (i: I) => Effect<T, E>,
  input?: I
) => {
  const [result, setResult] = useState<T>();

  useEffect(() => {
    let isMounted = true;
    if (input) {
      const fx = f(input);
      runPromise(fx).then((result) => {
        if (isMounted) {
          setResult(result);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [f, input]);

  return result;
};
