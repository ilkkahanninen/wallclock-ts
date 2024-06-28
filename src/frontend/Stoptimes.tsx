import { Stop, Stoptime } from "../backend/digitransit";
import { bem } from "./bem";
import { formatHhMm } from "./state/clock";
import { getStoptimes } from "./state/hsl";
import { renderScheduled, useSchedule } from "./state/useSchedule";
import "./styles/Stoptimes.css";

const cx = bem("Stoptimes");

export type BusStopProps = {
  id: string;
};

export const BusStop = (props: BusStopProps) => {
  const stoptimes = useSchedule(getStoptimes(props.id), "1 minute");
  return renderScheduled(
    stoptimes,
    (stoptimes) => <Stoptimes {...stoptimes} />,
    (error) => (
      <div className="error">
        Pysäkkitietoja ei saatu ladattua ({error.message})
      </div>
    )
  );
};

export type StoptimesProps = Stop;

export const Stoptimes = (props: StoptimesProps) => {
  const now = secondsSinceMidnight();

  return (
    <div className="Stoptimes">
      <h2 {...cx({ title: true })}>
        {props.name} <span {...cx({ code: true })}>{props.code}</span>
      </h2>
      <ul {...cx({ list: true })}>
        {props.stoptimes.map((stop, index) => (
          <li key={index} {...cx({ item: stop.realtime ? "realtime" : true })}>
            <span {...cx({ routeName: true })}>{stop.routeName}</span>
            <span {...cx({ headsign: true })}>{stop.shortHeadsign}</span>
            <span {...cx({ duration: true })}>{formatDuration(now, stop)}</span>
            <span {...cx({ time: true })}>
              {formatStoptime(stop.departure)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDuration = (now: number, stoptime: Stoptime) => {
  const interval = intervalMinutes(now, stoptime.departure);
  return interval <= 10 ? `${interval} min` : null;
};

const intervalMinutes = (from: number, to: number) =>
  Math.round((to - from) / 60);

const formatStoptime = (time: number): string => {
  const minutes = Math.round(time / 60);
  return formatHhMm(Math.floor(minutes / 60) % 24, minutes % 60);
};

const secondsSinceMidnight = () => {
  const now = new Date();
  return (
    Math.round(
      now.getTime() -
        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    ) / 1000
  );
};
