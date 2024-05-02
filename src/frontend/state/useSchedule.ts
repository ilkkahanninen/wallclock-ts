import { Effect, Fiber, Schedule, pipe } from "effect";
import { DurationInput } from "effect/Duration";
import { useEffect, useMemo, useState } from "react";

export type Result<A, E> = {
  value: A;
  error: E;
};

export const useSchedule = <A, E>(
  effect: Effect.Effect<A, E, never>,
  interval: DurationInput
): Result<A, E> => {
  const [value, setValue] = useState<A>();
  const [error, setError] = useState<E>();

  useEffect(() => {
    const scheduled = Effect.repeat(
      pipe(effect, Effect.tap(setValue)),
      Schedule.spaced(interval)
    );
    const fiber = Effect.runFork(scheduled);
    return () => {
      Effect.runFork(Fiber.interrupt(fiber));
    };
  }, []);

  return useMemo(() => ({ value, error }), [value, error]);
};
