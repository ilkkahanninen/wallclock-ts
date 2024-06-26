import { bem } from "./bem";
import { playerStatus } from "./state/bluos";
import { renderScheduled, useSchedule } from "./state/useSchedule";
import "./styles/BluOS.css";

const cx = bem("BluOS");

export const BluOS = () => {
  const currentStatus = useSchedule(playerStatus, "5 seconds");

  return renderScheduled(currentStatus, (status) =>
    status.playing ? (
      <div {...cx({ container: true })}>
        <img {...cx({ cover: true })} src={status.image} />
        <ul {...cx({ titles: true })}>
          {status.titles.map((title, i) => (
            <li key={i}>{title}</li>
          ))}
        </ul>
      </div>
    ) : null
  );
};
