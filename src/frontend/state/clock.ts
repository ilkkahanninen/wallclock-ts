import { Effect } from "effect";

export const formatHhMm = (hh: number, mm: number) =>
  [hh, mm].map((n) => n.toString().padStart(2, "0")).join(".");

const formatTime = (time: Date) =>
  formatHhMm(time.getHours(), time.getMinutes());

export const clock = Effect.sync(() => formatTime(new Date()));
