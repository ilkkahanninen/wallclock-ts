import { bem } from "./bem";
import { clock } from "./state/clock";
import { useSchedule } from "./state/useSchedule";

const cx = bem("Clock");

export const Clock = () => {
  const { value: time } = useSchedule(clock, "1 second");
  return <div {...cx({ time: true })}>{time}</div>;
};
