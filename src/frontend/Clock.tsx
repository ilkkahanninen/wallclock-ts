import { bem } from "./bem";
import { clock } from "./state/clock";
import { renderScheduled, useSchedule } from "./state/useSchedule";

const cx = bem("Clock");

export const Clock = () => {
  const clockValue = useSchedule(clock, "1 second");
  return renderScheduled(clockValue, (time) => (
    <div {...cx({ time: true })}>{time}</div>
  ));
};
