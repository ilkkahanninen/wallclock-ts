import { Effect, Either, Fiber, Option, Schedule, flow, pipe } from "effect";
import { DurationInput } from "effect/Duration";
import { useEffect, useState } from "react";

export type Scheduled<A, E> = Option.Option<Either.Either<A, E>>;

export const useSchedule = <A, E>(
  effect: Effect.Effect<A, E, never>,
  interval: DurationInput
): Scheduled<A, E> => {
  const [result, setResult] = useState<Either.Either<A, E>>();

  useEffect(() => {
    const scheduled = Effect.repeat(
      pipe(
        effect,
        Effect.tapBoth({
          onSuccess(a) {
            setResult(Either.right(a));
            return Effect.succeed(a);
          },
          onFailure(e) {
            setResult(Either.left(e));
            return Effect.fail(e);
          },
        }),
        Effect.retry(Schedule.exponential(1000))
      ),
      Schedule.spaced(interval)
    );
    const fiber = Effect.runFork(scheduled);
    return () => {
      Effect.runFork(Fiber.interrupt(fiber));
    };
  }, []);

  return Option.fromNullable(result);
};

export const renderScheduled = <A, E>(
  scheduled: Scheduled<A, E>,
  renderSuccess: (a: A) => JSX.Element | null,
  renderFailure?: (e: E) => JSX.Element | null
): JSX.Element | null =>
  pipe(
    scheduled,
    Option.map(
      flow(
        Either.map(renderSuccess),
        Either.getOrElse(renderFailure || ErrorMsg)
      )
    ),
    Option.getOrElse(() => null)
  );

const ErrorMsg = (): JSX.Element => <div className="error">Error</div>;
